import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  CheckCircle,
  MessageSquare,
  UserPlus,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifType = 'assignment' | 'due' | 'comment' | 'completed';

interface NotifItem {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  group: 'today' | 'earlier';
  route: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const NOTIFICATIONS: NotifItem[] = [
  {
    id: '1',
    type: 'assignment',
    title: 'Aksi baru ditugaskan',
    message: 'Anda ditugaskan "Ganti kaca depan" dari inspeksi #INS-2026-0124.',
    time: '2 jam lalu',
    group: 'today',
    route: '/app/actions',
  },
  {
    id: '2',
    type: 'due',
    title: 'Inspeksi segera jatuh tempo',
    message: 'PDI Avanza 2024 jatuh tempo besok pukul 17.00.',
    time: '5 jam lalu',
    group: 'today',
    route: '/app/inspections/1/title',
  },
  {
    id: '3',
    type: 'comment',
    title: 'Komentar baru',
    message: 'Andi Nugroho menambahkan komentar pada laporan inspeksi Anda.',
    time: 'Kemarin',
    group: 'earlier',
    route: '/app/report/3',
  },
  {
    id: '4',
    type: 'completed',
    title: 'Inspeksi disetujui',
    message: 'Monthly Safety Check #INS-2026-0122 telah disetujui.',
    time: '2 hari lalu',
    group: 'earlier',
    route: '/app/inspections/2',
  },
];

// ─── Icon + tonal ring per type ───────────────────────────────────────────────

const TYPE_META: Record<
  NotifType,
  { Icon: React.ElementType; ring: string; icon: string }
> = {
  assignment: {
    Icon: UserPlus,
    ring: 'bg-primary-blue/10',
    icon: 'text-primary-blue',
  },
  due: {
    Icon: AlertCircle,
    ring: 'bg-warning-amber/10',
    icon: 'text-warning-amber',
  },
  comment: {
    Icon: MessageSquare,
    ring: 'bg-info-blue/10',
    icon: 'text-info-blue',
  },
  completed: {
    Icon: CheckCircle,
    ring: 'bg-success-green/10',
    icon: 'text-success-green',
  },
};

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function Notifications() {
  const navigate = useNavigate();
  const [readIds, setReadIds] = useState<Set<string>>(
    new Set(NOTIFICATIONS.filter((n) => n.id === '3' || n.id === '4').map((n) => n.id))
  );

  function markAllRead() {
    setReadIds(new Set(NOTIFICATIONS.map((n) => n.id)));
  }

  function markRead(id: string) {
    setReadIds((prev) => new Set([...prev, id]));
  }

  const unreadCount = NOTIFICATIONS.filter((n) => !readIds.has(n.id)).length;
  const todayItems = NOTIFICATIONS.filter((n) => n.group === 'today');
  const earlierItems = NOTIFICATIONS.filter((n) => n.group === 'earlier');

  function renderGroup(label: string, items: NotifItem[]) {
    if (items.length === 0) return null;
    return (
      <div key={label}>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
          {label}
        </p>
        <div className="rounded-xl border border-divider/60 bg-white divide-y divide-divider/50 overflow-hidden">
          {items.map((notif) => {
            const { Icon, ring, icon } = TYPE_META[notif.type];
            const isRead = readIds.has(notif.id);
            return (
              <button
                key={notif.id}
                onClick={() => {
                  markRead(notif.id);
                  navigate(notif.route);
                }}
                className={`w-full text-left px-4 py-3.5 flex items-start gap-3 active:bg-neutral-50 ${
                  isRead ? 'opacity-55' : ''
                }`}
              >
                {/* Tonal icon circle */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${ring}`}
                >
                  <Icon className={`w-[18px] h-[18px] ${icon}`} strokeWidth={1.8} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-semibold leading-snug ${isRead ? 'text-foreground/70' : 'text-foreground'}`}>
                    {notif.title}
                  </p>
                  <p className="text-[12px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                    {notif.message}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">{notif.time}</p>
                </div>

                {/* Unread dot */}
                {!isRead && (
                  <div className="w-2 h-2 rounded-full bg-primary-blue flex-shrink-0 mt-1.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">

      {/* ── Sticky Header ───────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-divider/50 px-4 status-bar-aware pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-100 flex-shrink-0"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
          </button>
          <h1 className="flex-1 text-[17px] font-semibold tracking-tight">
            Notifikasi
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-blue/12 text-primary-blue text-[11px] font-semibold px-1.5">
                {unreadCount}
              </span>
            )}
          </h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-[12px] font-medium text-primary-blue"
            >
              Tandai semua dibaca
            </button>
          )}
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-[calc(88px+env(safe-area-inset-bottom))] space-y-4">
        {NOTIFICATIONS.length === 0 ? (
          /* Empty state */
          <div className="py-20 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center">
              <Bell className="w-6 h-6 text-muted-foreground/50" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[14px] font-medium text-foreground">Belum ada notifikasi</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Notifikasi akan muncul di sini.
              </p>
            </div>
          </div>
        ) : (
          <>
            {renderGroup('Hari ini', todayItems)}
            {renderGroup('Sebelumnya', earlierItems)}
          </>
        )}
      </div>
    </div>
  );
}
