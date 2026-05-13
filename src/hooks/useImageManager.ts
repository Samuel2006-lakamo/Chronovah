/**
 * useImageManager.ts
 *
 * Core hook for the image upload system. Handles the full lifecycle:
 *   1. Offline detection — blocks upload with a clear message
 *   2. File validation
 *   3. Frontend compression (browser-image-compression)
 *   4. Backend signature request (validates limits server-side)
 *   5. Direct Cloudinary upload
 *   6. Backend confirm (persists Image_Record + increments counter)
 *   7. Optimistic UI updates with server reconciliation
 *   8. Soft delete / restore / permanent delete
 *   9. Session cancel cleanup — permanently deletes images uploaded in the
 *      current editor session if the user cancels without saving
 */

import { useState, useCallback, useEffect, useRef } from "react";
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

// ─── Compression options ──────────────────────────────────────────────────────
const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  preserveExif: false,
};

// ─── File validation ──────────────────────────────────────────────────────────
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB pre-compression

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ImageManagerState {
  images: ImageRecord[];
  uploadStage: UploadStage;
  isUploading: boolean;
  error: string | null;
  errorCode: ImageErrorCode | null;
  perRecordCount: number;
  perRecordLimit: number;
  isAtPerRecordLimit: boolean;
  globalCount: number;
  globalLimit: number | null;
  isAtGlobalLimit: boolean;
  plan: "free" | "pro";
  /** True when the browser has no network connection */
  isOffline: boolean;
}

export interface UseImageManagerReturn extends ImageManagerState {
  upload: (file: File) => Promise<void>;
  softDelete: (imageId: string) => Promise<void>;
  restore: (imageId: string) => Promise<void>;
  permanentDelete: (imageId: string) => Promise<void>;
  clearError: () => void;
  refresh: () => Promise<void>;
  /**
   * Call when the editor is cancelled without saving.
   * Permanently deletes any images uploaded during this session so they
   * don't become orphans in Cloudinary or count against the user's limit.
   */
  cancelSession: () => Promise<void>;
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
  const [isOffline, setIsOffline] = useState(false); // start optimistic — only go offline when event fires

  // Track image IDs uploaded in this editor session for cancel cleanup
  const sessionImageIds = useRef<Set<string>>(new Set());
  const postUploadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Seed counters from subscription store; reconciled with server on load
  const effectivePlan: "free" | "pro" =
    isProActive || storePlan === "pro" ? "pro" : "free";

  const [perRecordLimit, setPerRecordLimit] = useState(
    effectivePlan === "pro" ? 5 : 2
  );
  const [globalCount, setGlobalCount] = useState(0);
  const [globalLimit, setGlobalLimit] = useState<number | null>(
    effectivePlan === "free" ? 30 : null
  );
  const [plan, setPlan] = useState<"free" | "pro">(effectivePlan);

  const perRecordCount = images.length;
  const isAtPerRecordLimit = perRecordCount >= perRecordLimit;
  const isAtGlobalLimit =
    plan === "free" && globalLimit !== null && globalCount >= globalLimit;

  // ─── Online / offline listeners ───────────────────────────────────────────

