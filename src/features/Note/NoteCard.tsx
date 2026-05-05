// components/NoteCard.tsx
import { motion } from "framer-motion";
import {
  Star,
  Pin,
  Clock,
  Image,
  Link as LinkIcon,
  BookOpen,
} from "lucide-react";

import type { Note } from "../../type/NoteType";
import { stripMarkdownForPreview } from "../../utils/textPreview";
import { formatRelativeDate } from "../../utils/formatDate";

interface NoteCardProps {
  note: Note;
  viewMode: "grid" | "list";
  onClick: () => void;
  onUpdate: (id: string, updates: Partial<Note>) => Promise<void>;
}

export default function NoteCard({ note, viewMode, onClick, onUpdate }: NoteCardProps) {
  const togglePinned = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onUpdate(note.id!, { isPinned: !note.isPinned });
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onUpdate(note.id!, { isFavorite: !note.isFavorite });
  };

  const preview = stripMarkdownForPreview(note.content, 120);
  const hasAttachments = note.attachments && note.attachments.length > 0;
  const readTime =
    note.readTime || Math.max(1, Math.ceil((note.wordCount || 0) / 200));

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        whileHover={{ scale: 1.01, x: 4 }}
        onClick={onClick}
        className={`relative flex items-center gap-4 p-4 bg-card rounded-xl border border-default hover:shadow-medium transition-all cursor-pointer group ${
          note.isPinned ? "border-primary-500/30 bg-primary-500/5" : ""
        }`}
      >
        {/* Color accent - using dynamic color with style attribute instead of className */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full"
          style={{
            backgroundColor: note.color
              ? `var(--color-${note.color}-500)`
              : "var(--color-primary-500)",
          }}
        />

        {/* Pinned indicator */}
        {note.isPinned && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
            <Pin size={12} className="text-white rotate-45" />
          </div>
        )}

        <div className="flex-1 min-w-0 pl-3">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-primary truncate">
              {note.title || "Untitled"}
            </h3>
            {hasAttachments && (
              <div className="flex items-center gap-1">
                {note.attachments?.some((a) => a.type === "image") && (
                  <Image size={12} className="text-muted" />
                )}
                {note.attachments?.some((a) => a.type === "link") && (
                  <LinkIcon size={12} className="text-muted" />
                )}
              </div>
            )}
          </div>

          <p className="text-sm text-muted line-clamp-2 mb-2">
            {preview || "No content..."}
          </p>

          <div className="flex items-center gap-3 text-xs text-muted">
            <div className="flex items-center gap-1">
              <Clock size={10} />
              <span>{formatRelativeDate(note.updatedAt)}</span>
            </div>

            <div className="flex items-center gap-1">
              <BookOpen size={10} />
              <span>{readTime} min read</span>
            </div>

            {note.wordCount && <span>{note.wordCount} words</span>}
          </div>

          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {note.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-default text-muted rounded-full text-[10px]"
                >
                  #{tag}
                </span>
              ))}
              {note.tags.length > 3 && (
                <span className="text-[10px] text-muted">
                  +{note.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={togglePinned}
            className={`p-1.5 rounded-lg transition-colors ${
              note.isPinned
                ? "text-primary-500"
                : "text-muted opacity-0 group-hover:opacity-100"
            }`}
          >
            <Pin size={16} className={note.isPinned ? "rotate-45" : ""} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleFavorite}
            className={`p-1.5 rounded-lg transition-colors ${
              note.isFavorite
                ? "text-accent-yellow"
                : "text-muted opacity-0 group-hover:opacity-100"
            }`}
          >
            <Star size={16} fill={note.isFavorite ? "currentColor" : "none"} />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`relative bg-card rounded-xl border border-default p-5 hover:shadow-hard transition-all cursor-pointer group ${
        note.isPinned ? "border-primary-500/30 bg-primary-500/5" : ""
      }`}
    >
      {/* Pinned badge */}
      {note.isPinned && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
          <Pin size={14} className="text-white rotate-45" />
        </div>
      )}

      {/* Color dot - using style instead of className for dynamic colors */}
      <div
        className="absolute top-5 left-5 w-2 h-2 rounded-full"
        style={{
          backgroundColor: note.color
            ? `var(--color-${note.color}-500)`
            : "var(--color-primary-500)",
        }}
      />

      <div className="flex items-start justify-between mb-3 pl-4">
        <h3 className="font-semibold text-primary line-clamp-1 flex-1">
          {note.title || "Untitled"}
        </h3>

        <div className="flex items-center gap-1 ml-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={togglePinned}
            className={`p-1.5 rounded-lg transition-colors ${
              note.isPinned
                ? "text-primary-500"
                : "text-muted opacity-0 group-hover:opacity-100"
            }`}
          >
            <Pin size={14} className={note.isPinned ? "rotate-45" : ""} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleFavorite}
            className={`p-1.5 rounded-lg transition-colors ${
              note.isFavorite
                ? "text-accent-yellow"
                : "text-muted opacity-0 group-hover:opacity-100"
            }`}
          >
            <Star size={14} fill={note.isFavorite ? "currentColor" : "none"} />
          </motion.button>
        </div>
      </div>

      <p className="text-sm text-muted mb-4 line-clamp-4">
        {preview || (
          <span className="italic opacity-50">No content...</span>
        )}
      </p>

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-muted mt-auto">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Clock size={10} />
            <span>{formatRelativeDate(note.updatedAt)}</span>
          </div>

          {note.wordCount && (
            <>
              <span>•</span>
              <span>{note.wordCount} words</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <BookOpen size={10} />
          <span>{readTime}m</span>
        </div>
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-default">
          {note.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-default text-muted rounded-full text-[10px]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
