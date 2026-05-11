// pages/Notes/index.tsx
import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  BookOpen,
  Edit3,
  SortDesc,
  Grid3X3,
  List,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { Note, NoteColor } from "../../type/NoteType";
import NoteCard from "./NoteCard";
import NoteEditor from "./NoteEditor";
import CommonPageHeader from "../../components/CommonPageHeader";
import NoteStats from "./NoteStats";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../../components/Toast";
import { useNotes } from "../../hooks/useNotes";
import NotesSkeleton from "../../components/skeletons/NotesSkeleton";

type SortOption = "updated" | "created" | "title" | "wordCount";
type FilterOption = "all" | "pinned" | "favorites" | "recent";

export default function Notes() {
  const navigate = useNavigate();
  const { toasts, removeToast, success, error } = useToast();
  const { notes, isLoading, createNote, updateNote } = useNotes();

  // State for UI
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("updated");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [selectedColor, setSelectedColor] = useState<NoteColor | "all">("all");
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [editingNote, setEditingNote] = useState<Partial<Note> | null>(null);

  // Extract all unique tags from notes
  useEffect(() => {
    if (notes) {
      const tags = new Set<string>();
      notes.forEach((note) => note.tags?.forEach((tag) => tags.add(tag)));
      setAvailableTags(Array.from(tags));
    }
  }, [notes]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!notes) return null;
    return {
      totalNotes: notes.length,
      pinnedNotes: notes.filter((n) => n.isPinned).length,
      favoriteNotes: notes.filter((n) => n.isFavorite).length,
      totalWords: notes.reduce(
        (acc, note) =>
          acc +
          (note.wordCount || note.content.split(/\s+/).filter(Boolean).length),
        0,
      ),
    };
  }, [notes]);

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    if (!notes) return [];

    let filtered = [...notes];

    // Apply search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchLower) ||
          note.content.toLowerCase().includes(searchLower) ||
          note.tags?.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    // Apply filter by type
    switch (filterBy) {
      case "pinned":
        filtered = filtered.filter((n) => n.isPinned);
        break;
      case "favorites":
        filtered = filtered.filter((n) => n.isFavorite);
        break;
      case "recent":
        filtered = filtered.filter((n) => {
          const daysAgo =
            (Date.now() - new Date(n.updatedAt).getTime()) /
            (1000 * 60 * 60 * 24);
          return daysAgo <= 7;
        });
        break;
    }

    // Apply color filter
    if (selectedColor !== "all") {
      filtered = filtered.filter((n) => n.color === selectedColor);
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      filtered = filtered.filter((note) =>
        selectedTags.every((tag) => note.tags?.includes(tag)),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      // Pinned notes always on top (already handled, but just in case)
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      switch (sortBy) {
        case "updated":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "created":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        case "wordCount":
          return (b.wordCount || 0) - (a.wordCount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [notes, debouncedSearch, filterBy, sortBy, selectedColor, selectedTags]);

  const handleCreateNote = async () => {
    try {
      const newNote = await createNote({
        title: "Untitled",
        content: "",
        isPinned: false,
        isFavorite: false,
        tags: [],
        wordCount: 0,
        readTime: 0,
      });
      navigate(`/notes/${newNote.id}`);
    } catch (err) {
      console.log(err);
      error("Failed to create note. Please try again.");
    }
  };

  const handleQuickCreate = () => {
    setEditingNote({
      title: "",
      content: "",
      tags: [],
    });
    setShowQuickCreate(true);
  };

  const handleQuickSave = async (note: Partial<Note>) => {
    try {
      await createNote({
        title: note.title || "",
        content: note.content || "",
        isPinned: false,
        isFavorite: false,
        tags: note.tags || [],
        wordCount: note.content?.split(/\s+/).filter(Boolean).length || 0,
        readTime: Math.max(
          1,
          Math.ceil(
            (note.content?.split(/\s+/).filter(Boolean).length || 0) / 200,
          ),
        ),
        color: note.color,
      });
      success("Note created successfully");
      setShowQuickCreate(false);
      setEditingNote(null);
    } catch (err) {
      console.log(err);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setFilterBy("all");
    setSelectedColor("all");
    setSelectedTags([]);
  };

  const hasActiveFilters =
    searchTerm ||
    filterBy !== "all" ||
    selectedColor !== "all" ||
    selectedTags.length > 0;

  return (
    <div className=" bg-defaul  pt-20 pb-24 px-3 sm:px-6">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="min-w-full">
        {/* Header with stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <CommonPageHeader isSetting={false} heading="Notes" />

          <div className="flex gap-2">
            {/* Quick Create Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickCreate}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-card border border-default text-primary hover:bg-default rounded-xl transition-colors"
              aria-label="Quick note"
            >
              <Edit3 size={18} />
              <span className="hidden sm:inline">Quick Note</span>
            </motion.button>

            {/* Full Editor Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateNote}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors shadow-soft hover:shadow-medium"
              aria-label="New note"
            >
              <Plus size={18} />
              <span>New Note</span>
            </motion.button>
          </div>
        </div>

        {/* Show skeleton only when notes haven't loaded from local DB yet */}
        {isLoading ? (
          <NotesSkeleton viewMode={viewMode} />
        ) : (
          <>
        {/* Stats Cards */}
        {stats && <NoteStats stats={stats} />}

        {/* Quick Create Modal */}
        <AnimatePresence>
          {showQuickCreate && (
            <NoteEditor
              note={editingNote}
              onSave={handleQuickSave}
              onClose={() => {
                setShowQuickCreate(false);
                setEditingNote(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* Search and filters bar */}
        <div className="mt-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                size={18}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notes by title, content, or tags..."
                className="w-full pl-10 pr-4 py-3 bg-card border border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* View mode toggle */}
            <div className="flex items-center gap-1 bg-card rounded-lg p-1 border border-default self-start">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary-500 text-white"
                    : "text-muted hover:text-primary-500"
                }`}
                aria-label="Grid view"
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-primary-500 text-white"
                    : "text-muted hover:text-primary-500"
                }`}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-card border border-default rounded-xl text-muted focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none cursor-pointer"
              aria-label="Sort by"
            >
              <option value="updated">Last updated</option>
              <option value="created">Date created</option>
              <option value="title">Title</option>
              <option value="wordCount">Word count</option>
            </select>
          </div>
        </div>
        {/* After the sort dropdown, add this tag filter section */}
        {availableTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-default">
            <span className="text-xs font-medium text-muted mr-1">
              Filter by tag:
            </span>
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTags((prev) =>
                    prev.includes(tag)
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag],
                  );
                }}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  selectedTags.includes(tag)
                    ? "bg-primary-500 text-white"
                    : "bg-default text-muted hover:text-primary hover:bg-card"
                }`}
              >
                #{tag}
              </button>
            ))}
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="text-xs text-muted hover:text-primary ml-2"
              >
                Clear all
              </button>
            )}
          </div>
        )}
        {/* Results count */}
        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>{filteredNotes.length} notes found</span>
          {hasActiveFilters && (
            <span className="flex items-center gap-1">
              <SortDesc size={14} />
              <span className="capitalize">Sorted by {sortBy}</span>
            </span>
          )}
        </div>

        {/* Empty state with create options */}
        {filteredNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="relative inline-block">
              <BookOpen size={64} className="text-muted opacity-30" />
              {hasActiveFilters ? (
                <Search
                  size={32}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-muted"
                />
              ) : (
                <Plus
                  size={32}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-500"
                />
              )}
            </div>

            <h3 className="text-lg font-semibold text-primary mt-6 mb-2">
              {hasActiveFilters ? "No notes found" : "No notes yet"}
            </h3>

            <p className="text-muted max-w-md mx-auto mb-6">
              {hasActiveFilters
                ? "Try adjusting your filters or search terms"
                : "Start capturing your thoughts, ideas, and memories"}
            </p>

            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="text-primary-500 hover:text-primary-600 text-sm"
              >
                Clear all filters
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleQuickCreate}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-card border border-default text-primary hover:bg-default rounded-xl transition-colors"
                >
                  <Edit3 size={18} />
                  <span>Quick Note</span>
                </button>
                <button
                  onClick={handleCreateNote}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
                >
                  <Plus size={18} />
                  <span>Create Detailed Note</span>
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-6 ${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-3"
            }`}
          >
            <AnimatePresence>
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  viewMode={viewMode}
                  onClick={() => navigate(`/notes/${note.id}`)}
                  onUpdate={updateNote}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
