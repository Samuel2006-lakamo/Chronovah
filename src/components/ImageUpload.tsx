// components/ImageUpload.tsx
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Camera, Maximize2, Loader, AlertCircle } from "lucide-react";
import { useImageUpload } from "../hooks/useImageUpload";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isUploading } = useImageUpload();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
    // Reset input so the same file can be re-selected after removal
    e.target.value = "";
  };

  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setUploadError(null);

    for (const file of imageFiles) {
      if (images.length >= maxImages) break;

      try {
        const cloudinaryUrl = await uploadImage(file);
        // Use functional update to avoid stale closure over `images`
        onImagesChange([...images, cloudinaryUrl]);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to upload image";
        setUploadError(msg);
        console.error("ImageUpload: failed to upload image", err);
      }
    }
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="space-y-3">
        {/* Upload error */}
        {uploadError && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-xs">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Image grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
            <AnimatePresence>
              {images.map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group aspect-square"
                >
                  <img
                    src={img}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-default cursor-pointer"
                    onClick={() => setPreviewImage(img)}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPreviewImage(img)}
                      className="p-1.5 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="Preview"
                    >
                      <Maximize2 size={14} className="text-gray-700" />
                    </button>
                    <button
                      onClick={() => removeImage(index)}
                      className="p-1.5 bg-white rounded-full hover:bg-red-100 transition-colors"
                      title="Remove"
                    >
                      <X size={14} className="text-red-500" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Upload area */}
        {images.length < maxImages && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              relative border-2 border-dashed rounded-xl p-6
              transition-colors
              ${isUploading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
              ${
                dragActive
                  ? "border-primary-500 bg-primary-500/5"
                  : "border-default hover:border-primary-500 hover:bg-card/50"
              }
            `}
            onDragEnter={!isUploading ? handleDrag : undefined}
            onDragLeave={!isUploading ? handleDrag : undefined}
            onDragOver={!isUploading ? handleDrag : undefined}
            onDrop={!isUploading ? handleDrop : undefined}
            onClick={!isUploading ? () => fileInputRef.current?.click() : undefined}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInput}
              disabled={isUploading}
              className="hidden"
            />

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-card mb-3">
                {isUploading ? (
                  <Loader size={24} className="text-primary-500 animate-spin" />
                ) : dragActive ? (
                  <Camera size={24} className="text-primary-500" />
                ) : (
                  <Upload size={24} className="text-muted" />
                )}
              </div>
              {isUploading ? (
                <p className="text-sm text-muted">Uploading image…</p>
              ) : (
                <>
                  <p className="text-sm text-primary mb-1">
                    <span className="font-semibold">Click to upload</span> or drag
                    and drop
                  </p>
                  <p className="text-xs text-muted">
                    PNG, JPG, GIF up to 10MB ({images.length}/{maxImages})
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Image preview modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh]"
            >
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
