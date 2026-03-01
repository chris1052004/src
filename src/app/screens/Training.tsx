import { useMemo, useState } from 'react';
import { BookOpen, CalendarDays, CheckSquare, FileText, MapPin, PlayCircle, Search, User2, X } from 'lucide-react';
import { clsx } from 'clsx';
import { BottomSheet } from '../components/BottomSheet';
import { ScrollChipsRow } from '../components/ScrollChipsRow';

type TrainingTab = 'guidance' | 'schedule';
type GuidanceCategory = 'SOP' | 'Checklist' | 'Video' | 'PDF';
type SessionStatus = 'Terjadwal' | 'Hari Ini' | 'Selesai';

type GuidanceItem = {
  id: string;
  title: string;
  category: GuidanceCategory;
  updatedAt: string;
  required?: boolean;
  overview: string;
  attachments: string[];
  relatedTemplates?: string[];
};

type ScheduleItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  trainer: string;
  status: SessionStatus;
};

const guidanceItems: GuidanceItem[] = [
  {
    id: 'g1',
    title: 'SOP PDI Avanza 2024 - Dealer Sunter',
    category: 'SOP',
    updatedAt: 'Diperbarui 20 Feb 2026',
    required: true,
    overview: 'Panduan standar PDI untuk unit delivery, termasuk cek eksterior, interior, mesin, dan dokumen.',
    attachments: ['SOP_PDI_Avanza_2024.pdf', 'Checklist_PDI_Dealer_Sunter.xlsx'],
    relatedTemplates: ['Pre-Delivery Inspection (PDI)', 'Quick Visual Check'],
  },
  {
    id: 'g2',
    title: 'Manual Audit 5R Showroom',
    category: 'PDF',
    updatedAt: 'Diperbarui 16 Feb 2026',
    overview: 'Standar audit kebersihan, kerapian, dan pengelolaan area showroom.',
    attachments: ['Manual_Audit_5R_Showroom.pdf'],
    relatedTemplates: ['Audit 5R Showroom'],
  },
  {
    id: 'g3',
    title: 'Video Penanganan Temuan Kritis',
    category: 'Video',
    updatedAt: 'Diperbarui 10 Feb 2026',
    required: true,
    overview: 'Video training untuk eskalasi temuan kritis dari CRO ke HO beserta upload evidence.',
    attachments: ['video_temuan_kritis.mp4'],
  },
];

const scheduleItems: ScheduleItem[] = [
  {
    id: 's1',
    title: 'Grooming Inspektor Bulanan - Area Jakarta',
    date: 'Senin, 2 Mar 2026 • 09:00',
    location: 'Dealer Sunter (Offline)',
    trainer: 'Arif Nugraha',
    status: 'Hari Ini',
  },
  {
    id: 's2',
    title: 'Refresh SOP PDI Unit Baru',
    date: 'Rabu, 4 Mar 2026 • 14:00',
    location: 'Online (Google Meet)',
    trainer: 'Dina Wicaksana',
    status: 'Terjadwal',
  },
];

// ─── Category styling ──────────────────────────────────────────────────────────

const CATEGORY_ICON: Record<GuidanceCategory, typeof FileText> = {
  SOP: FileText,
  Checklist: CheckSquare,
  Video: PlayCircle,
  PDF: FileText,
};

const CATEGORY_ICON_BG: Record<GuidanceCategory, string> = {
  SOP: 'bg-blue-50 text-primary-blue',
  Checklist: 'bg-neutral-100 text-neutral-500',
  Video: 'bg-amber-50 text-amber-500',
  PDF: 'bg-red-50 text-red-400',
};

const CATEGORY_CHIP: Record<GuidanceCategory, string> = {
  SOP: 'bg-blue-50 text-primary-blue border-blue-100',
  Checklist: 'bg-neutral-100 text-neutral-500 border-neutral-200',
  Video: 'bg-amber-50 text-amber-600 border-amber-100',
  PDF: 'bg-red-50 text-red-500 border-red-100',
};

