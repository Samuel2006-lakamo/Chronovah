// pages/Places/PlaceCard.tsx
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Calendar,
  
  Edit2,
  Trash2,
  Image as ImageIcon,
  Globe,
  Phone,

  DollarSign,
  Heart,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import type { Place } from "../../type/PlaceType";
import { formatRelativeDateShort } from "../../utils/formatDate";

interface PlaceCardProps {
  place: Place;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
  onUpdate: (id: string, updates: Partial<Place>) => Promise<void>;
}

export default function PlaceCard({ place, onEdit, onDelete, onClick, onUpdate }: PlaceCardProps) {
  const [imgError, setImgError] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onUpdate(place.id!, {
      isFavorite: !place.isFavorite,
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not visited yet";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-card rounded-xl border border-default overflow-hidden hover:shadow-hard transition-all group"
    >
      {/* Image section */}
      <div className="relative h-48 bg-default">
        {place.images && place.images.length > 0 && !imgError ? (
          <img
            src={place.images[0]}
            alt={place.name}
            className="w-full h-full object-cover"
            onError={() => {
              setImgError(true);
              console.error(`Failed to load image for place: ${place.name}`, place.images[0]);
            }}
          />
        ) : place.images && place.images.length > 0 && imgError ? (
          <div className="image-error-state" style={{ borderRadius: 0 }}>
            <AlertCircle size={20} />
            <p>Image failed to load</p>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-500/10">
            <MapPin size={48} className="text-muted opacity-50" />
          </div>
        )}

        {/* Image count badge */}
        {place.images && place.images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <ImageIcon size={12} />
            <span>{place.images.length}</span>
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={toggleFavorite}
          className={`absolute top-3 left-3 p-2 rounded-full transition-all ${
            place.isFavorite
              ? "bg-red-500/20 text-red-500"
              : "bg-black/40 text-white opacity-0 group-hover:opacity-100"
          }`}
        >
          <Heart size={16} fill={place.isFavorite ? "currentColor" : "none"} />
        </button>

        {/* Type badge */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
          {place.type}
        </div>
      </div>

      {/* Content section */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-primary">{place.name}</h3>
          <p className="text-sm text-muted flex items-center gap-1">
            <MapPin size={12} />
            {place.country}
            {place.location ? `, ${place.location}` : ""}
          </p>
        </div>

        {/* Quick info chips */}
        <div className="flex flex-wrap gap-2">
          {place.visitedDate && (
            <span className="flex items-center gap-1 text-xs bg-default text-muted px-2 py-1 rounded-full">
              <Calendar size={10} />
              {formatDate(place.visitedDate)}
            </span>
          )}
          {place.rating && (
            <span className="flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full">
              <Star size={10} fill="currentColor" />
              {place.rating}/5
            </span>
          )}
          {place.cost && (
            <span className="flex items-center gap-1 text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
              <DollarSign size={10} />
              {place.cost} {place.currency || "USD"}
            </span>
          )}
        </div>

        {/* Notes preview */}
        {place.notes && (
          <p className="text-sm text-muted line-clamp-2">{place.notes}</p>
        )}

        {/* Tags */}
        {place.tags && place.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {place.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-default text-muted px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-default">
          <div className="flex items-center gap-2">
            {/* Added date */}
            {place.createdAt && (
              <span className="text-xs text-muted">
                {formatRelativeDateShort(place.createdAt)}
              </span>
            )}
            {place.website && (
              <a
                href={place.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-muted hover:text-primary-500 rounded-lg transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe size={16} />
              </a>
            )}
            {place.phone && (
              <a
                href={`tel:${place.phone}`}
                className="p-1.5 text-muted hover:text-primary-500 rounded-lg transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone size={16} />
              </a>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1.5 text-muted hover:text-primary-500 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 text-muted hover:text-red-500 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
