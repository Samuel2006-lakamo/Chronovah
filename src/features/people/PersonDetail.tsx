import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Globe,
  Twitter,
  Instagram,
  Linkedin,
  Share2,
  User,
  Cake,
  Building2,
  FileText,
  Image as ImageIcon,
  Tag,
  AlertCircle,
} from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../database/db";
import type { Person } from "../../type/PeopleType";
import PersonEditor from "./PersonEditor";
import ConfirmationModal from "../../components/ConfirmationModal";
import ImageLightbox from "../../components/ImageLightbox";
import { useToast } from "../../hooks/useToast";

// Small helper so each gallery thumbnail has its own error state
function GalleryImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className={`image-error-state ${className ?? ""}`}>
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
      onError={() => {
        setErr(true);
        console.error(`Failed to load gallery image`, src);
      }}
    />
  );
}


export default function PersonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success } = useToast();
  const personId = id;

  const [showEditor, setShowEditor] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [avatarImgError, setAvatarImgError] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const person = useLiveQuery(() => (personId ? db.people.get(personId) : undefined), [personId]);

  const toggleFavorite = async () => {
    if (person?.id) {
      await db.people.update(person.id, {
        isFavorite: !person.isFavorite,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleDelete = async () => {
    if (!person?.id) return;
    setIsDeleting(true);
    try {
      await db.people.delete(person.id);
      success("Person deleted successfully");
      navigate("/people");
    } catch (error) {
      console.error("Failed to delete person:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSavePerson = async (personData: Partial<Person>) => {
    if (person?.id) {
      await db.people.update(person.id, {
        ...personData,
        updatedAt: new Date().toISOString(),
      });
    }
    setShowEditor(false);
  };

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return "Not set";
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (!person) {
    return (
      <div className="min-h-screen  pt-16 px-3">
        <div className=" text-center py-12">
          <User size={48} className="mx-auto text-muted mb-4" />
          <h2 className="text-lg font-semibold text-primary mb-2">
            Person not found
          </h2>
          <button
            onClick={() => navigate("/people")}
            className="text-primary-500 hover:text-primary-600 text-sm"
          >
            Back to people
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-20">
      {/* Header */}
      <div className="sticky top-16 backdrop-blur-md border-b border-default z-30">
        <div className="max-w-4xl mx-auto px-3 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/people")}
              className="p-2 hover:bg-default rounded-lg transition-colors"
            >
              <ArrowLeft size={18} className="text-muted" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  person.isFavorite
                    ? "text-red-500 bg-red-500/10"
                    : "text-muted hover:text-red-500"
                }`}
              >
                <Heart
                  size={18}
                  fill={person.isFavorite ? "currentColor" : "none"}
                />
              </button>
              <button
                onClick={() => setShowEditor(true)}
                className="p-2 text-muted hover:text-primary-500 rounded-lg transition-colors"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 text-muted hover:text-primary-500 rounded-lg transition-colors relative"
              >
                <Share2 size={18} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-muted hover:text-red-500 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto px-3 py-6">
        <div className="flex flex-col items-center mb-6">
          {/* Avatar/Image */}
          <div className="relative mb-4">
            {(() => {
              // Prefer images[] array first, fall back to legacy image field
              const primaryImage = person.images?.[0] ?? person.image;
              if (primaryImage && !avatarImgError) {
                return (
                  <button
                    onClick={() => setLightboxIndex(0)}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-full"
                    aria-label="View profile photo"
                  >
                    <img
                      src={primaryImage}
                      alt={person.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-card shadow-lg hover:opacity-90 transition-opacity cursor-pointer"
                      onError={() => setAvatarImgError(true)}
                    />
                  </button>
                );
              }
              if (primaryImage && avatarImgError) {
                return (
                  <div
                    className="w-24 h-24 rounded-full border-4 border-card shadow-lg image-error-state"
                    style={{ borderRadius: '9999px' }}
                  >
                    <AlertCircle size={20} />
                    <p>Failed</p>
                  </div>
                );
              }
              return (
                <div className="w-24 h-24 rounded-full bg-primary-500 text-white flex items-center justify-center text-3xl font-bold border-4 border-card shadow-lg">
                  {getInitials(person.name)}
                </div>
              );
            })()}
          </div>

          <h1 className="text-2xl font-bold text-primary text-center">
            {person.name}
          </h1>
          {person.nickname && (
            <p className="text-sm text-muted mt-1">"{person.nickname}"</p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full text-xs font-medium">
              {person.relation}
            </span>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {person.email && (
            <div className="bg-card border border-default rounded-lg p-3 text-center">
              <Mail size={16} className="mx-auto text-primary-500 mb-1" />
              <p className="text-xs text-muted">Email</p>
            </div>
          )}
          {person.phone && (
            <div className="bg-card border border-default rounded-lg p-3 text-center">
              <Phone size={16} className="mx-auto text-primary-500 mb-1" />
              <p className="text-xs text-muted">Phone</p>
            </div>
          )}
          {person.birthday && (
            <div className="bg-card border border-default rounded-lg p-3 text-center">
              <Cake size={16} className="mx-auto text-primary-500 mb-1" />
              <p className="text-xs text-muted">Birthday</p>
            </div>
          )}
          {person.company && (
            <div className="bg-card border border-default rounded-lg p-3 text-center">
              <Building2 size={16} className="mx-auto text-primary-500 mb-1" />
              <p className="text-xs text-muted">Work</p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          {/* Description */}
          {person.description && (
            <div className="bg-card border border-default rounded-lg p-4">
              <h2 className="text-sm font-semibold text-primary mb-2">About</h2>
              <p className="text-sm text-muted">{person.description}</p>
            </div>
          )}

          {/* Contact Details */}
          {(person.email ||
            person.phone ||
            person.address ||
            person.website) && (
            <div className="bg-card border border-default rounded-lg p-4">
              <h2 className="text-sm font-semibold text-primary mb-3">
                Contact
              </h2>
              <div className="space-y-2">
                {person.email && (
                  <a
                    href={`mailto:${person.email}`}
                    className="flex items-center gap-2 text-sm text-muted hover:text-primary-500"
                  >
                    <Mail size={14} />
                    <span>{person.email}</span>
                  </a>
                )}
                {person.phone && (
                  <a
                    href={`tel:${person.phone}`}
                    className="flex items-center gap-2 text-sm text-muted hover:text-primary-500"
                  >
                    <Phone size={14} />
                    <span>{person.phone}</span>
                  </a>
                )}
                {person.address && (
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <MapPin size={14} />
                    <span>{person.address}</span>
                  </div>
                )}
                {person.website && (
                  <a
                    href={person.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted hover:text-primary-500"
                  >
                    <Globe size={14} />
                    <span>{person.website.replace(/^https?:\/\//, "")}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Work Details */}
          {(person.company || person.jobTitle) && (
            <div className="bg-card border border-default rounded-lg p-4">
              <h2 className="text-sm font-semibold text-primary mb-3">Work</h2>
              <div className="space-y-2">
                {person.company && (
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Briefcase size={14} />
                    <span>{person.company}</span>
                  </div>
                )}
                {person.jobTitle && (
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <User size={14} />
                    <span>{person.jobTitle}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Social Media */}
          {person.socialMedia &&
            Object.values(person.socialMedia).some(Boolean) && (
              <div className="bg-card border border-default rounded-lg p-4">
                <h2 className="text-sm font-semibold text-primary mb-3">
                  Social
                </h2>
                <div className="space-y-2">
                  {person.socialMedia.twitter && (
                    <a
                      href={`https://twitter.com/${person.socialMedia.twitter.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted hover:text-primary-500"
                    >
                      <Twitter size={14} />
                      <span>{person.socialMedia.twitter}</span>
                    </a>
                  )}
                  {person.socialMedia.instagram && (
                    <a
                      href={`https://instagram.com/${person.socialMedia.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted hover:text-primary-500"
                    >
                      <Instagram size={14} />
                      <span>{person.socialMedia.instagram}</span>
                    </a>
                  )}
                  {person.socialMedia.linkedin && (
                    <a
                      href={
                        person.socialMedia.linkedin.startsWith("http")
                          ? person.socialMedia.linkedin
                          : `https://linkedin.com/in/${person.socialMedia.linkedin}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted hover:text-primary-500"
                    >
                      <Linkedin size={14} />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            )}

          {/* Tags */}
          {person.tags && person.tags.length > 0 && (
            <div className="bg-card border border-default rounded-lg p-4">
              <h2 className="text-sm font-semibold text-primary mb-3 flex items-center gap-1">
                <Tag size={14} />
                Tags
              </h2>
              <div className="flex flex-wrap gap-1">
                {person.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-default text-muted rounded-lg text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {person.notes && (
            <div className="bg-card border border-default rounded-lg p-4">
              <h2 className="text-sm font-semibold text-primary mb-3 flex items-center gap-1">
                <FileText size={14} />
                Notes
              </h2>
              <p className="text-sm text-muted whitespace-pre-wrap">
                {person.notes}
              </p>
            </div>
          )}

          {/* Additional Images */}
          {person.images && person.images.length > 1 && (
            <div className="bg-card border border-default rounded-lg p-4">
              <h2 className="text-sm font-semibold text-primary mb-3 flex items-center gap-1">
                <ImageIcon size={14} />
                Photos
              </h2>
              <div className="grid grid-cols-4 gap-2">
                {person.images.slice(1).map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setLightboxIndex(index + 1)}
                    className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    aria-label={`View photo ${index + 2}`}
                  >
                    <GalleryImage
                      src={img}
                      alt={`${person.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="text-xs text-muted text-center pt-4">
            Added on {new Date(person.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditor && (
          <PersonEditor
            person={person}
            onSave={handleSavePerson}
            onClose={() => setShowEditor(false)}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Person"
        message={`Are you sure you want to delete "${person?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={isDeleting}
      />

      {/* Image Lightbox */}
      <ImageLightbox
        images={person.images ?? []}
        index={lightboxIndex}
        alt={person.name}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