const SESSION_STATUS_CHIP: Record<SessionStatus, string> = {
  'Hari Ini': 'bg-primary-blue text-white',
  'Terjadwal': 'bg-neutral-100 text-neutral-600',
  'Selesai': 'bg-emerald-50 text-emerald-600',
};

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function Training() {
  const [activeTab, setActiveTab] = useState<TrainingTab>('guidance');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeGuidance, setActiveGuidance] = useState<GuidanceItem | null>(null);
  const [readIds, setReadIds] = useState<string[]>([]);

  const categoryChips = ['Semua', 'SOP', 'Checklist', 'Video', 'PDF'];

  const filteredGuidance = useMemo(() => {
    const keyword = query.toLowerCase();
    return guidanceItems.filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(keyword) || item.overview.toLowerCase().includes(keyword);
      const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory]);

  const filteredSchedule = useMemo(() => {
    const keyword = query.toLowerCase();
    return scheduleItems.filter((item) => {
      if (selectedCategory !== 'Semua' && selectedCategory !== 'SOP') {
        return false;
      }
      return (
        item.title.toLowerCase().includes(keyword) ||
        item.trainer.toLowerCase().includes(keyword) ||
        item.location.toLowerCase().includes(keyword)
      );
    });
  }, [query, selectedCategory]);

  const toggleRead = (id: string) => {
    setReadIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const totalRequired = guidanceItems.filter(i => i.required).length;
  const upcomingCount = scheduleItems.filter(s => s.status !== 'Selesai').length;

  return (
    <div className="bg-neutral-50 min-h-full">

      {/* ── Sticky header: title + tabs + search + chips ── */}
      <div className="sticky top-0 z-20 bg-white border-b border-neutral-200">
        <div className="status-bar-aware px-4 pb-2">
          <h1 className="text-[17px] font-semibold tracking-tight text-neutral-900">Training</h1>
        </div>

        {/* Segmented tabs */}
        <div className="px-4 pb-2">
          <div className="flex rounded-xl p-[3px] h-10 gap-[3px] bg-neutral-100">
            <button
              onClick={() => setActiveTab('guidance')}
              className={clsx(
                'flex-1 rounded-[9px] text-[13px] font-semibold transition-colors',
                activeTab === 'guidance' ? 'bg-primary-blue text-white' : 'text-neutral-500'
              )}
            >
              Guidance
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={clsx(
                'flex-1 rounded-[9px] text-[13px] font-semibold transition-colors',
                activeTab === 'schedule' ? 'bg-primary-blue text-white' : 'text-neutral-500'
              )}
            >
              Schedule
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative px-4 pb-2">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" strokeWidth={1.8} />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={activeTab === 'guidance' ? 'Cari manual/SOP...' : 'Cari jadwal training...'}
            className="w-full h-9 pl-9 pr-9 rounded-xl bg-neutral-100 text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-blue/20"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-7 top-1/2 -translate-y-1/2"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5 text-neutral-400" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Category chips */}
        <ScrollChipsRow
          items={categoryChips}
          activeItem={selectedCategory}
          onSelect={setSelectedCategory}
          ariaLabel="Filter kategori training"
          showEdgeFade
          className="px-4 pb-2"
        />
      </div>

      {/* ── Content ── */}
      <div className="px-4 pt-3 pb-[calc(80px+env(safe-area-inset-bottom,0px))] space-y-3">

        {/* Summary card */}
        <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-blue/10 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-[18px] h-[18px] text-primary-blue" strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-neutral-800">
              {guidanceItems.length} materi tersedia
            </p>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              {totalRequired} wajib dibaca · {upcomingCount} jadwal mendatang
            </p>
          </div>
          <CalendarDays className="w-4 h-4 text-primary-blue/40 flex-shrink-0" strokeWidth={1.8} />
        </div>

        {/* ── Guidance list ── */}
        {activeTab === 'guidance' ? (
          filteredGuidance.length > 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white divide-y divide-neutral-100 overflow-hidden">
              {filteredGuidance.map((item) => {
                const isRead = readIds.includes(item.id);
                const Icon = CATEGORY_ICON[item.category];
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveGuidance(item)}
                    className="w-full text-left px-4 py-3.5 hover:bg-neutral-50 active:bg-neutral-100 transition-colors flex items-center gap-3"
                  >
                    {/* Icon circle */}
                    <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', CATEGORY_ICON_BG[item.category])}>
                      <Icon className="w-4 h-4" strokeWidth={1.8} />
                    </div>

                    {/* Title + date */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {item.required && (
                          <span className="w-1.5 h-1.5 rounded-full bg-danger-red flex-shrink-0" title="Wajib" />
                        )}
                        <p className={clsx(
                          'text-[14px] font-semibold leading-snug line-clamp-1',
                          isRead ? 'text-neutral-400' : 'text-neutral-900'
                        )}>
                          {item.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-[11px] text-neutral-400">{item.updatedAt}</p>
                        {isRead && (
                          <span className="text-[10px] font-semibold px-1.5 py-[1px] rounded-full bg-emerald-50 text-emerald-600">
                            Sudah dibaca
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Single type chip */}
                    <span className={clsx('text-[10px] font-bold px-2 py-[3px] rounded-full border flex-shrink-0', CATEGORY_CHIP[item.category])}>
                      {item.category}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-[13px] text-neutral-400">
              Belum ada panduan yang sesuai filter.
            </div>
          )

        ) : /* ── Schedule list ── */ filteredSchedule.length > 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white divide-y divide-neutral-100 overflow-hidden">
            {filteredSchedule.map((session) => (
              <div key={session.id} className="px-4 py-4">
                {/* Title + status badge */}
                <div className="flex items-start gap-2 mb-2.5">
                  <p className="flex-1 text-[14px] font-semibold text-neutral-900 leading-snug">{session.title}</p>
                  <span className={clsx('text-[10px] font-bold px-2 py-[3px] rounded-full flex-shrink-0 whitespace-nowrap', SESSION_STATUS_CHIP[session.status])}>
                    {session.status}
                  </span>
                </div>

                {/* Meta rows with icons */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" strokeWidth={1.8} />
                    <p className="text-[12px] text-neutral-500">{session.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" strokeWidth={1.8} />
                    <p className="text-[12px] text-neutral-500">{session.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <User2 className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" strokeWidth={1.8} />
                    <p className="text-[12px] text-neutral-500">{session.trainer}</p>
                  </div>
                </div>

                <button
                  className={clsx(
                    'h-8 px-4 rounded-lg text-[12px] font-semibold',
                    session.status === 'Hari Ini'
                      ? 'bg-primary-blue text-white'
                      : 'bg-neutral-100 text-neutral-700'
                  )}
                >
                  {session.status === 'Hari Ini' ? 'Join / Check-in' : 'Lihat Detail'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-[13px] text-neutral-400">
            Belum ada jadwal training grooming minggu ini.
          </div>
        )}
      </div>

      {/* ── Guidance detail sheet ── */}
      <BottomSheet
        isOpen={Boolean(activeGuidance)}
        onClose={() => setActiveGuidance(null)}
        title="Detail Guidance"
        footer={
          activeGuidance ? (
            <button
              onClick={() => toggleRead(activeGuidance.id)}
              className={clsx(
                'w-full h-11 rounded-xl text-[14px] font-semibold',
                readIds.includes(activeGuidance.id)
                  ? 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                  : 'bg-primary-blue text-white'
              )}
            >
              {readIds.includes(activeGuidance.id) ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}
            </button>
          ) : undefined
        }
      >
        {activeGuidance && (
          <div className="space-y-4">
            <section className="rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-3">
              <p className="text-[15px] font-semibold text-neutral-900">{activeGuidance.title}</p>
              <p className="text-[12px] text-neutral-500 mt-1">{activeGuidance.updatedAt}</p>
            </section>

            <section>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide mb-2">Overview</p>
              <p className="text-[13px] text-neutral-700 leading-6">{activeGuidance.overview}</p>
            </section>

            {activeGuidance.attachments.length > 0 && (
              <section>
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide mb-2">Lampiran</p>
                <div className="rounded-xl border border-neutral-200 divide-y divide-neutral-100 overflow-hidden">
                  {activeGuidance.attachments.map((attachment) => (
                    <button
                      key={attachment}
                      className="w-full px-3 py-2.5 text-left bg-white hover:bg-neutral-50 flex items-center gap-2"
                    >
                      {attachment.endsWith('.mp4') ? (
                        <PlayCircle className="w-4 h-4 text-primary-blue flex-shrink-0" strokeWidth={1.8} />
                      ) : (
                        <FileText className="w-4 h-4 text-primary-blue flex-shrink-0" strokeWidth={1.8} />
                      )}
                      <span className="text-[13px] text-neutral-700 truncate">{attachment}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {activeGuidance.relatedTemplates && activeGuidance.relatedTemplates.length > 0 && (
              <section>
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide mb-2">
                  Template Terkait
                </p>
                <div className="rounded-xl border border-neutral-200 divide-y divide-neutral-100 overflow-hidden">
                  {activeGuidance.relatedTemplates.map((template) => (
                    <div key={template} className="px-3 py-2.5 bg-white text-[13px] text-neutral-700">
                      {template}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
