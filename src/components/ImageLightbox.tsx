/**
 * ImageLightbox.tsx
 *
 * Shared full-screen image lightbox used by PlaceDetail, JournalDetail,
 * and PersonDetail. Accepts a plain string[] of image URLs.
 *
 * Features:
 *  - Prev / next navigation (keyboard ← → and on-screen buttons)
 *  - Escape to close
 *  - Click backdrop to close
 *  - Dot indicators
 *  - Counter label (1 / N)
 *  - Focus trap on open
 */

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageLightboxProps {
  images: string[];
  /** Currently visible index, or null when closed */
  index: number | null;
  alt?: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ImageLightbox({
  images,
  index,
  alt = "Image",
  onClose,
  onNavigate,
}: ImageLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const savedFocusRef = useRef<HTMLElement | null>(null);

  const total = images.length;
  // Treat as open only when index is a valid integer within the array bounds
  const isValidIndex = index !== null && Number.isInteger(index) && total > 0 && index >= 0 && index < total;
  const isOpen = isValidIndex;

  const prev = useCallback(() => {
    if (!isValidIndex || index === null) return;
    onNavigate((index - 1 + total) % total);
  }, [isValidIndex, index, total, onNavigate]);

  const next = useCallback(() => {
    if (!isValidIndex || index === null) return;
    onNavigate((index + 1) % total);
  }, [isValidIndex, index, total, onNavigate]);

  // Keyboard navigation + focus management
  useEffect(() => {
    if (!isOpen) return;

    savedFocusRef.current = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      savedFocusRef.current?.focus();
    };
  }, [isOpen, onClose, prev, next]);

  return (
    <AnimatePresence>
      {isOpen && isValidIndex && index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          {/* Close */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center z-10"
            aria-label="Close image viewer"
          >
            <X size={22} />
          </button>

          {/* Prev */}
          {total > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Next */}
          {total > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center z-10"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Image */}
          <motion.img
            key={index}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            src={images[index]}
            alt={`${alt} ${index + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg select-none"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />

          {/* Counter */}
          {total > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
              {/* Dots */}
              <div className="flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); onNavigate(i); }}
                    aria-label={`Go to image ${i + 1}`}
                    className={`rounded-full transition-all ${
                      i === index
                        ? "w-6 h-2 bg-white"
                        : "w-2 h-2 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
              {/* Label */}
              <span className="text-white/60 text-xs tabular-nums">
                {index + 1} / {total}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
