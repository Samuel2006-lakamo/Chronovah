// pages/Places/PlaceDetail.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Globe,
  Phone,
  Clock,
  DollarSign,
  Calendar,
  Star,
  Heart,
  Edit2,
  Trash2,
  Share2,
  Copy,
  ExternalLink,
 
  ChevronLeft,
  ChevronRight,
  X,
  Tag,
  Navigation,
  AlertCircle,
} from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../database/db";
import PlaceEditor from "./PlaceEditor";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useToast } from "../../hooks/useToast";
import type { Place } from "../../type/PlaceType";

// Small helper so each gallery thumbnail has its own error state
function GalleryImage({ src, alt, className, onClick }: { src: string; alt: string; className?: string; onClick?: () => void }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className={`image-error-state ${className ?? ""}`} onClick={onClick}>
        <AlertCircle size={14} />
        <p>Failed</p>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
      onError={() => {
        setErr(true);
        console.error(`Failed to load gallery image`, src);
      }}
    />
  );
}

export default function PlaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success } = useToast();
  const placeId = id;

  const [showEditor, setShowEditor] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);

  const place = useLiveQuery(() => {
    if (!placeId) return undefined;
    return db.places.where("id").equals(placeId).first();
  }, [placeId]);

  const toggleFavorite = async () => {
    if (place?.id) {
      await db.places.update(place.id, {
        isFavorite: !place.isFavorite,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleDelete = async () => {
    if (!place?.id) return;
    setIsDeleting(true);
    try {
      await db.places.delete(place.id);
      success("Place deleted successfully");
      navigate("/places");
    } catch (error) {
      console.error("Failed to delete place:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSavePlace = async (placeData: Partial<Place>) => {
    if (place?.id) {
      await db.places.update(place.id, {
        ...placeData,
        updatedAt: new Date().toISOString(),
      });
    }
    setShowEditor(false);
  };

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return "Not set";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

  if (!place) {
    return (
      <div className="min-h-screen  pt-20 px-4">
        <div className=" text-center py-20">
          <MapPin size={48} className="mx-auto text-muted mb-4" />
          <h2 className="text-xl font-semibold text-primary mb-2">
            Place not found
          </h2>
          <button
            onClick={() => navigate("/places")}
            className="text-primary-500 hover:text-primary-600"
          >
            Back to places
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  pt-20 pb-24">
      {/* Hero Section with Image Gallery */}
      <div className="relative h-[50vh] md:h-[60vh] bg-primary-900">
        {place.images && place.images.length > 0 && !heroImgError ? (
          <>
            <img
              src={place.images[selectedImageIndex ?? 0]}
              alt={place.name}
              className="w-full h-full object-cover"
              onError={() => {
                setHeroImgError(true);
                console.error(`Failed to load image for place: ${place.name}`, place.images[selectedImageIndex ?? 0]);
              }}
            />
            {/* Image Gallery Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Image Navigation */}
            {place.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === null
                        ? 1
                        : (prev - 1 + place.images.length) %
                          place.images.length,
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === null ? 1 : (prev + 1) % place.images.length,
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Image Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {place.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        (selectedImageIndex ?? 0) === index
                          ? "w-6 bg-white"
                          : "bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : place.images && place.images.length > 0 && heroImgError ? (
          <div className="image-error-state" style={{ borderRadius: 0 }}>
            <AlertCircle size={32} />
            <p>Image failed to load</p>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin size={64} className="text-white/30" />
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate("/places")}
          className="absolute top-4 left-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full transition-colors ${
              place.isFavorite
                ? "bg-red-500 text-white"
                : "bg-black/50 hover:bg-black/70 text-white"
            }`}
          >
            <Heart
              size={20}
              fill={place.isFavorite ? "currentColor" : "none"}
            />
          </button>
          <button
            onClick={() => setShowEditor(true)}
            className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <Edit2 size={20} />
          </button>
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <Share2 size={20} />
          </button>
        </div>

        {/* Share Menu */}
        <AnimatePresence>
          {showShareMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-16 right-4 bg-card border border-default rounded-xl shadow-hard overflow-hidden z-50"
            >
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShowShareMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-default transition-colors"
              >
                <Copy size={14} />
                <span>Copy link</span>
              </button>
              <button
                onClick={() => {
                  window.open(
                    `https://maps.google.com/?q=${place.name},${place.country}`,
                    "_blank",
                  );
                  setShowShareMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-default transition-colors"
              >
                <Navigation size={14} />
                <span>Open in Maps</span>
              </button>
              <div className="border-t border-default my-1" />
              <button
                onClick={() => {
                  setShowDeleteConfirm(true);
                  setShowShareMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Place Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
            {place.name}
          </h1>
          <p className="text-lg md:text-xl text-white/80 flex items-center gap-2">
            <MapPin size={20} />
            {place.country}
            {place.location ? `, ${place.location}` : ""}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {place.type && (
            <div className="bg-card border border-default rounded-xl p-4 text-center">
              <Tag size={20} className="mx-auto text-primary-500 mb-2" />
              <p className="text-xs text-muted">Type</p>
              <p className="text-sm font-semibold text-primary">{place.type}</p>
            </div>
          )}
          {place.visitedDate && (
            <div className="bg-card border border-default rounded-xl p-4 text-center">
              <Calendar size={20} className="mx-auto text-primary-500 mb-2" />
              <p className="text-xs text-muted">Visited</p>
              <p className="text-sm font-semibold text-primary">
                {new Date(place.visitedDate).toLocaleDateString()}
              </p>
            </div>
          )}
          {place.rating && (
            <div className="bg-card border border-default rounded-xl p-4 text-center">
              <Star
                size={20}
                className="mx-auto text-yellow-500 mb-2"
                fill="currentColor"
              />
              <p className="text-xs text-muted">Rating</p>
              <p className="text-sm font-semibold text-primary">
                {place.rating}/5
              </p>
            </div>
          )}
          {place.cost && (
            <div className="bg-card border border-default rounded-xl p-4 text-center">
              <DollarSign size={20} className="mx-auto text-green-500 mb-2" />
              <p className="text-xs text-muted">Cost</p>
              <p className="text-sm font-semibold text-primary">
                {place.cost} {place.currency}
              </p>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Notes/Description */}
            {place.notes && (
              <div className="bg-card border border-default rounded-xl p-6">
                <h2 className="text-lg font-semibold text-primary mb-4">
                  About this place
                </h2>
                <p className="text-muted leading-relaxed whitespace-pre-wrap">
                  {place.notes}
                </p>
              </div>
            )}

            {/* Additional Images */}
            {place.images && place.images.length > 1 && (
              <div className="bg-card border border-default rounded-xl p-6">
                <h2 className="text-lg font-semibold text-primary mb-4">
                  Gallery
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {place.images.slice(1).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index + 1)}
                      className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                    >
                      <GalleryImage
                        src={img}
                        alt={`${place.name} ${index + 2}`}
                        className="w-full h-full object-cover"
                        onClick={() => setSelectedImageIndex(index + 1)}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {place.tags && place.tags.length > 0 && (
              <div className="bg-card border border-default rounded-xl p-6">
                <h2 className="text-lg font-semibold text-primary mb-4">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {place.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-default text-muted rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact & Location */}
          <div className="space-y-6">
            {/* Contact Info */}
            {(place.website || place.phone || place.openingHours) && (
              <div className="bg-card border border-default rounded-xl p-6">
                <h2 className="text-lg font-semibold text-primary mb-4">
                  Contact & Hours
                </h2>
                <div className="space-y-3">
                  {place.website && (
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary-500 hover:text-primary-600"
                    >
                      <Globe size={16} />
                      <span className="flex-1 truncate">
                        {place.website.replace(/^https?:\/\//, "")}
                      </span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {place.phone && (
                    <a
                      href={`tel:${place.phone}`}
                      className="flex items-center gap-2 text-sm text-primary-500 hover:text-primary-600"
                    >
                      <Phone size={16} />
                      <span>{place.phone}</span>
                    </a>
                  )}
                  {place.openingHours && (
                    <div className="flex items-start gap-2 text-sm text-muted">
                      <Clock size={16} className="flex-shrink-0 mt-0.5" />
                      <span>{place.openingHours}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location Map Placeholder */}
            <div className="bg-card border border-default rounded-xl p-6">
              <h2 className="text-lg font-semibold text-primary mb-4">
                Location
              </h2>
              <div className="aspect-video bg-default rounded-lg flex items-center justify-center">
                <p className="text-sm text-muted text-center">
                  <MapPin size={24} className="mx-auto mb-2 opacity-50" />
                  {place.location || place.country}
                </p>
              </div>
              <button
                onClick={() =>
                  window.open(
                    `https://maps.google.com/?q=${place.name},${place.country}`,
                    "_blank",
                  )
                }
                className="w-full mt-3 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Navigation size={16} />
                Open in Google Maps
              </button>
            </div>

            {/* Added Date */}
            <div className="text-xs text-muted text-center">
              Added on {new Date(place.createdAt).toLocaleDateString()}
              {place.updatedAt !== place.createdAt &&
                ` • Updated ${new Date(place.updatedAt).toLocaleDateString()}`}
            </div>
          </div>
        </div>
      </div>

      {/* Image Fullscreen Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && place.images && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setSelectedImageIndex(null)}
          >
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X size={24} />
            </button>

            {place.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(
                      (prev) =>
                        (prev! - 1 + place.images.length) % place.images.length,
                    );
                  }}
                  className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(
                      (prev) => (prev! + 1) % place.images.length,
                    );
                  }}
                  className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <img
              src={place.images[selectedImageIndex]}
              alt={`${place.name} ${selectedImageIndex + 1}`}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {selectedImageIndex + 1} / {place.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditor && (
          <PlaceEditor
            place={place}
            onSave={handleSavePlace}
            onClose={() => setShowEditor(false)}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Place"
        message={`Are you sure you want to delete "${place?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={isDeleting}
      />
    </div>
  );
}
