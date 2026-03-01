import { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronRight,
  ClipboardCheck,
  Copy,
  FileDown,
  Info,
  ListTodo,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import { canUseActions } from '../lib/appConfig';
import { startSync } from '../lib/syncStore';
import { useSyncStatus } from './SyncIndicator';

export type InspectionDetailStatus = 'In Progress' | 'Complete' | 'Draft' | 'Overdue';

export interface InspectionDetailMeta {
  id: string;
  title: string;
  site: string;
  assignee: string;
  dueDate: string;
  templateName: string;
  status: InspectionDetailStatus;
  progress: { completed: number; total: number };
  lastSynced?: string; // display string, e.g. "27 Feb 2026 pukul 15.15"
}

interface Props {
  inspection: InspectionDetailMeta | null;
  onClose: () => void;
  onContinue: (id: string) => void;   // "Lanjutkan Inspeksi" / "Lihat Laporan"
  onDuplicate: (id: string) => void;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: InspectionDetailStatus }) {
  const map: Record<InspectionDetailStatus, { cls: string; label: string }> = {
    'In Progress': { cls: 'bg-primary-blue text-white', label: 'Sedang berjalan' },
    'Complete':    { cls: 'bg-success-green/15 text-success-green', label: 'Selesai' },
    'Draft':       { cls: 'bg-neutral-200 text-neutral-600', label: 'Draft' },
    'Overdue':     { cls: 'bg-danger-red/10 text-danger-red', label: 'Terlambat' },
  };
  const { cls, label } = map[status];
  return (
    <span className={`text-[11px] font-medium px-2.5 py-[3px] rounded-full ${cls}`}>{label}</span>
  );
}

// ─── Reusable action row ──────────────────────────────────────────────────────

function ActionRow({
  icon,
  label,
  danger = false,
  disabled = false,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 py-3.5 text-left ${
        disabled ? 'opacity-35' : 'active:bg-neutral-50'
      }`}
    >
      <div
        className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${
          danger ? 'text-danger-red' : 'text-muted-foreground'
        }`}
      >
        {icon}
      </div>
      <span className={`flex-1 text-[14px] ${danger ? 'text-danger-red' : 'text-foreground'}`}>
        {label}
      </span>
      {!danger && (
        <ChevronRight className="w-4 h-4 text-muted-foreground/35 flex-shrink-0" strokeWidth={1.8} />
      )}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function InspectionDetailsSheet({ inspection, onClose, onContinue, onDuplicate }: Props) {
  const { status: syncStatus, lastSyncedAt } = useSyncStatus();

  const isComplete = inspection?.status === 'Complete';
  const ctaLabel = isComplete ? 'Lihat Laporan' : 'Lanjutkan Inspeksi';

  function handleContinue() {
    if (!inspection) return;
    if (!isComplete) startSync(); // simulate autosave
    onContinue(inspection.id);
    onClose();
  }

  // Last synced display: prefer live sync state, fall back to static data
  function syncLine(): string {
    if (syncStatus === 'syncing') return 'Menyinkronkan…';
    if (syncStatus === 'error') return 'Gagal sinkron. Coba lagi.';
    if (syncStatus === 'synced' && lastSyncedAt) {
      const t = lastSyncedAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const d = lastSyncedAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      return `Terakhir sinkron ${d} pukul ${t}`;
    }
    if (inspection?.lastSynced) return `Terakhir sinkron ${inspection.lastSynced}`;
    return '';
  }

  return (
    <AnimatePresence>
      {inspection && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/55 z-[60]"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 360 }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-card rounded-t-[24px] shadow-2xl max-w-[480px] mx-auto max-h-[85svh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-0 flex-shrink-0">
              <div className="w-10 h-1 bg-neutral-200 rounded-full" />
            </div>

            {/* Scrollable body */}
            <div
              className="flex-1 overflow-y-auto scrollbar-hide"
              style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 20px)' }}
            >
              {/* Inspection identity */}
              <div className="px-5 pt-4 pb-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-blue/10 flex items-center justify-center flex-shrink-0">
                  <ClipboardCheck className="w-[18px] h-[18px] text-primary-blue" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-muted-foreground">
                    {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} / {inspection.assignee}
                  </p>
                  <p className="text-[15px] font-semibold text-foreground leading-snug mt-0.5">
                    {inspection.title}
                  </p>
                  <p className="text-[12px] text-muted-foreground mt-0.5 truncate">
                    {inspection.site} · {inspection.templateName}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={inspection.status} />
                  </div>
                  {syncLine() && (
                    <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
                      <span className="w-3 h-3 inline-flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                          <path d="M10 6A4 4 0 1 1 2.1 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M2 2v3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {syncLine()}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-100 flex-shrink-0 mt-0.5"
                  aria-label="Tutup"
                >
                  <X className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                </button>
              </div>

              {/* Primary CTA */}
              <div className="px-5 pb-4">
                <button
                  onClick={handleContinue}
                  className="w-full h-12 rounded-xl bg-primary-blue text-white text-[14px] font-semibold"
                  style={{ boxShadow: '0 2px 8px rgba(37,99,235,0.28)' }}
                >
                  {ctaLabel}
                </button>
              </div>

              {/* Share */}
              <div className="px-5 border-t border-divider/50">
                <ActionRow
                  icon={<Share2 className="w-4 h-4" strokeWidth={1.8} />}
                  label="Bagikan inspeksi"
                  onClick={onClose}
                />
              </div>

              {/* Secondary actions */}
              <div className="px-5 border-t border-divider/50">
                <ActionRow
                  icon={<FileDown className="w-4 h-4" strokeWidth={1.8} />}
                  label="Lihat & unduh laporan"
                  disabled={!isComplete}
                  onClick={onClose}
                />
                <div className="border-t border-divider/40" />
                <ActionRow
                  icon={<Info className="w-4 h-4" strokeWidth={1.8} />}
                  label="Detail"
                  onClick={onClose}
                />
                {canUseActions && (
                  <>
                    <div className="border-t border-divider/40" />
                    <ActionRow
                      icon={<ListTodo className="w-4 h-4" strokeWidth={1.8} />}
                      label="Lihat temuan"
                      onClick={onClose}
                    />
                  </>
                )}
                <div className="border-t border-divider/40" />
                <ActionRow
                  icon={<Copy className="w-4 h-4" strokeWidth={1.8} />}
                  label="Duplikat"
                  onClick={() => { onDuplicate(inspection.id); onClose(); }}
                />
              </div>

              {/* Archive — danger */}
              <div className="px-5 border-t border-divider/50">
                <ActionRow
                  icon={<Trash2 className="w-4 h-4" strokeWidth={1.8} />}
                  label="Arsipkan"
                  danger
                  onClick={onClose}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
