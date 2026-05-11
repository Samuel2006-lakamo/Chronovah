/**
 * ImageGallery.tsx
 *
 * Displays uploaded images in a grid with preview, soft-delete,
 * and permanent-delete actions.
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Trash2, AlertTriangle } from "lucide-react";
import type { ImageRecord } from "../type/ImageType";

interface ImageGalleryProps {
  images: ImageRecord[];
  onSoftDelete: (imageId: string) => void;
  onPermanentDelete: (imageId: string) => void;
  isUploading?: boolean;
}

export default function ImageGallery({
  images,
  onSoftDelete,
  onPermanentDelete,
  isUploading = false,
}: ImageGalleryProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const savedFocusRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Keyboard + focus management for preview modal
  useEffect(() => {
    if (previewImage) {
      // Save current focus
      savedFocusRef.current = document.activeElement as HTMLElement;
      // Focus close button
      closeButtonRef.current?.focus();
      // Add keydown listener
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setPreviewImage(null);
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        // Restore focus
        savedFocusRef.current?.focus();
      };
    }
  }, [previewImage]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
        <AnimatePresence>
          {images.map((img) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.18 }}
              className="relative group aspect-square"
            >
              <img
                src={img.secureUrl}
                alt="Uploaded image"
                className="w-full h-full object-cover rounded-lg border border-default cursor-pointer"
                onClick={() => setPreviewImage(img.secureUrl)}
                loading="lazy"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1.5">
                {/* Preview */}
                <button
                  onClick={() => setPreviewImage(img.secureUrl)}
                  className="p-1.5 bg-white rounded-full hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  title="Preview image"
                  aria-label="Preview image"
                  disabled={isUploading}
                >
                  <Maximize2 size={13} className="text-gray-700" />
                </button>

                {/* Soft delete (trash) */}
                <button
                  onClick={() => onSoftDelete(img.id)}
                  className="p-1.5 bg-white rounded-full hover:bg-red-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  title="Move to trash"
                  aria-label="Move image to trash"
                  disabled={isUploading}
                >
                  <Trash2 size={13} className="text-red-500" />
                </button>

                {/* Permanent delete */}
                <button
                  onClick={() => setConfirmDeleteId(img.id)}
                  className="p-1.5 bg-white rounded-full hover:bg-yellow-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  title="Permanently delete"
                  aria-label="Permanently delete image"
                  disabled={isUploading}
                >
                  <AlertTriangle size={13} className="text-yellow-600" />
                </button>
              </div>

              {/* Permanent delete confirmation */}
              {confirmDeleteId === img.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/80 rounded-lg flex flex-col items-center justify-center gap-2 p-2"
                >
                  <AlertTriangle size={16} className="text-yellow-400" />
                  <p className="text-white text-xs text-center leading-tight">
                    Permanently delete?
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        onPermanentDelete(img.id);
                        setConfirmDeleteId(null);
                      }}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2 py-1 bg-white/20 text-white text-xs rounded hover:bg-white/30 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Full-screen preview modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewImage}
                alt="Full size preview"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
              <button
                ref={closeButtonRef}
                onClick={() => setPreviewImage(null)}
                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close preview"
                tabIndex={0}
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
