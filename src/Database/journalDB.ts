import Dexie, { type Table } from "dexie";

export interface JournalEntry {
  id?: number;
  mood: string;
  note: string;
  tags: string[];
  createdAt: string;
}

const db = new Dexie("JournalDatabase") as Dexie & {
  journal: Table<JournalEntry, number>;
};

db.version(1).stores({
  journal: "++id, mood, note, tags, createdAt",
});

export { db };
