import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Bell, CalendarDays, CheckCircle2, CheckSquare, Clock3, Layers, Plus, TriangleAlert } from 'lucide-react';
import { INSPECTION_SUMMARIES, type InspectionStatus } from '../lib/inspectionData';
import { getInspectionEntryRoute } from '../lib/inspectionRoutes';

// ─── Types & data ─────────────────────────────────────────────────────────────

type CardStatus = Exclude<InspectionStatus, 'Complete'>;

const IN_PROGRESS_CARDS = INSPECTION_SUMMARIES
  .filter((item) => item.status !== 'Complete')
  .map((item) => ({
    id: item.id,
    label: 'INSPEKSI',
    title: item.title,
    subtitle: `${item.site} · ${item.templateName}`,
    time: item.lastSynced ?? item.dueDate,
    status: item.status as CardStatus,
  }));

type AgendaTab = 'Semua' | 'Inspeksi' | 'Tindakan' | 'Training';
const AGENDA_TABS: AgendaTab[] = ['Semua', 'Inspeksi', 'Tindakan', 'Training'];

function cardAccent(s: CardStatus) {
  if (s === 'Overdue') return 'bg-danger-red';
  if (s === 'Draft') return 'bg-neutral-300';
  return 'bg-primary-blue';
}
function cardBadge(s: CardStatus) {
  if (s === 'Overdue') return 'bg-red-100 text-red-600';
  if (s === 'Draft') return 'bg-neutral-100 text-neutral-500';
  return 'bg-blue-100 text-primary-blue';
}
function cardBadgeLabel(s: CardStatus) {
  if (s === 'Overdue') return 'Terlambat';
  if (s === 'Draft') return 'Draft';
  return 'Berjalan';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate();
  const [agendaTab, setAgendaTab] = useState<AgendaTab>('Semua');

  const stats = useMemo(() => ({ selesai: 8, aktif: 1, draft: 1, terlambat: 1 }), []);

  const todayLabel = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const TOP_DEALERS = [
    { name: 'Dealer Audi VW BSD', pct: 60 },
    { name: 'Dealer Nissan Pulo Gadung', pct: 57 },
    { name: 'Dealer KIA PIK', pct: 50 },
    { name: 'Dealer Nissan Sempaja', pct: 47 },
    { name: 'Dealer Nissan Aceh', pct: 43 },
  ];

  return (
    <div className="bg-neutral-50 min-h-full">

      {/* ── Top App Bar ───────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-200/70 px-4 status-bar-aware">
        <div className="flex items-center justify-between py-2.5">
          <div>
            <p className="text-[16px] font-bold text-neutral-900 leading-tight">G Tech Auditor</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">{todayLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/app/notifications')}
              className="relative w-9 h-9 rounded-xl border border-neutral-200 bg-white flex items-center justify-center"
              aria-label="Notifikasi"
            >
              <Bell className="w-4.5 h-4.5 text-neutral-700" strokeWidth={1.8} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger-red" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-primary-blue flex items-center justify-center">
              <span className="text-[12px] font-bold text-white">JS</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Scrollable Content ────────────────────────────────── */}
      <div className="px-4 pt-4 pb-6 space-y-5">

        {/* Top 5 Best Dealer Progress Card */}
        <section className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          <div className="flex">
            <div className="w-1 bg-primary-blue flex-shrink-0" />
            <div className="flex-1 px-4 pt-4 pb-3">
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-3">
                Top 5 Best Dealer Progress
              </p>
              <div className="space-y-0 divide-y divide-neutral-100">
                {TOP_DEALERS.map((dealer, i) => (
                  <div key={dealer.name} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                    <span className="w-5 text-[12px] font-bold text-neutral-300 flex-shrink-0 text-right">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-neutral-800 truncate leading-tight">{dealer.name}</p>
                      <div className="mt-1.5 h-1 rounded-full bg-neutral-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary-blue"
                          style={{ width: `${dealer.pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-[12px] font-bold text-primary-blue flex-shrink-0 w-9 text-right">{dealer.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Status Capsules Row */}
        <div className="relative -mx-4">
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-neutral-50 to-transparent z-10" />
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 pl-4 pr-10 min-w-max py-0.5">
              <div className="h-8 rounded-full px-3.5 bg-emerald-50 text-[12px] text-emerald-600 font-medium inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                {stats.selesai} Selesai
              </div>
              <div className="h-8 rounded-full px-3.5 bg-blue-50 text-[12px] text-primary-blue font-medium inline-flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" strokeWidth={2} />
                {stats.aktif} Aktif
              </div>
              <div className="h-8 rounded-full px-3.5 bg-neutral-100 text-[12px] text-neutral-500 font-medium inline-flex items-center gap-1.5">
                <Clock3 className="w-3.5 h-3.5" strokeWidth={2} />
                {stats.draft} Draft
              </div>
              <div className="h-8 rounded-full px-3.5 bg-red-50 text-[12px] text-danger-red font-medium inline-flex items-center gap-1.5">
                <TriangleAlert className="w-3.5 h-3.5" strokeWidth={2} />
                {stats.terlambat} Terlambat
              </div>
            </div>
          </div>
        </div>

        {/* Primary CTA Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => navigate('/app/inspections')}
            className="h-12 rounded-xl bg-primary-blue text-white text-[14px] font-semibold shadow-md shadow-primary-blue/20 active:scale-[0.98] transition-transform"
          >
            Mulai Inspeksi
          </button>
          <button
            onClick={() => navigate('/app/training')}
            className="h-12 rounded-xl bg-white border border-neutral-200 text-[14px] font-semibold text-neutral-700 active:scale-[0.98] transition-transform"
          >
            Pelatihan Tim
          </button>
        </div>

        {/* ── Sedang Berjalan ─────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <p className="text-[15px] font-bold text-neutral-900">Sedang Berjalan</p>
              <span className="w-5 h-5 rounded-full bg-primary-blue text-white text-[10px] font-bold flex items-center justify-center">
                {IN_PROGRESS_CARDS.length}
              </span>
            </div>
            <button
              onClick={() => navigate('/app/inspections')}
              className="text-[12px] font-semibold text-primary-blue"
            >
              Lihat semua
            </button>
          </div>

          {/* Horizontal scroll cards */}
          <div className="relative -mx-4">
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-neutral-50 to-transparent z-10" />
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 pl-4 pr-10 min-w-max pb-1">
                {IN_PROGRESS_CARDS.map(card => (
                  <button
                    key={card.id}
                    onClick={() => navigate(getInspectionEntryRoute({ id: card.id, status: card.status }))}
                    className="w-[220px] flex-shrink-0 rounded-2xl bg-white border border-neutral-200 overflow-hidden text-left active:scale-[0.98] transition-transform shadow-sm"
                  >
                    {/* Top accent bar */}
                    <div className={`h-1 w-full ${cardAccent(card.status)}`} />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <CheckSquare className="w-3 h-3 text-primary-blue" strokeWidth={2} />
                          <span className="text-[10px] font-bold tracking-widest text-primary-blue uppercase">{card.label}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${cardBadge(card.status)}`}>
                          {cardBadgeLabel(card.status)}
                        </span>
                      </div>
                      <p className="text-[14px] font-bold text-neutral-900 leading-snug line-clamp-1">{card.title}</p>
                      <p className="text-[11px] text-neutral-400 mt-1 leading-snug line-clamp-2">{card.subtitle}</p>
                      <div className="inline-flex items-center gap-1.5 mt-3 px-2 py-1 rounded-lg bg-neutral-50 border border-neutral-100 text-neutral-500">
                        <Clock3 className="w-3 h-3 text-neutral-400" strokeWidth={2} />
                        <span className="text-[11px]">Diperbarui {card.time}</span>
                      </div>
                    </div>
                  </button>
                ))}

                {/* Add card */}
                <button
                  onClick={() => navigate('/app/inspections')}
                  className="w-[120px] flex-shrink-0 rounded-2xl border-2 border-dashed border-neutral-200 bg-white flex flex-col items-center justify-center gap-2 text-neutral-400 active:scale-[0.98] transition-transform"
                  style={{ minHeight: 140 }}
                >
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                    <Plus className="w-4 h-4" strokeWidth={2.2} />
                  </div>
                  <span className="text-[11px] font-semibold text-center leading-tight px-2">Inspeksi Baru</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Agenda ──────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[15px] font-bold text-neutral-900">Agenda</p>
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-0.5">
            {AGENDA_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setAgendaTab(tab)}
                className={`h-8 px-4 rounded-full text-[12px] font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${
                  agendaTab === tab
                    ? 'bg-primary-blue text-white'
                    : 'bg-white border border-neutral-200 text-neutral-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Empty state */}
          <div className="rounded-2xl bg-white border border-neutral-200 py-10 px-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-neutral-50 flex items-center justify-center mb-4">
              <CalendarDays className="w-7 h-7 text-neutral-300" strokeWidth={1.5} />
            </div>
            <p className="text-[14px] font-semibold text-neutral-700">Semua beres!</p>
            <p className="text-[12px] text-neutral-400 mt-1.5 leading-relaxed max-w-[220px]">
              Item terjadwal dan yang sudah jatuh tempo akan muncul di sini.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
