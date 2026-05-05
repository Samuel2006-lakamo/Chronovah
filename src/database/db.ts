// database/db.ts
import Dexie, { type Table } from "dexie";
import type { Note } from "../type/NoteType";
import type { JournalEntry } from "../type/JournalType";
import type { Person } from "../type/PeopleType";
import type { Place } from "../type/PlaceType";

export interface SyncOperation {
  id?: string;
  userId: string;
  table: 'notes' | 'journal' | 'people' | 'places';
  operation: 'create' | 'update' | 'delete';
  recordId: string;
  data?: any;
  createdAt: string;
  retryCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
  bio?: string;
  favoriteQuote?: string;
  updatedAt: string;
}

const DB_NAME = "ChronovahDB";
const DB_VERSION = 5; // bump this whenever schema changes

function buildSchema(dexie: Dexie) {
  // Single source of truth for the schema.
  // All versions below 5 are legacy — we only define the current shape.
  dexie.version(DB_VERSION).stores({
    notes:       "id, userId, title, isPinned, isFavorite, color, createdAt, updatedAt, *tags",
    journal:     "id, userId, mood, isFavorite, createdAt, updatedAt, *tags",
    people:      "id, userId, name, relation, birthday, email, company, isFavorite, createdAt, updatedAt, *tags",
    places:      "id, userId, name, country, type, visitedDate, isFavorite, createdAt, updatedAt, *tags",
    syncQueue:   "id, userId, table, operation, recordId, createdAt, retryCount",
    userProfile: "id, email, updatedAt",
  });
}

class ChronovahDB extends Dexie {
  notes!: Table<Note, string>;
  journal!: Table<JournalEntry, string>;
  people!: Table<Person, string>;
  places!: Table<Place, string>;
  syncQueue!: Table<SyncOperation, string>;
  userProfile!: Table<UserProfile, string>;

  constructor() {
    super(DB_NAME);
    buildSchema(this);
  }
}

/**
 * Open the database. If it fails due to a schema/upgrade error
 * (e.g. primary key change from a previous broken migration),
 * delete the entire database and open a fresh copy.
 * Data will be re-synced from the server on next login.
 */
async function openDatabase(): Promise<ChronovahDB> {
  const instance = new ChronovahDB();
  try {
    await instance.open();
    return instance;
  } catch (err: any) {
    const isUpgradeError =
      err?.name === "UpgradeError" ||
      err?.name === "DatabaseClosedError" ||
      err?.inner?.name === "UpgradeError" ||
      String(err?.message).includes("primary key") ||
      String(err?.message).includes("UpgradeError");

    if (isUpgradeError) {
      console.warn(
        "[DB] Schema upgrade failed — deleting and recreating database.",
        err
      );
      try {
        await instance.delete();
      } catch (_) {
        // If delete also fails, try the native API
        await new Promise<void>((resolve) => {
          const req = indexedDB.deleteDatabase(DB_NAME);
          req.onsuccess = () => resolve();
          req.onerror = () => resolve(); // resolve anyway
          req.onblocked = () => resolve();
        });
      }
      // Return a fresh instance
      const fresh = new ChronovahDB();
      await fresh.open();
      return fresh;
    }

    throw err;
  }
}

// Export a promise that resolves to the ready database.
// All consumers import `db` — it's a proxy that waits for the promise.
let _db: ChronovahDB | null = null;
const _dbReady = openDatabase().then((instance) => {
  _db = instance;
  return instance;
});

// Proxy so existing code (`db.notes.where(...)`) keeps working unchanged.
export const db = new Proxy({} as ChronovahDB, {
  get(_target, prop) {
    if (_db) {
      // Database is ready — return directly (fast path, no overhead)
      return (_db as any)[prop];
    }
    // Database still opening — return a function that waits
    return (...args: any[]) =>
      _dbReady.then((instance) => (instance as any)[prop](...args));
  },
});

export { _dbReady as dbReady };
export default db;
