import { useState } from "react";
import { db } from "../Database/journalDB";
// import { nanoid } from "nanoid";
import { useLiveQuery } from "dexie-react-hooks";
import CommonPageHeader from "../components/CommonPageHeader";

const moods = [
  { emoji: "😄", label: "Happy" },
  { emoji: "😊", label: "Good" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😞", label: "Sad" },
  { emoji: "😭", label: "Terrible" },
];

function Journal() {
  const journals = useLiveQuery(() => db.journal.toArray(), []);
  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);
const [editing, setEditing] = useState<number | null>(null);
const [editData, setEditData] = useState<{ note: string; tags: string[] }>({
  note: "",
  tags: [],
});;

  const addTag = () => {
    if (!tagInput.trim()) return;
    setTags((prev) => [...prev, tagInput.trim()]);
    setTagInput("");
  };

const saveEntry = async () => {
  if (!note.trim() || !selectedMood) return;
  await db.journal.add({
    mood: selectedMood,
    note,
    tags,
    createdAt: new Date().toISOString(),
  });
  setNote("");
  setSelectedMood("");
  setTags([]);
};

const openEdit = (entryId: number, note: string, tags: string[]) => {
  setEditing(entryId);
  setEditData({ note, tags });
};

const saveEdit = async () => {
  if (editing == null) return;
  await db.journal.update(editing, {
    note: editData.note,
    tags: editData.tags,
  });
  setEditing(null);
};

const deleteEntry = async (id: number) => {
  await db.journal.delete(id);
  setEditing(null);
};

  return (
    <div className="p-4 sm:p-6 mt-20 pb-28 transition-colors duration-300">
      {/* Header */}
     <CommonPageHeader heading="Journal"/>

      {/* Mood Picker */}
      <div className="flex justify-around mb-6">
        {moods.map((m) => (
          <button
            key={m.label}
            onClick={() => setSelectedMood(m.label)}
            className={`text-3xl p-2 rounded-full transition transform ${
              selectedMood === m.label
                ? "bg-blue-100 dark:bg-blue-900 scale-110"
                : "hover:bg-gray-100 dark:hover:bg-[#1E293B]"
            }`}
          >
            {m.emoji}
          </button>
        ))}
      </div>

      {/* Journal Input */}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write about your day..."
        rows={6}
        className="w-full p-3 rounded-md bg-white dark:bg-[#1E293B] text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((t) => (
          <span
            key={t}
            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
          >
            #{t}
          </span>
        ))}
      </div>

      <div className="flex gap-2 mb-8">
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="Add a tag..."
          className="flex-1 p-2 rounded-md bg-white dark:bg-[#1E293B] text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTag}
          className="px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* Floating Save Button */}
      <button
        onClick={saveEntry}
        className="fixed bottom-24 right-6 sm:bottom-10 sm:right-10 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-105"
      >
        💾
      </button>

      {/* Journal Entries */}
      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {journals?.map((entry) => (
          <div
            key={entry.id}
            onClick={() => openEdit(entry.id!, entry.note, entry.tags)}
            className="p-4 bg-white dark:bg-[#0B1120] rounded-lg shadow hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">
                {moods.find((m) => m.label === entry.mood)?.emoji}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(entry.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p
              className={`text-gray-700 dark:text-gray-300 break-words whitespace-pre-wrap transition-all duration-300 ${
                expanded ? "" : "line-clamp-3"
              }`}
            >
              {entry.note}
            </p>

            {entry.note.length > 120 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-blue-500 text-sm mt-2 hover:underline"
              >
                {expanded ? "See Less" : "See More"}
              </button>
            )}
            {entry.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {entry.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-[#0B1120] p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Edit Journal
            </h3>
            <textarea
              value={editData.note}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, note: e.target.value }))
              }
              rows={4}
              className="w-full p-3 rounded-md bg-gray-100 dark:bg-[#1E293B] text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => deleteEntry(editing)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
              >
                Delete
              </button>
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Journal;
