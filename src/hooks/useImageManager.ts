/**
 * useImageManager.ts
 *
 * Core hook for the image upload system. Handles the full lifecycle:
 *   1. File validation
 *   2. Frontend compression (browser-image-compression)
 *   3. Backend signature request (validates limits)
 *   4. Direct Cloudinary upload
 *   5. Backend confirm (persists Image_Record + increments counter)
 *   6. Optimistic UI updates with server reconciliation
 *   7. Soft delete / restore / permanent delete
 */

import { useState, useCallback, useEffect } from "react";
import imageCompression from "browser-image-compression";
import { useSubscriptionStore } from "../store/subscriptionStore";
import {
  getImageSignature,
  confirmImageUpload,
  getRecordImages,
  getImageUsage,
  softDeleteImage,
  restoreImage,
  permanentDeleteImage,
} from "../services/image.service";
import type {
  ImageRecord,
  RecordType,
  UploadStage,
  ImageErrorCode,
} from "../type/ImageType";

// ─── Compression options (mandatory per requirements) ─────────────────────────
const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  preserveExif: false,
};

// ─── File validation limits ───────────────────────────────────────────────────
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB pre-compression

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ImageManagerState {
  /** Active (non-soft-deleted) images for this record */
  images: ImageRecord[];
  /** Current upload stage for progress indicator */
  uploadStage: UploadStage;
  /** Whether an upload is in progress */
  isUploading: boolean;
  /** Human-readable error message */
  error: string | null;
  /** Typed error code for programmatic handling */
  errorCode: ImageErrorCode | null;
  /** Number of active images on this record */
  perRecordCount: number;
  /** Max images allowed per record for this user's plan */
  perRecordLimit: number;
  /** Whether this record has reached its per-record limit */
  isAtPerRecordLimit: boolean;
  /** User's total images uploaded across all records */
  globalCount: number;
  /** Global limit (30 for free, null for pro) */
  globalLimit: number | null;
  /** Whether the user has hit the global free limit */
  isAtGlobalLimit: boolean;
  /** User's plan */
  plan: "free" | "pro";
}

