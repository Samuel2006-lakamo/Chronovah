import { useState } from "react";
import { db } from "../Database/db";
import { nanoid } from "nanoid";
import { Plus, Trash2 } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import type { Note } from "../type/NoteType";

function Notes() {
  const notes = useLiveQuery(() => db.notes.toArray(), []);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  // Add a new note
  const addNote = async () => {
    if (!newNote.title.trim() && !newNote.content.trim()) return;

    const note: Note = {
      id: nanoid(),
      title: newNote.title.trim() || "Untitled",
      content: newNote.content.trim(),
      createdAt: new Date().toISOString(),
    };

    await db.notes.add(note);
    setNewNote({ title: "", content: "" });
  };

  // Update a note
  const updateNote = async (id: string, field: keyof Note, value: string) => {
    await db.notes.update(id, { [field]: value });
  };

  // Delete a note
  const deleteNote = async (id: string) => {
    await db.notes.delete(id);
  };

  return (
    <div className="p-4 mt-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          My Notes
        </h2>
        <button
          onClick={addNote}
          className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <Plus size={18} /> Add Note
        </button>
      </div>

      {/* Create new note */}
      <div className="bg-white dark:bg-[#0B1120] p-4 rounded-lg shadow mb-6">
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
      </div>

      {/* Notes list */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes?.map((note) => (
          <div
            key={note.id}
            className="bg-white dark:bg-[#0B1120] p-4 rounded-lg shadow hover:shadow-md transition relative"
          >
            <button
              onClick={() => deleteNote(note.id)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            >
              <Trash2 size={16} />
            </button>

            <input
              value={note.title}
              onChange={(e) => updateNote(note.id, "title", e.target.value)}
              className="w-full font-semibold text-lg bg-transparent outline-none dark:text-gray-100 text-gray-800"
            />
            <textarea
              value={note.content}
              onChange={(e) => updateNote(note.id, "content", e.target.value)}
              className="w-full bg-transparent outline-none resize-none mt-2 dark:text-gray-300 text-gray-700"
              rows={4}
            />
          </div>
        ))}
      </div>
    </div>
  );
}  

export default Notes;
