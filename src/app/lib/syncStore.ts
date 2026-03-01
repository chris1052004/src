/**
 * syncStore — lightweight observable sync state.
 * No external state library needed. Backend can be plugged in later
 * by replacing the setTimeout in startSync() with a real API call.
 */

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

interface SyncState {
  status: SyncStatus;
  lastSyncedAt: Date | null;
}

let state: SyncState = { status: 'idle', lastSyncedAt: null };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((fn) => fn());
}

/** Subscribe to state changes. Returns an unsubscribe function. */
export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getState(): Readonly<SyncState> {
  return state;
}

/**
 * Trigger a sync cycle:
 *   → immediately: status = 'syncing'
 *   → after 800–1500ms: status = 'synced' (or 'error' at ~5%)
 *   → after 4s: status returns to 'idle'
 */
export function startSync(): void {
  if (state.status === 'syncing') return; // already in flight

  state = { ...state, status: 'syncing' };
  emit();

  const delay = 800 + Math.random() * 700; // 800–1500 ms
  setTimeout(() => {
    if (Math.random() < 0.05) {
      state = { ...state, status: 'error' };
    } else {
      state = { status: 'synced', lastSyncedAt: new Date() };
    }
    emit();

    // Auto-return to idle so the indicator doesn't stick forever
    setTimeout(() => {
      if (state.status !== 'syncing') {
        state = { ...state, status: 'idle' };
        emit();
      }
    }, 4000);
  }, delay);
}