export interface UseImageManagerReturn extends ImageManagerState {
  /** Upload a new image file */
  upload: (file: File) => Promise<void>;
  /** Soft-delete an image (moves to trash, 30-day restore window) */
  softDelete: (imageId: string) => Promise<void>;
  /** Restore a soft-deleted image */
  restore: (imageId: string) => Promise<void>;
  /** Permanently delete an image from Cloudinary + DB */
  permanentDelete: (imageId: string) => Promise<void>;
  /** Clear the current error */
  clearError: () => void;
  /** Reload images from server */
  refresh: () => Promise<void>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useImageManager(
  recordId: string,
  recordType: RecordType
): UseImageManagerReturn {
  const { plan: storePlan, isProActive } = useSubscriptionStore();

  const [images, setImages] = useState<ImageRecord[]>([]);
  const [uploadStage, setUploadStage] = useState<UploadStage>("idle");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<ImageErrorCode | null>(null);

  // Usage counters — seeded from subscription store, reconciled with server
  const effectivePlan: "free" | "pro" =
    isProActive || storePlan === "pro" ? "pro" : "free";
  const defaultPerRecordLimit = effectivePlan === "pro" ? 5 : 2;
  const defaultGlobalLimit = effectivePlan === "free" ? 30 : null;

  const [perRecordLimit, setPerRecordLimit] = useState(defaultPerRecordLimit);
  const [globalCount, setGlobalCount] = useState(0);
  const [globalLimit, setGlobalLimit] = useState<number | null>(defaultGlobalLimit);
  const [plan, setPlan] = useState<"free" | "pro">(effectivePlan);

  // Derived
  const perRecordCount = images.length;
  const isAtPerRecordLimit = perRecordCount >= perRecordLimit;
  const isAtGlobalLimit =
    plan === "free" && globalLimit !== null && globalCount >= globalLimit;

  // ─── Load images + usage on mount ──────────────────────────────────────────

  const refresh = useCallback(async () => {
    if (!recordId) return;
    try {
      const [imgs, usage] = await Promise.all([
        getRecordImages(recordType, recordId),
        getImageUsage(),
      ]);
      setImages(imgs);
      setGlobalCount(usage.totalImagesUploaded);
      setGlobalLimit(usage.globalLimit);
      setPerRecordLimit(usage.perRecordLimit);
      setPlan(usage.plan);
    } catch (err) {
      console.warn("[useImageManager] Failed to load images:", err);
    }
  }, [recordId, recordType]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ─── Upload ────────────────────────────────────────────────────────────────

  const upload = useCallback(
    async (file: File) => {
      setError(null);
      setErrorCode(null);

      // ── Validate file type ──
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        setErrorCode("invalid_file");
        return;
      }

      // ── Validate file size (pre-compression) ──
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError("File is too large. Maximum size is 50MB");
        setErrorCode("file_too_large");
        return;
      }

      // ── Client-side limit guard (optimistic, server is source of truth) ──
      if (isAtPerRecordLimit) {
        setError(`Maximum images reached for this entry (${perRecordCount}/${perRecordLimit})`);
        setErrorCode("per_record_limit_reached");
        return;
      }

      if (isAtGlobalLimit) {
        setError("You've reached your free image limit. Upgrade to Pro for unlimited images");
        setErrorCode("global_limit_reached");
        return;
      }

      setIsUploading(true);

      try {
        // ── Stage 1: Compress ──
        setUploadStage("compressing");
        let compressedFile: File;
        try {
          compressedFile = await imageCompression(file, COMPRESSION_OPTIONS);
        } catch {
          // If compression fails, fall back to original file
          console.warn("[useImageManager] Compression failed, using original file");
          compressedFile = file;
        }

        // ── Stage 2: Get signature (validates limits server-side) ──
        setUploadStage("uploading");
        let signatureData;
        try {
          signatureData = await getImageSignature(recordId, recordType);
        } catch (err: unknown) {
          const axiosErr = err as { response?: { data?: { errors?: Array<{ code: string }>; message?: string } } };
          const code = axiosErr?.response?.data?.errors?.[0]?.code;
          const message = axiosErr?.response?.data?.message;

          if (code === "per_record_limit_reached") {
            setError("Maximum images reached for this entry");
            setErrorCode("per_record_limit_reached");
          } else if (code === "global_limit_reached") {
            setError("You've reached your free image limit. Upgrade to Pro for unlimited images");
            setErrorCode("global_limit_reached");
          } else if (!navigator.onLine) {
            setError("No internet connection. Please check your network and try again.");
            setErrorCode("network_error");
          } else {
            setError(message || "Failed to start upload. Please try again.");
            setErrorCode("upload_failed");
          }
          return;
        }

        // Optimistic counter update from signature response
        setGlobalCount(signatureData.globalCount + 1);
        setPerRecordLimit(signatureData.perRecordLimit);
        setGlobalLimit(signatureData.globalLimit);
        setPlan(signatureData.plan);

        // ── Stage 3: Upload directly to Cloudinary ──
        const formData = new FormData();
        formData.append("file", compressedFile);
        formData.append("api_key", signatureData.apiKey);
        formData.append("timestamp", signatureData.timestamp.toString());
        formData.append("signature", signatureData.signature);
        formData.append("folder", signatureData.folder);
        formData.append("public_id", signatureData.publicId);

        let cloudinaryResult: { public_id: string; url: string; secure_url: string };
        try {
          const cloudRes = await fetch(
            `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
            { method: "POST", body: formData }
          );

          if (!cloudRes.ok) {
            throw new Error(`Cloudinary upload failed: ${cloudRes.status}`);
          }

          cloudinaryResult = await cloudRes.json();
        } catch {
          // Revert optimistic counter update
          setGlobalCount((c) => Math.max(0, c - 1));
          if (!navigator.onLine) {
            setError("No internet connection. Please check your network and try again.");
            setErrorCode("network_error");
          } else {
            setError("Upload failed. Please try again.");
            setErrorCode("upload_failed");
          }
          return;
        }

        // ── Stage 4: Confirm with backend (persists record + increments counter) ──
        setUploadStage("saving");
        let imageRecord: ImageRecord;
        try {
          imageRecord = await confirmImageUpload({
            publicId: cloudinaryResult.public_id,
            url: cloudinaryResult.url,
            secureUrl: cloudinaryResult.secure_url,
            recordId,
            recordType,
          });
        } catch (err: unknown) {
          // Revert optimistic counter update
          setGlobalCount((c) => Math.max(0, c - 1));
          const axiosErr = err as { response?: { data?: { errors?: Array<{ code: string }>; message?: string } } };
          const code = axiosErr?.response?.data?.errors?.[0]?.code;

          if (code === "per_record_limit_reached") {
            setError("Maximum images reached for this entry");
            setErrorCode("per_record_limit_reached");
          } else if (code === "global_limit_reached") {
            setError("You've reached your free image limit");
            setErrorCode("global_limit_reached");
          } else {
            setError("Failed to save image. Please try again.");
            setErrorCode("upload_failed");
          }
          return;
        }

        // ── Success: add to local state ──
        setImages((prev) => [...prev, imageRecord]);
        setUploadStage("done");

        // Reconcile with server after a short delay
        setTimeout(() => {
          refresh();
          setUploadStage("idle");
        }, 1500);
      } finally {
        setIsUploading(false);
      }
    },
    [
      recordId,
      recordType,
      isAtPerRecordLimit,
      isAtGlobalLimit,
      perRecordCount,
      perRecordLimit,
      refresh,
    ]
  );

  // ─── Soft delete ───────────────────────────────────────────────────────────

  const softDelete = useCallback(
    async (imageId: string) => {
      // Optimistic: remove from active list immediately
      setImages((prev) => prev.filter((img) => img.id !== imageId));

      try {
        await softDeleteImage(imageId);
      } catch {
        // Revert on failure
        await refresh();
        setError("Failed to delete image. Please try again.");
      }
    },
    [refresh]
  );

  // ─── Restore ───────────────────────────────────────────────────────────────

  const restore = useCallback(
    async (imageId: string) => {
      try {
        const restored = await restoreImage(imageId);
        setImages((prev) => [...prev, restored]);
      } catch {
        setError("Failed to restore image. The restore window may have expired.");
        await refresh();
      }
    },
    [refresh]
  );

  // ─── Permanent delete ──────────────────────────────────────────────────────

  const permanentDelete = useCallback(
    async (imageId: string) => {
      // Optimistic: remove from list + decrement global counter
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      setGlobalCount((c) => Math.max(0, c - 1));

      try {
        await permanentDeleteImage(imageId);
        // Reconcile with server
        await refresh();
      } catch {
        // Revert on failure
        await refresh();
        setError("Failed to permanently delete image. Please try again.");
      }
    },
    [refresh]
  );

  // ─── Clear error ───────────────────────────────────────────────────────────

  const clearError = useCallback(() => {
    setError(null);
    setErrorCode(null);
    if (uploadStage === "error") setUploadStage("idle");
  }, [uploadStage]);

  return {
    images,
    uploadStage,
    isUploading,
    error,
    errorCode,
    perRecordCount,
    perRecordLimit,
    isAtPerRecordLimit,
    globalCount,
    globalLimit,
    isAtGlobalLimit,
    plan,
    upload,
    softDelete,
    restore,
    permanentDelete,
    clearError,
    refresh,
  };
}
