// pages/NoteDetail.tsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Trash2,
  Star,
  Pin,
  Clock,
  Image,
  Link2,
  MoreVertical,
  Edit2,
  Copy,
  Share2,
  Download,
  FileText,
  Check,
  X,
  Palette,
  Paperclip,
  Hash,
} from "lucide-react";
import type { Note, NoteColor } from "../../type/NoteType";
import MarkdownContent from "../../components/MarkdownContent";
import AdvancedMarkdownEditor from "../../components/AdvancedMarkdownEditor";
import Spinner from "../../ui/Spinner";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useToast } from "../../hooks/useToast";
import { useNotes } from "../../hooks/useNotes";

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success } = useToast();
  const { getNote, updateNote, deleteNote } = useNotes();

  const [note, setNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<Note>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [tagInput, setTagInput] = useState("");

  const titleRef = useRef<HTMLInputElement>(null);

  // Load note once on mount (or when id changes).
  // We intentionally exclude `getNote` from deps — it changes reference on
  // every render because it lives inside a hook that calls useAuth(), and
  // including it would re-run this effect after every Dexie write, resetting
  // the draft while the user is typing.
  useEffect(() => {
    const loadNote = async () => {
      if (!id) return;
      try {
        const fetched = await getNote(id);
        if (fetched) {
          setNote(fetched);
          setDraft(fetched);
        } else {
          setNote(null);
        }
      } catch (err) {
        console.error("Failed to load note:", err);
      }
    };
    loadNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // ← only re-run when the note id changes, not on every getNote re-creation

  // Auto-save while editing
  useEffect(() => {
    if (!isEditing || !note?.id) return;
    const timer = setTimeout(async () => {
      if (JSON.stringify(draft) !== JSON.stringify(note)) {
        setIsSaving(true);
        try {
          await updateNote(note.id, {
            ...draft,
            wordCount: draft.content?.split(/\s+/).filter(Boolean).length || 0,
            readTime: Math.max(1, Math.ceil((draft.content?.split(/\s+/).filter(Boolean).length || 0) / 200)),
          });
          setLastSaved(new Date());
        } catch (err) {
          console.error("Auto-save failed:", err);
        } finally {
          setIsSaving(false);
        }
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [draft, note, isEditing, updateNote]);

  const handleContentChange = (field: keyof Note, value: string | string[] | NoteColor | undefined) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!note?.id) return;
    setIsSaving(true);
    try {
      await updateNote(note.id, {
        ...draft,
        wordCount: draft.content?.split(/\s+/).filter(Boolean).length || 0,
        readTime: Math.max(1, Math.ceil((draft.content?.split(/\s+/).filter(Boolean).length || 0) / 200)),
      });
      setLastSaved(new Date());
      // Update the note state so view mode shows updated content,
      // but do NOT reset draft — user may still be editing
      setNote((prev) => prev ? { ...prev, ...draft, updatedAt: new Date().toISOString() } : prev);
      setIsEditing(false);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!note?.id) return;
    setIsDeleting(true);
    try {
      await deleteNote(note.id);
      success("Note deleted successfully");
      navigate("/notes");
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const togglePinned = async () => {
    if (note?.id) await updateNote(note.id, { isPinned: !note.isPinned });
  };

  const toggleFavorite = async () => {
    if (note?.id) await updateNote(note.id, { isFavorite: !note.isFavorite });
  };

  const addTag = () => {
    if (tagInput.trim() && !draft.tags?.includes(tagInput.trim())) {
      setDraft((prev) => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setDraft((prev) => ({ ...prev, tags: (prev.tags || []).filter((t) => t !== tag) }));
  };

  const colors: Array<{ name: NoteColor; class: string }> = [
    { name: "default", class: "bg-primary-500" },
    { name: "red",     class: "bg-red-500" },
    { name: "orange",  class: "bg-orange-500" },
    { name: "yellow",  class: "bg-yellow-500" },
    { name: "green",   class: "bg-green-500" },
    { name: "blue",    class: "bg-blue-500" },
    { name: "purple",  class: "bg-purple-500" },
    { name: "pink",    class: "bg-pink-500" },
  ];

  if (!note) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <FileText size={48} className="mx-auto text-muted mb-4" />
          <h2 className="text-xl font-semibold text-primary mb-2">Note not found</h2>
          <button onClick={() => navigate("/notes")} className="text-primary-500 hover:text-primary-600">
            Back to notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  pt-20 pb-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* ── Header bar ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/notes")} className="p-2 hover:bg-card rounded-lg transition-colors">
              <ArrowLeft size={20} className="text-muted" />
            </button>

            {/* Pin / Favorite / Color */}
            <div className="flex items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={togglePinned}
                className={`p-2 rounded-lg transition-colors ${note.isPinned ? "text-primary-500 bg-primary-500/10" : "text-muted hover:text-primary-500"}`}
              >
                <Pin size={18} className={note.isPinned ? "rotate-45" : ""} />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleFavorite}
                className={`p-2 rounded-lg transition-colors ${note.isFavorite ? "text-accent-yellow bg-accent-yellow/10" : "text-muted hover:text-accent-yellow"}`}
              >
                <Star size={18} fill={note.isFavorite ? "currentColor" : "none"} />
              </motion.button>

              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-2 rounded-lg text-muted hover:text-primary-500 transition-colors"
                >
                  <Palette size={18} />
                </button>
                <AnimatePresence>
                  {showColorPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-1 bg-card border border-default rounded-xl shadow-hard p-2 z-50"
                    >
                      <div className="flex gap-1">
                        {colors.map((c) => (
                          <button
                            key={c.name}
                            onClick={() => { handleContentChange("color", c.name); setShowColorPicker(false); }}
                            className={`w-6 h-6 rounded-full ${c.class} transition-transform hover:scale-110 ${draft.color === c.name ? "ring-2 ring-primary-500 ring-offset-2" : ""}`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Metadata */}
            <div className="hidden sm:flex items-center gap-3 ml-2 text-xs text-muted border-l border-default pl-3">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>Updated {new Date(note.updatedAt || note.createdAt).toLocaleString()}</span>
              </div>
              {note.wordCount ? <><span>•</span><span>{note.wordCount} words</span></> : null}
              {note.readTime  ? <><span>•</span><span>{note.readTime} min read</span></> : null}
            </div>
          </div>

          {/* Save / Edit / Menu */}
          <div className="flex items-center gap-2">
            {isSaving && (
              <div className="flex items-center gap-2 text-xs text-muted">
                <Spinner overlay={false} size="xs" />
                <span>Saving…</span>
              </div>
            )}
            {lastSaved && !isSaving && (
              <div className="text-xs text-muted">Saved {new Date(lastSaved).toLocaleTimeString()}</div>
            )}

            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  <Save size={16} />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => { setDraft(note); setIsEditing(false); }}
                  className="px-4 py-2 text-muted hover:text-primary transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setDraft({ ...note }); setIsEditing(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-default text-primary rounded-lg transition-colors border border-default"
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-2 text-muted hover:text-primary transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>
                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-card border border-default rounded-xl shadow-hard overflow-hidden z-50"
                      >
                        <button
                          onClick={() => { navigator.clipboard.writeText(window.location.href); setShowShareMenu(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-default transition-colors"
                        >
                          <Copy size={14} /><span>Copy link</span>
                        </button>
                        <button
                          onClick={() => setShowShareMenu(false)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-default transition-colors"
                        >
                          <Share2 size={14} /><span>Share</span>
                        </button>
                        <button
                          onClick={() => setShowShareMenu(false)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-default transition-colors"
                        >
                          <Download size={14} /><span>Export</span>
                        </button>
                        <div className="border-t border-default my-1" />
                        <button
                          onClick={() => { setShowDeleteConfirm(true); setShowShareMenu(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-accent-red hover:bg-default transition-colors"
                        >
                          <Trash2 size={14} /><span>Delete</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Tags ── */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Hash size={14} className="text-muted" />
          {(draft.tags || []).map((tag) => (
            <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-card border border-default rounded-lg text-xs text-primary">
              <span>{tag}</span>
              {isEditing && (
                <button onClick={() => removeTag(tag)} className="hover:text-accent-red">
                  <X size={12} />
                </button>
              )}
            </span>
          ))}
          {isEditing && (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                placeholder="Add tag..."
                className="w-24 px-2 py-1 bg-transparent border border-default rounded-lg text-xs text-primary focus:outline-none focus:border-primary-500"
              />
              <button onClick={addTag} className="p-1 text-muted hover:text-primary-500">
                <Check size={14} />
              </button>
            </div>
          )}
        </div>

        {/* ── Note body ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-default overflow-hidden"
          style={{
            borderColor: draft.color && draft.color !== "default"
              ? `var(--color-${draft.color}-500)`
              : undefined,
          }}
        >
          <div className="p-6 md:p-8">
            {/* Title */}
            {isEditing ? (
              <input
                ref={titleRef}
                type="text"
                value={draft.title || ""}
                onChange={(e) => handleContentChange("title", e.target.value)}
                placeholder="Note title..."
                className="w-full text-2xl md:text-3xl font-bold bg-transparent border-b border-default pb-2 mb-6 focus:outline-none focus:border-primary-500 text-primary"
                autoFocus
              />
            ) : (
              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">
                {note.title || "Untitled"}
              </h1>
            )}

            {/* Content — AdvancedMarkdownEditor in edit, MarkdownContent in view */}
            {isEditing ? (
              <AdvancedMarkdownEditor
                value={draft.content || ""}
                onChange={(val) => handleContentChange("content", val)}
                placeholder="Write your note here… (Markdown supported)"
                rows={20}
              />
            ) : (
              <MarkdownContent emptyFallback="*No content yet.*">
                {note.content || ""}
              </MarkdownContent>
            )}
          </div>
        </motion.div>

        {/* ── Attachments ── */}
        {note.attachments && note.attachments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-muted mb-3 flex items-center gap-2">
              <Paperclip size={14} />
              Attachments
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {note.attachments.map((attachment) => (
                <div key={attachment.id} className="bg-card border border-default rounded-lg p-3 flex items-center gap-2">
                  {attachment.type === "image" ? (
                    <Image size={16} className="text-primary-500" />
                  ) : attachment.type === "link" ? (
                    <Link2 size={16} className="text-primary-500" />
                  ) : (
                    <FileText size={16} className="text-primary-500" />
                  )}
                  <span className="text-xs text-primary truncate">{attachment.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Note"
        message={`Are you sure you want to delete "${note?.title || "Untitled"}"? This action cannot be undone.`}
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
