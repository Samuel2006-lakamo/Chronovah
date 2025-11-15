import type { JournalEntry } from "../Database/journalDB";

export function JournalCard({ item }: { item: JournalEntry }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        {item.mood}
      </h2>

      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
        {item.note}
      </p>
    </div>
  );
}