  useEffect(() => {
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // ─── Load images + usage on mount ────────────────────────────────────────

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

  // ─── Cleanup timer on unmount ─────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (postUploadTimer.current) {
        clearTimeout(postUploadTimer.current);
        postUploadTimer.current = null;
      }
    };
  }, []);

  // ─── Upload ───────────────────────────────────────────────────────────────

  const upload = useCallback(
    async (file: File) => {
      setError(null);
      setErrorCode(null);

      // Block immediately if offline (best-effort — actual network errors are
      // caught per-stage below with more reliable detection)
      if (isOffline) {
        setError(
          "You're offline right now. Photo uploads need an internet connection — your other changes will still save. Come back online and edit this entry to add photos."
        );
        setErrorCode("network_error");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file (JPG, PNG, or WebP)");
        setErrorCode("invalid_file");
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError("That file is too large. Please choose an image under 50MB");
        setErrorCode("file_too_large");
        return;
      }

      if (isAtPerRecordLimit) {
        setError(
          `You've reached the photo limit for this entry (${perRecordCount}/${perRecordLimit})`
        );
        setErrorCode("per_record_limit_reached");
        return;
      }

      if (isAtGlobalLimit) {
        const limitText = globalLimit ? `all ${globalLimit} free photo slots` : 'your free photo slots';
        setError(
          `You've used ${limitText}. Upgrade to Pro for unlimited photos`
        );
        setErrorCode("global_limit_reached");
        return;
      }

      setIsUploading(true);

      try {
        // Stage 1 — compress
        setUploadStage("compressing");
        let compressedFile: File;
        try {
          compressedFile = await imageCompression(file, COMPRESSION_OPTIONS);
        } catch {
          console.warn("[useImageManager] Compression failed, using original");
          compressedFile = file;
        }

        // Stage 2 — get signed upload token (validates limits server-side)
        setUploadStage("uploading");
        let signatureData;
        try {
          signatureData = await getImageSignature(recordId, recordType);
        } catch (err: unknown) {
          const axiosErr = err as {
            response?: {
              status?: number;
              data?: {
                errors?: Array<{ code: string }>;
                message?: string;
                error?: string;
              };
            };
            code?: string;
            message?: string;
          };
          const code = axiosErr?.response?.data?.errors?.[0]?.code;
          const message =
            axiosErr?.response?.data?.message ||
            axiosErr?.response?.data?.error;

          // Only treat as network error when the error is explicitly a network
          // failure — NOT just because there's no response (that also covers
          // auth errors, CORS, etc.)
          const isNetworkError =
            axiosErr?.code === "ERR_NETWORK" ||
            axiosErr?.code === "ECONNABORTED" ||
            axiosErr?.message === "Network Error" ||
            (axiosErr?.message?.toLowerCase().includes("network") && !axiosErr?.response);

          if (code === "per_record_limit_reached") {
            setError("You've reached the photo limit for this entry");
            setErrorCode("per_record_limit_reached");
          } else if (code === "global_limit_reached") {
            const limitText = globalLimit ? `all ${globalLimit} free photo slots` : "your free photo slots";
            setError(`You've used ${limitText}. Upgrade to Pro for unlimited photos`);
            setErrorCode("global_limit_reached");
          } else if (isNetworkError) {
            setError(
              "You're offline right now. Photo uploads need an internet connection — your other changes will still save. Come back online and edit this entry to add photos."
            );
            setErrorCode("network_error");
          } else {
            // Show the actual server error message so we can debug it
            setError(message || "Couldn't start the upload. Please try again.");
            setErrorCode("upload_failed");
          }
          return;
        }

        // Optimistic counter update
        setGlobalCount(signatureData.globalCount + 1);
        setPerRecordLimit(signatureData.perRecordLimit);
        setGlobalLimit(signatureData.globalLimit);
        setPlan(signatureData.plan);

        // Stage 3 — upload directly to Cloudinary
        const formData = new FormData();
        formData.append("file", compressedFile);
        formData.append("api_key", signatureData.apiKey);
        formData.append("timestamp", signatureData.timestamp.toString());
        formData.append("signature", signatureData.signature);
        formData.append("folder", signatureData.folder);
        formData.append("public_id", signatureData.publicId);

        let cloudinaryResult: {
          public_id: string;
          url: string;
          secure_url: string;
        };
        try {
          const cloudRes = await fetch(
            `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
            { method: "POST", body: formData }
          );
          if (!cloudRes.ok) {
            throw new Error(`Cloudinary upload failed: ${cloudRes.status}`);
          }
          cloudinaryResult = await cloudRes.json();
        } catch (fetchErr: unknown) {
          setGlobalCount((c) => Math.max(0, c - 1));
          // "Failed to fetch" TypeError = network unreachable
          // Check the message explicitly rather than just instanceof TypeError
          const isNetworkError =
            (fetchErr instanceof TypeError &&
              (fetchErr.message.includes("fetch") ||
               fetchErr.message.includes("network") ||
               fetchErr.message.includes("Failed"))) ||
            (fetchErr instanceof Error && fetchErr.message.includes("NetworkError"));

          if (isNetworkError) {
            setError(
              "You're offline right now. Photo uploads need an internet connection — your other changes will still save. Come back online and edit this entry to add photos."
            );
            setErrorCode("network_error");
          } else {
            setError("Upload failed. Please try again.");
            setErrorCode("upload_failed");
          }
          return;
        }

        // Stage 4 — confirm with backend (persists record + increments counter)
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
          setGlobalCount((c) => Math.max(0, c - 1));
          const axiosErr = err as {
            response?: {
              data?: {
                errors?: Array<{ code: string }>;
              };
            };
          };
          const code = axiosErr?.response?.data?.errors?.[0]?.code;

          if (code === "per_record_limit_reached") {
            setError("You've reached the photo limit for this entry");
            setErrorCode("per_record_limit_reached");
          } else if (code === "global_limit_reached") {
            const limitText = globalLimit ? `all ${globalLimit} free photo slots` : 'your free photo slots';
            setError(
              `You've used ${limitText}. Upgrade to Pro for unlimited photos`
            );
            setErrorCode("global_limit_reached");
          } else {
            setError("Photo uploaded but couldn't be saved. Please try again.");
            setErrorCode("upload_failed");
          }
          return;
        }

        // Success
        setImages((prev) => [...prev, imageRecord]);
        sessionImageIds.current.add(imageRecord.id);
        setUploadStage("done");

        // Clear any existing timer before setting a new one
        if (postUploadTimer.current) {
          clearTimeout(postUploadTimer.current);
        }
        postUploadTimer.current = setTimeout(() => {
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

  // ─── Cancel session cleanup ───────────────────────────────────────────────

  const cancelSession = useCallback(async () => {
    const ids = Array.from(sessionImageIds.current);
    if (ids.length === 0) return;

    sessionImageIds.current.clear();

    // Optimistic UI update
    setImages((prev) => prev.filter((img) => !ids.includes(img.id)));
    setGlobalCount((c) => Math.max(0, c - ids.length));

    // Fire-and-forget — errors are logged but don't block the cancel
    await Promise.allSettled(
      ids.map((id) =>
        permanentDeleteImage(id).catch((err) =>
          console.warn(
            `[useImageManager] cancelSession: failed to delete ${id}:`,
            err
          )
        )
      )
    );
  }, []);

  // ─── Soft delete ──────────────────────────────────────────────────────────

  const softDelete = useCallback(
    async (imageId: string) => {
      sessionImageIds.current.delete(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      try {
        await softDeleteImage(imageId);
      } catch {
        await refresh();
        setError("Couldn't delete that photo. Please try again.");
      }
    },
    [refresh]
  );

  // ─── Restore ─────────────────────────────────────────────────────────────

  const restore = useCallback(
    async (imageId: string) => {
      try {
        const restored = await restoreImage(imageId);
        setImages((prev) => [...prev, restored]);
      } catch {
        setError(
          "Couldn't restore that photo. The 30-day restore window may have expired."
        );
        await refresh();
      }
    },
    [refresh]
  );

  // ─── Permanent delete ─────────────────────────────────────────────────────

  const permanentDelete = useCallback(
    async (imageId: string) => {
      sessionImageIds.current.delete(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      setGlobalCount((c) => Math.max(0, c - 1));
      try {
        await permanentDeleteImage(imageId);
        await refresh();
      } catch {
        await refresh();
        setError("Couldn't permanently delete that photo. Please try again.");
      }
    },
    [refresh]
  );

  // ─── Clear error ──────────────────────────────────────────────────────────

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
    isOffline,
    upload,
    softDelete,
    restore,
    permanentDelete,
    clearError,
    refresh,
    cancelSession,
  };
}
