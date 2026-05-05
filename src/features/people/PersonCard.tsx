import { motion } from "framer-motion";
import {
  Heart,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Edit2,
  Trash2,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import type { Person } from "../../type/PeopleType";
import { formatRelativeDateShort } from "../../utils/formatDate";

interface PersonCardProps {
  person: Person;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
  onUpdate: (id: string, updates: Partial<Person>) => Promise<void>;
}

export default function PersonCard({
  person,
  onEdit,
  onDelete,
  onClick,
  onUpdate,
}: PersonCardProps) {
  const [imgError, setImgError] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onUpdate(person.id!, { isFavorite: !person.isFavorite });
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const hasSocialMedia =
    person.socialMedia && Object.values(person.socialMedia).some(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-card rounded-xl border border-default overflow-hidden hover:shadow-hard transition-all cursor-pointer group"
    >
      {/* Image / avatar area — same height as PlaceCard */}
      <div className="relative h-48 bg-primary-500/10">
        {(() => {
          // Prefer images[] array first, fall back to legacy image field
          const primaryImage = person.images?.[0] ?? person.image;
          console.log('Person image data:', person.image, person.images);
          if (primaryImage && !imgError) {
            return (
              <img
                src={primaryImage}
                alt={person.name}
                className="w-full h-full object-cover"
                onError={() => {
                  setImgError(true);
                  console.error(`Failed to load image for person: ${person.name}`, primaryImage);
                }}
              />
            );
          }
          if (primaryImage && imgError) {
            return (
              <div className="image-error-state">
                <AlertCircle size={18} />
                <p>Image failed to load</p>
              </div>
            );
          }
          return (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary-500 text-white flex items-center justify-center text-3xl font-bold">
                {getInitials(person.name)}
              </div>
            </div>
          );
        })()}

        {/* Favorite button — same position as PlaceCard */}
        <button
          onClick={toggleFavorite}
          className={`absolute top-3 left-3 p-2 rounded-full transition-all ${
            person.isFavorite
              ? "bg-red-500/20 text-accent-red"
              : "bg-black/40 text-white opacity-0 group-hover:opacity-100"
          }`}
          aria-label={person.isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={16} fill={person.isFavorite ? "currentColor" : "none"} />
        </button>

        {/* Relation badge — same position as PlaceCard type badge */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
          {person.relation}
        </div>
      </div>

      {/* Content — mirrors PlaceCard content section */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-base font-semibold text-primary leading-snug">
            {person.name}
          </h3>
          {person.nickname && (
            <p className="text-sm text-muted mt-0.5">"{person.nickname}"</p>
          )}
          {(person.company || person.jobTitle) && (
            <p className="text-xs text-muted mt-1 flex items-center gap-1">
              <Briefcase size={11} />
              {[person.jobTitle, person.company].filter(Boolean).join(" · ")}
            </p>
          )}
          {person.address && (
            <p className="text-xs text-muted mt-0.5 flex items-center gap-1">
              <MapPin size={11} />
              {person.address}
            </p>
          )}
        </div>

        {/* Contact chips — mirrors PlaceCard quick info chips */}
        <div className="flex flex-wrap gap-2">
          {person.email && (
            <span className="flex items-center gap-1 text-xs bg-default text-muted px-2 py-1 rounded-full">
              <Mail size={10} />
              Email
            </span>
          )}
          {person.phone && (
            <span className="flex items-center gap-1 text-xs bg-default text-muted px-2 py-1 rounded-full">
              <Phone size={10} />
              Phone
            </span>
          )}
          {person.birthday && (
            <span className="flex items-center gap-1 text-xs bg-default text-muted px-2 py-1 rounded-full">
              <Calendar size={10} />
              {new Date(person.birthday).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
        </div>

        {/* Description */}
        {person.description && (
          <p className="text-sm text-muted line-clamp-2">{person.description}</p>
        )}

        {/* Tags */}
        {person.tags && person.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {person.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-default text-muted px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons — mirrors PlaceCard footer */}
        <div className="flex items-center justify-between pt-2 border-t border-default">
          <div className="flex items-center gap-2">
            {/* Added date */}
            {person.createdAt && (
              <span className="text-xs text-muted">
                {formatRelativeDateShort(person.createdAt)}
              </span>
            )}
            {hasSocialMedia && (
              <>
                {person.socialMedia?.twitter && (
                  <Twitter size={15} className="text-muted hover:text-primary-500 transition-colors" />
                )}
                {person.socialMedia?.instagram && (
                  <Instagram size={15} className="text-muted hover:text-primary-500 transition-colors" />
                )}
                {person.socialMedia?.linkedin && (
                  <Linkedin size={15} className="text-muted hover:text-primary-500 transition-colors" />
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-1.5 text-muted hover:text-primary-500 rounded-lg transition-colors"
              aria-label="Edit"
            >
              <Edit2 size={15} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-1.5 text-muted hover:text-accent-red rounded-lg transition-colors"
              aria-label="Delete"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
