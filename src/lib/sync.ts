// lib/sync.ts
import { protectedAxios } from '../../axios';
import { db, type SyncOperation } from '../database/db';
import type { Note } from '../type/NoteType';
import type { JournalEntry } from '../type/JournalType';
import type { Person } from '../type/PeopleType';
import type { Place } from '../type/PlaceType';
import { newId } from './helpers';

export type SyncStatus = 'syncing' | 'synced' | 'offline' | 'error';
export type SyncTable = 'notes' | 'journal' | 'people' | 'places';

// In dev use localhost, in production use the hosted backend
const API_BASE = import.meta.env.DEV
  ? 'http://localhost:8000/api/v1'
  : (import.meta.env.VITE_API_URL || 'https://api-chronovah-backend.onrender.com/api/v1');

class SyncManager {
  private isOnline = navigator.onLine;
  private syncInProgress = false;
  private lastError = false;
  private lastSyncedAt: Date | null = null;

  // SSE
  private sseSource: EventSource | null = null;
  private sseUserId: string | null = null;
  private sseReconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
      // Reconnect SSE when coming back online
      if (this.sseUserId) this.connectSSE(this.sseUserId);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // ─── SSE ────────────────────────────────────────────────────────────────────

  /**
   * Open an SSE connection for the given user.
   * When the server broadcasts a sync event, we re-pull only the affected table.
   */
  connectSSE(userId: string): void {
    // Don't open duplicate connections
    if (this.sseSource && this.sseUserId === userId) return;

    this.disconnectSSE();
    this.sseUserId = userId;

    // SSE needs credentials (cookie) — use the full URL with withCredentials
    const url = `${API_BASE}/sse`;
    const source = new EventSource(url, { withCredentials: true });
    this.sseSource = source;

    source.addEventListener('connected', () => {
      console.log('[SSE] Connected');
      if (this.sseReconnectTimer) {
        clearTimeout(this.sseReconnectTimer);
        this.sseReconnectTimer = null;
      }
    });

    source.addEventListener('sync', (e: MessageEvent) => {
      try {
        const { table } = JSON.parse(e.data) as { table: SyncTable; ts: number };
        console.log(`[SSE] Sync event for table: ${table}`);
        this.pullTable(userId, table);
      } catch (_) {}
    });

    source.onerror = () => {
      console.warn('[SSE] Connection lost — reconnecting in 5s');
      source.close();
      this.sseSource = null;
      // Exponential back-off reconnect
      this.sseReconnectTimer = setTimeout(() => {
        if (this.sseUserId) this.connectSSE(this.sseUserId);
      }, 5000);
    };
  }

  disconnectSSE(): void {
    if (this.sseReconnectTimer) {
      clearTimeout(this.sseReconnectTimer);
      this.sseReconnectTimer = null;
    }
    if (this.sseSource) {
      this.sseSource.close();
      this.sseSource = null;
    }
    this.sseUserId = null;
  }

  // ─── Pull a single table from server into Dexie ─────────────────────────────

  async pullTable(userId: string, table: SyncTable): Promise<void> {
    if (!this.isOnline) return;
    try {
      // Check for pending create operations for this table before pulling.
      // If any exist, we must not delete those locally-created records from
      // Dexie — they haven't been confirmed by the server yet.
      // Note: syncQueue only has individual indexes (no compound index), so we
      // filter on the indexed `userId` field first, then narrow in JS.
      const pendingCreates = await db.syncQueue
        .where('userId').equals(userId)
        .filter((op) => op.table === table && op.operation === 'create')
        .toArray();
      const pendingIds = new Set(pendingCreates.map((op) => op.recordId));
      const hasPendingCreates = pendingIds.size > 0;

      switch (table) {
        case 'notes': {
          const { data } = await protectedAxios.get<Note[]>('/notes');
          if (hasPendingCreates) {
            // Merge path: preserve locally-created notes not yet on the server
            await db.notes
              .where('userId').equals(userId)
              .filter((record) => !pendingIds.has(record.id))
              .delete();
            if (data?.length) await db.notes.bulkPut(data);
          } else {
            // Fast path: no pending creates — safe to replace entirely
            await db.notes.where('userId').equals(userId).delete();
            if (data?.length) await db.notes.bulkAdd(data);
          }
          break;
        }
        case 'journal': {
          const { data } = await protectedAxios.get<JournalEntry[]>('/journal');
          if (hasPendingCreates) {
            await db.journal
              .where('userId').equals(userId)
              .filter((record) => !pendingIds.has(record.id))
              .delete();
            if (data?.length) await db.journal.bulkPut(data);
          } else {
            await db.journal.where('userId').equals(userId).delete();
            if (data?.length) await db.journal.bulkAdd(data);
          }
          break;
        }
        case 'people': {
          const { data } = await protectedAxios.get<Person[]>('/people');
          if (hasPendingCreates) {
            await db.people
              .where('userId').equals(userId)
              .filter((record) => !pendingIds.has(record.id))
              .delete();
            if (data?.length) await db.people.bulkPut(data);
          } else {
            await db.people.where('userId').equals(userId).delete();
            if (data?.length) await db.people.bulkAdd(data);
          }
          break;
        }
        case 'places': {
          const { data } = await protectedAxios.get<Place[]>('/places');
          if (hasPendingCreates) {
            await db.places
              .where('userId').equals(userId)
              .filter((record) => !pendingIds.has(record.id))
              .delete();
            if (data?.length) await db.places.bulkPut(data);
          } else {
            await db.places.where('userId').equals(userId).delete();
            if (data?.length) await db.places.bulkAdd(data);
          }
          break;
        }
      }
    } catch (err) {
      console.warn(`[Sync] Failed to pull ${table}:`, err);
    }
  }

