/**
 * ImageUpload.tsx
 *
 * Complete image upload UI component. Integrates:
 *  - Offline detection with a clear, friendly banner
 *  - Drag-and-drop + click-to-upload
 *  - Frontend compression (browser-image-compression)
 *  - Per-record counter (X of Y)
 *  - Global free tier counter (X of 30 free images used)
 *  - Dual limit enforcement with upgrade prompts
 *  - Staged progress indicator (compressing → uploading → saving)
 *  - Soft delete / permanent delete via ImageGallery
 *  - Session cancel cleanup — call cancelSession() when the editor is closed
 *    without saving to remove any uploaded-but-unsaved images from Cloudinary
 *  - Mobile-responsive with 44×44px tap targets
 *
 * Usage:
 *   const uploadRef = useRef<ImageUploadHandle>(null);
 *   <ImageUpload ref={uploadRef} recordId={entry.id} recordType="journal" />
 *   // On cancel: await uploadRef.current?.cancelSession()
 */

import { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Camera,
  Loader,
  AlertCircle,
  CheckCircle,
  Zap,
  X,
  WifiOff,
} from "lucide-react";
import { useImageManager } from "../hooks/useImageManager";
import ImageGallery from "./ImageGallery";
import ImageCounter from "./ImageCounter";
import type { RecordType } from "../type/ImageType";

// ─── Public handle exposed via ref ────────────────────────────────────────────

