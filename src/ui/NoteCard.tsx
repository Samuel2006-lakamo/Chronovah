import type { Note } from "../type/NoteType";

export function NotesCard({ item }: { item: Note }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        {item.title}
      </h2>

      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
        {item.content}
      </p>
    </div>
  );
}
