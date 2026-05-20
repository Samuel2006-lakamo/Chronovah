// pages/Journal/JournalDetail.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Heart,
  Tag,
  Edit2,
  Trash2,
  Cloud,
  MapPin,
  Image as ImageIcon,
  Clock,
  Share2,
  Copy,
  BookOpen,
} from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../database/db";
import type { JournalEntry } from "../../type/JournalType";
import JournalEditor from "./JournalEditor";
import MarkdownContent from "../../components/MarkdownContent";
import ConfirmationModal from "../../components/ConfirmationModal";
import ImageLightbox from "../../components/ImageLightbox";
import { useToast } from "../../hooks/useToast";

const moods: Record<string, { emoji: string; color: string; bgColor: string }> =
  {
    Happy: { emoji: "😄", color: "text-green-500", bgColor: "bg-green-500/10" },
    Good: { emoji: "😊", color: "text-blue-500", bgColor: "bg-blue-500/10" },
    Neutral: {
      emoji: "😐",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    Sad: { emoji: "😞", color: "text-orange-500", bgColor: "bg-orange-500/10" },
    Terrible: { emoji: "😭", color: "text-red-500", bgColor: "bg-red-500/10" },
  };

export default function JournalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success } = useToast();
  const entryId = id;

  const [showEditor, setShowEditor] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const entry = useLiveQuery(() => (entryId ? db.journal.get(entryId) : undefined), [entryId]);

  const toggleFavorite = async () => {
    if (entry?.id) {
      await db.journal.update(entry.id, {
        isFavorite: !entry.isFavorite,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleDelete = async () => {
    if (!entry?.id) return;
    setIsDeleting(true);
    try {
      await db.journal.delete(entry.id);
      success("Journal entry deleted successfully");
      navigate("/journal");
    } catch (error) {
      console.error("Failed to delete journal entry:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSaveEntry = async (entryData: Partial<JournalEntry>) => {
    if (entry?.id) {
      await db.journal.update(entry.id, {
        ...entryData,
        updatedAt: new Date().toISOString(),
      });
    }
    setShowEditor(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!entry) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className=" text-center py-20">
          <BookOpen size={48} className="mx-auto text-muted mb-4" />
          <h2 className="text-xl font-semibold text-primary mb-2">
            Entry not found
          </h2>
          <button
            onClick={() => navigate("/journal")}
            className="text-primary-500 hover:text-primary-600"
          >
            Back to journal
          </button>
        </div>
      </div>
    );
  }

  const mood = moods[entry.mood] || moods.Neutral;

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className=" px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/journal")}
            className="p-2 hover:bg-card rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-muted" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-lg transition-colors ${
                entry.isFavorite
                  ? "text-red-500 bg-red-500/10"
                  : "text-muted hover:text-red-500"
              }`}
            >
              <Heart
                size={18}
                fill={entry.isFavorite ? "currentColor" : "none"}
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

        {/* Mood Banner */}
        <div
          className={`${mood.bgColor} rounded-xl p-6 mb-6 border border-default`}
        >
          <div className="flex items-center gap-4">
            <span className="text-6xl">{mood.emoji}</span>
            <div>
              <h1 className={`text-2xl font-bold ${mood.color} mb-1`}>
                Feeling {entry.mood}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(entry.createdAt)}
                </span>
                {entry.updatedAt !== entry.createdAt && (
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    Edited
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Journal Entry */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card border border-default rounded-xl p-6">
              <h2 className="text-lg font-semibold text-primary mb-4">Entry</h2>
              <MarkdownContent
                emptyFallback="*No entry text yet.*"
                className="text-primary leading-relaxed"
              >
                {entry.note}
              </MarkdownContent>
            </div>

            {/* Images */}
            {entry.images && entry.images.length > 0 && (
              <div className="bg-card border border-default rounded-xl p-6">
                <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                  <ImageIcon size={18} />
                  Photos ({entry.images.length})
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {entry.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setLightboxIndex(index)}
                      className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      aria-label={`View photo ${index + 1}`}
                    >
                      <img
                        src={img}
                        alt={`Journal photo ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-6">
            {/* Weather & Location */}
            {(entry.weather || entry.location) && (
              <div className="bg-card border border-default rounded-xl p-6">
                <h2 className="text-lg font-semibold text-primary mb-4">
                  Details
                </h2>
                <div className="space-y-3">
                  {entry.weather && (
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Cloud size={16} />
                      <span>{entry.weather}</span>
                    </div>
                  )}
                  {entry.location && (
                    <div className="flex items-center gap-2 text-sm text-muted">
                      <MapPin size={16} />
                      <span>{entry.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="bg-card border border-default rounded-xl p-6">
                <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                  <Tag size={16} />
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
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
        </div>
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditor && (
          <JournalEditor
            entry={entry}
            onSave={handleSaveEntry}
            onClose={() => setShowEditor(false)}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Journal Entry"
        message="Are you sure you want to delete this journal entry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={isDeleting}
      />

      {/* Image Lightbox */}
      <ImageLightbox
        images={entry.images ?? []}
        index={lightboxIndex}
        alt="Journal photo"
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
