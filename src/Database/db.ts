import Dexie, { type EntityTable } from "dexie";
import type { Note } from "../type/NoteType";

const db = new Dexie("LifePanelDB") as Dexie & {
  notes: EntityTable<Note, "id">;
};

db.version(1).stores({
  notes: "id, title, createdAt, updatedAt, pinned",
});

export { db };