export interface ImageUploadHandle {
  /**
   * Permanently deletes any images uploaded during this editor session.
   * Call this when the user cancels the editor without saving.
   */
  cancelSession: () => Promise<void>;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ImageUploadProps {
  recordId: string;
  recordType: RecordType;
  /** Called whenever the active image list changes (secureUrls for parent state sync) */
  onImagesChange?: (secureUrls: string[]) => void;
}

// Stage labels shown in the progress indicator
const STAGE_LABELS: Record<string, string> = {
  compressing: "Compressing…",
  uploading: "Uploading…",
  saving: "Saving…",
  done: "Saved!",
};

// ─── Component ────────────────────────────────────────────────────────────────

const ImageUpload = forwardRef<ImageUploadHandle, ImageUploadProps>(
  function ImageUpload({ recordId, recordType, onImagesChange }, ref) {
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const manager = useImageManager(recordId, recordType);

    const {
      images,
      uploadStage,
      isUploading,
      error,
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
      permanentDelete,
      clearError,
      cancelSession,
    } = manager;

    // Expose cancelSession to parent via ref
    useImperativeHandle(ref, () => ({ cancelSession }), [cancelSession]);

    // Notify parent whenever the image list changes
    const handleImagesChange = useCallback(
      (imgs: typeof images) => {
        onImagesChange?.(imgs.map((img) => img.secureUrl));
      },
      [onImagesChange]
    );

    useEffect(() => {
      handleImagesChange(images);
    }, [images, handleImagesChange]);

    // ─── Drag handlers ────────────────────────────────────────────────────────

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isUploading || isAtPerRecordLimit || isAtGlobalLimit || isOffline) return;
      setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (isUploading || isAtPerRecordLimit || isAtGlobalLimit || isOffline) return;
      const files = Array.from(e.dataTransfer.files);
      if (files[0]) handleFile(files[0]);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) handleFile(e.target.files[0]);
      e.target.value = "";
    };

    const handleFile = async (file: File) => {
      clearError();
      await upload(file);
    };

    const isDisabled = isUploading || isAtPerRecordLimit || isAtGlobalLimit || isOffline;
    const showUploadArea = !isAtPerRecordLimit && !isAtGlobalLimit;

    return (
      <div className="space-y-3">
        {/* ── Offline banner ── */}
        <AnimatePresence>
          {isOffline && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-start gap-2.5 px-3 py-2.5 bg-blue-500/10 border border-blue-500/30 rounded-lg"
            >
              <WifiOff size={14} className="flex-shrink-0 mt-0.5 text-blue-500" />
              <div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  You're offline — photo uploads are paused
                </p>
                <p className="text-xs text-muted mt-0.5">
                  Your other changes will save normally. Come back online to add photos.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Counters ── */}
        <ImageCounter
          perRecordCount={perRecordCount}
          perRecordLimit={perRecordLimit}
          globalCount={globalCount}
          globalLimit={globalLimit}
          plan={plan}
        />

        {/* ── Image gallery ── */}
        <ImageGallery
          images={images}
          onSoftDelete={(id) => softDelete(id)}
          onPermanentDelete={(id) => permanentDelete(id)}
          isUploading={isUploading}
        />

        {/* ── Error message ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-start gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-xs"
            >
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span className="flex-1">{error}</span>
              <button
                onClick={clearError}
                className="flex-shrink-0 hover:text-red-700 transition-colors"
                aria-label="Dismiss error"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Per-record limit reached ── */}
        {isAtPerRecordLimit && !isAtGlobalLimit && (
          <div className="px-3 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              Photo limit reached for this entry ({perRecordCount}/{perRecordLimit})
            </p>
            {plan === "free" && (
              <p className="text-xs text-muted mt-1 flex items-center gap-1">
                <Zap size={11} className="text-primary-500" />
                Upgrade to Pro to add up to 5 photos per entry
              </p>
            )}
          </div>
        )}

        {/* ── Global free limit reached ── */}
        {isAtGlobalLimit && (
          <div className="px-3 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              You've used all {globalLimit} free photo slots
            </p>
            <p className="text-xs text-muted mt-1 flex items-center gap-1">
              <Zap size={11} className="text-primary-500" />
              Upgrade to Pro for unlimited photos
            </p>
          </div>
        )}

        {/* ── Upload area ── */}
        {showUploadArea && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              relative border-2 border-dashed rounded-xl transition-colors
              ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
              ${
                dragActive
                  ? "border-primary-500 bg-primary-500/5"
                  : "border-default hover:border-primary-500 hover:bg-card/50"
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !isDisabled && fileInputRef.current?.click()}
            role="button"
            tabIndex={isDisabled ? -1 : 0}
            aria-label={isOffline ? "Photo upload unavailable offline" : "Upload photo"}
            aria-disabled={isDisabled}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !isDisabled) {
                fileInputRef.current?.click();
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              disabled={isDisabled}
              className="hidden"
              aria-hidden="true"
            />

            <div className="p-6 text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-card mb-3">
                {isOffline ? (
                  <WifiOff size={22} className="text-muted" />
                ) : isUploading ? (
                  <Loader size={22} className="text-primary-500 animate-spin" />
                ) : uploadStage === "done" ? (
                  <CheckCircle size={22} className="text-green-500" />
                ) : dragActive ? (
                  <Camera size={22} className="text-primary-500" />
                ) : (
                  <Upload size={22} className="text-muted" />
                )}
              </div>

              {/* Content */}
              {isOffline ? (
                <p className="text-sm text-muted">
                  Available when you're back online
                </p>
              ) : isUploading && uploadStage !== "idle" ? (
                <div className="space-y-1">
                  <p className="text-sm text-primary font-medium">
                    {STAGE_LABELS[uploadStage] ?? "Processing…"}
                  </p>
                  {/* Stage progress dots */}
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    {(["compressing", "uploading", "saving"] as const).map((stage) => (
                      <div
                        key={stage}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          uploadStage === stage
                            ? "w-6 bg-primary-500"
                            : uploadStage === "done" ||
                              (uploadStage === "saving" && stage !== "saving") ||
                              (uploadStage === "uploading" && stage === "compressing")
                            ? "w-3 bg-primary-500/60"
                            : "w-3 bg-default"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : uploadStage === "done" ? (
                <p className="text-sm text-green-500 font-medium">Photo saved!</p>
              ) : (
                <>
                  <p className="text-sm text-primary mb-1">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted">
                    PNG, JPG, WebP up to 50MB • Auto-compressed
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    );
  }
);

export default ImageUpload;
