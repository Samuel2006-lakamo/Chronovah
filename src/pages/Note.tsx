import { useEffect, useState } from "react";
import { db } from "../Database/db";

import { Plus, Trash2 } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import type { Note } from "../type/NoteType";
import { motion, AnimatePresence } from "framer-motion";
import CommonPageHeader from "../components/CommonPageHeader";

function Notes() {
  const notes = useLiveQuery(() => db.notes.toArray(), []);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  // Per-note drafts
  const [drafts, setDrafts] = useState<
    Record<number, { title: string; content: string }>
  >({});

  // Undo state
  const [lastDeleted, setLastDeleted] = useState<Note | null>(null);
  const [showUndo, setShowUndo] = useState(false);

  // Sync drafts
  useEffect(() => {
    if (notes) {
      const next: Record<number, { title: string; content: string }> = {};
      notes.forEach((n) => {
        if (n.id != null) next[n.id] = { title: n.title, content: n.content };
      });
      setDrafts(next);
    }
  }, [notes]);

  // Add note
  const addNote = async () => {
    if (!newNote.title.trim() && !newNote.content.trim()) return;

    const note: Note = {
      title: newNote.title.trim() || "Untitled",
      content: newNote.content.trim(),
      createdAt: new Date().toISOString(),
    };

    await db.notes.add(note);
    setNewNote({ title: "", content: "" });
  };

  // Delete note with undo
  const deleteNote = async (id: number | undefined) => {
    if (id == null) return;

    const toDelete = notes?.find((n) => n.id === id);
    if (!toDelete) return;

    setLastDeleted(toDelete);
    setShowUndo(true);

    await db.notes.delete(Number(id));

    setTimeout(() => setShowUndo(false), 5000);
  };

  // Restore deleted note
  const undoDelete = async () => {
    if (!lastDeleted) return;

    await db.notes.add({
      title: lastDeleted.title,
      content: lastDeleted.content,
      createdAt: lastDeleted.createdAt,
    });

    setLastDeleted(null);
    setShowUndo(false);
  };

  // Draft update
  const onDraftChange = (
    id: number,
    field: "title" | "content",
    value: string
  ) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // Commit changes on blur
  const commitDraftOnBlur = (
    id: number | undefined,
    field: "title" | "content"
  ) => {
    if (id == null) return;

    const d = drafts[id];
    if (!d) return;

    // Auto-delete empty note
    if (!d.title.trim() && !d.content.trim()) {
      deleteNote(id);
      return;
    }

    const current =
      field === "title"
        ? notes?.find((n) => n.id === id)?.title
        : notes?.find((n) => n.id === id)?.content;

    const newVal = field === "title" ? d.title : d.content;

    if (newVal !== undefined && current !== newVal) {
      db.notes.update(Number(id), { [field]: newVal });
    }
  };

  // Loading state
  if (!notes)
    return (
      <div className="p-4 mt-20 text-center text-gray-500 dark:text-gray-400">
        Loading notes...
      </div>
    );

  return (
    <div className="p-4 mt-20 mb-20">
      <CommonPageHeader isSetting={false} heading="Notes" />

      {/* Add note box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-white dark:bg-[#0B1120] p-4 rounded-lg shadow mb-6"
      >
        <input
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          placeholder="Note title..."
          className="w-full mb-2 text-lg font-semibold bg-transparent outline-none dark:text-gray-100 text-gray-800"
        />
        <textarea
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          placeholder="Write your note..."
          rows={3}
          className="w-full bg-transparent outline-none resize-none dark:text-gray-300 text-gray-700"
        />

        <button
          onClick={addNote}
          disabled={!newNote.title.trim() && !newNote.content.trim()}
          className="flex items-center gap-2 place-self-end dark:disabled:bg-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg bg-blue-600 transition"
        >
          <Plus size={18} /> Add
        </button>
      </motion.div>

      {/* Empty state */}
      {notes.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
          <p>No notes yet ✨</p>
          <p className="text-sm mt-1">Start by creating your first note.</p>
        </div>
      )}

      {/* Notes list */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{
                duration: 0.25,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="bg-white dark:bg-[#0B1120] p-4 rounded-lg shadow hover:shadow-md transition relative"
            >
              <button
                onClick={() => deleteNote(note.id!)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>

              <input
                value={drafts[note.id!]?.title ?? note.title}
                onChange={(e) =>
                  onDraftChange(note.id!, "title", e.target.value)
                }
                onBlur={() => commitDraftOnBlur(note.id!, "title")}
                className="w-full font-semibold text-lg bg-transparent outline-none dark:text-gray-100 text-gray-800"
              />
              <textarea
                value={drafts[note.id!]?.content ?? note.content}
                onChange={(e) =>
                  onDraftChange(note.id!, "content", e.target.value)
                }
                onBlur={() => commitDraftOnBlur(note.id!, "content")}
                className="w-full bg-transparent outline-none resize-none mt-2 dark:text-gray-300 text-gray-700"
                rows={4}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Undo toast */}
      {showUndo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 10 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-3 mb-20 md:mb-5 md:ml-30 z-30"
        >
          <span className="text-sm opacity-90">Note deleted</span>

          <button
            onClick={undoDelete}
            className="text-blue-300 font-semibold hover:text-blue-400 transition"
          >
            Undo
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default Notes;