  // ─── Initial full pull on login ──────────────────────────────────────────────

  async pullUserData(userId: string): Promise<void> {
    if (!this.isOnline) return;
    await Promise.allSettled([
      this.pullTable(userId, 'notes'),
      this.pullTable(userId, 'journal'),
      this.pullTable(userId, 'people'),
      this.pullTable(userId, 'places'),
    ]);
    // Open SSE after initial pull so we get live updates going forward
    this.connectSSE(userId);
  }

  // ─── Outbound sync queue ─────────────────────────────────────────────────────

  async queueOperation(
    userId: string,
    table: SyncOperation['table'],
    operation: SyncOperation['operation'],
    recordId: string,
    data?: any
  ): Promise<void> {
    const syncOp: SyncOperation = {
      id: newId(),
      userId,
      table,
      operation,
      recordId,
      data,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };

    await db.syncQueue.add(syncOp);

    if (this.isOnline && !this.syncInProgress) {
      this.processSyncQueue();
    }
  }

  private async processSyncQueue(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) return;
    this.syncInProgress = true;

    try {
      const pendingOps = await db.syncQueue.orderBy('createdAt').toArray();

      for (const op of pendingOps) {
        try {
          await this.syncOperation(op);
          await db.syncQueue.delete(op.id!);
          this.lastError = false;
        } catch (error) {
          console.warn('[Sync] Operation failed, will retry:', op, error);
          this.lastError = true;
          await db.syncQueue.update(op.id!, { retryCount: op.retryCount + 1 });
          if (op.retryCount >= 5) {
            await db.syncQueue.delete(op.id!);
          }
        }
      }

      if (!this.lastError) this.lastSyncedAt = new Date();
    } catch (error) {
      console.error('[Sync] Queue processing failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncOperation(op: SyncOperation): Promise<void> {
    const endpoint = `/${op.table}`;

    switch (op.operation) {
      case 'create':
        await protectedAxios.post(endpoint, op.data);
        break;
      case 'update':
        await protectedAxios.put(`${endpoint}/${op.recordId}`, op.data);
        break;
      case 'delete':
        await protectedAxios.delete(`${endpoint}/${op.recordId}`);
        break;
    }
  }

  // ─── Logout cleanup ──────────────────────────────────────────────────────────

  async clearUserData(userId: string): Promise<void> {
    this.disconnectSSE();
    await db.notes.where('userId').equals(userId).delete();
    await db.journal.where('userId').equals(userId).delete();
    await db.people.where('userId').equals(userId).delete();
    await db.places.where('userId').equals(userId).delete();
    await db.syncQueue.where('userId').equals(userId).delete();
  }

  // ─── Status ──────────────────────────────────────────────────────────────────

  getStatus(): SyncStatus {
    if (!this.isOnline) return 'offline';
    if (this.syncInProgress) return 'syncing';
    if (this.lastError) return 'error';
    return 'synced';
  }

  getLastSyncedAt(): Date | null {
    return this.lastSyncedAt;
  }
}

export const syncManager = new SyncManager();
