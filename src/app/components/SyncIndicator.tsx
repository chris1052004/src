import { useEffect, useState } from 'react';
import { getState, subscribe } from '../lib/syncStore';

function formatLastSynced(date: Date): string {
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 10) return 'baru saja';
  if (diffSec < 60) return `${diffSec} detik lalu`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} menit lalu`;
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

interface SyncIndicatorProps {
  /** Optional className override for the wrapper span */
  className?: string;
}

/**
 * SyncIndicator — renders nothing when idle, shows sync state otherwise.
 * Drop it anywhere a "saving" status makes sense (template editor header,
 * inspection details sheet, etc.).
 */
export function SyncIndicator({ className = '' }: SyncIndicatorProps) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    return subscribe(() => forceUpdate((n) => n + 1));
  }, []);

  const { status, lastSyncedAt } = getState();

  if (status === 'idle') return null;

  let label: string;
  let colorClass: string;

  if (status === 'syncing') {
    label = 'Menyimpan…';
    colorClass = 'text-muted-foreground';
  } else if (status === 'error') {
    label = 'Gagal sinkron';
    colorClass = 'text-danger-red';
  } else {
    // synced
    label = `Tersimpan ${lastSyncedAt ? formatLastSynced(lastSyncedAt) : ''}`;
    colorClass = 'text-muted-foreground';
  }

  return (
    <span className={`text-[11px] ${colorClass} ${className}`}>{label}</span>
  );
}

/**
 * useSyncStatus — hook for components that need to read status directly.
 */
export function useSyncStatus() {
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    return subscribe(() => forceUpdate((n) => n + 1));
  }, []);
  return getState();
}
