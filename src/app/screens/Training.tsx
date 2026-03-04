import { useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, CalendarDays, CheckSquare, CheckCircle2, Circle, FileText, MapPin, PlayCircle, Search, User2, X } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';
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

// ─── Attachment mock content ───────────────────────────────────────────────────

type AttachmentSection =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'checklist'; items: { label: string; done: boolean }[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'video'; title: string; duration: string };

const ATTACHMENT_CONTENT: Record<string, AttachmentSection[]> = {
  'SOP_PDI_Avanza_2024.pdf': [
    { type: 'heading', text: 'SOP PDI Avanza 2024 – Dealer Sunter' },
    { type: 'paragraph', text: 'Dokumen ini mengatur prosedur standar Pre-Delivery Inspection (PDI) untuk unit Avanza yang akan diserahkan kepada konsumen di Dealer Sunter.' },
    { type: 'heading', text: '1. Persiapan Sebelum PDI' },
    { type: 'checklist', items: [
      { label: 'Siapkan unit di area PDI yang bersih & terang', done: false },
      { label: 'Cetak lembar checklist PDI sesuai nomor rangka', done: false },
      { label: 'Pastikan APD teknisi tersedia (sarung tangan, alas kaki)', done: false },
    ]},
    { type: 'heading', text: '2. Pemeriksaan Eksterior' },
    { type: 'checklist', items: [
      { label: 'Cek panel bodi: tidak ada penyok/goresan', done: false },
      { label: 'Periksa kondisi kaca depan & belakang', done: false },
      { label: 'Cek seal pintu & weatherstrip', done: false },
      { label: 'Lampu eksterior: head lamp, fog lamp, lampu sein', done: false },
    ]},
    { type: 'heading', text: '3. Pemeriksaan Interior' },
    { type: 'checklist', items: [
      { label: 'Panel instrumen & cluster menyala normal', done: false },
      { label: 'AC: suhu, blower, dan distribusi udara', done: false },
      { label: 'Sabuk pengaman semua kursi berfungsi', done: false },
      { label: 'Audio, power window, dan central lock', done: false },
    ]},
    { type: 'heading', text: '4. Pemeriksaan Mesin & Cairan' },
    { type: 'checklist', items: [
      { label: 'Level oli mesin, oli rem, dan air radiator', done: false },
      { label: 'Tidak ada kebocoran di bawah kap mesin', done: false },
      { label: 'Aki: tegangan dan kondisi terminal', done: false },
    ]},
    { type: 'heading', text: '5. Test Drive & Serah Terima' },
    { type: 'paragraph', text: 'Test drive dilakukan oleh teknisi PDI sejauh min. 5 km. Setelah lulus semua poin, CRO menandatangani lembar PDI dan menyerahkan kepada SA untuk proses serah terima.' },
  ],
  'Checklist_PDI_Dealer_Sunter.xlsx': [
    { type: 'heading', text: 'Checklist PDI – Dealer Sunter' },
    { type: 'paragraph', text: 'Lembar checklist standar yang diisi saat proses PDI berlangsung. Semua item wajib diisi sebelum unit diserahkan ke konsumen.' },
    { type: 'table', headers: ['No', 'Item Pemeriksaan', 'Standar', 'Status'], rows: [
      ['1', 'Panel bodi eksterior', 'Bebas goresan & penyok', '✓ / ✗'],
      ['2', 'Kaca depan & belakang', 'Tidak retak, tidak baret', '✓ / ✗'],
      ['3', 'Lampu head lamp', 'Menyala, simetris', '✓ / ✗'],
      ['4', 'AC – suhu maksimum', '< 8°C dalam 5 menit', '✓ / ✗'],
      ['5', 'Tekanan ban', '32–35 psi (sesuai spek)', '✓ / ✗'],
      ['6', 'Level oli mesin', 'Di antara MIN–MAX', '✓ / ✗'],
      ['7', 'Sabuk pengaman', 'Semua slot & retrak OK', '✓ / ✗'],
      ['8', 'Audio & infotainment', 'Koneksi Bluetooth & USB', '✓ / ✗'],
      ['9', 'Kebocoran kabin/mesin', 'Tidak ada tetes/rembes', '✓ / ✗'],
      ['10', 'Dokumen BPKB & STNK', 'Sesuai nomor rangka/mesin', '✓ / ✗'],
    ]},
    { type: 'paragraph', text: 'Tanda tangan CRO: ____________   Tanda tangan SA: ____________   Tanggal: ____________' },
  ],
  'Manual_Audit_5R_Showroom.pdf': [
    { type: 'heading', text: 'Manual Audit 5R Showroom' },
    { type: 'paragraph', text: 'Panduan ini digunakan untuk mengaudit penerapan 5R (Ringkas, Rapi, Resik, Rawat, Rajin) di seluruh area showroom dealer.' },
    { type: 'heading', text: 'Ringkas (Seiri) – Pemilahan' },
    { type: 'checklist', items: [
      { label: 'Tidak ada barang tidak terpakai di area display', done: false },
      { label: 'Rak dan meja hanya berisi item yang diperlukan hari ini', done: false },
      { label: 'Area kasir bebas dari dokumen yang sudah kadaluarsa', done: false },
    ]},
    { type: 'heading', text: 'Rapi (Seiton) – Penataan' },
    { type: 'checklist', items: [
      { label: 'Setiap item memiliki tempat yang jelas dan berlabel', done: false },
      { label: 'Dokumen kerja tersusun sesuai urutan & kategori', done: false },
      { label: 'Label box file terpasang dan terbaca jelas', done: false },
    ]},
    { type: 'heading', text: 'Resik (Seiso) – Pembersihan' },
    { type: 'checklist', items: [
      { label: 'Lantai showroom bersih, tidak ada debu & noda', done: false },
      { label: 'Kaca display unit dibersihkan setiap pagi', done: false },
      { label: 'Area toilet dan pantry bersih dan tidak berbau', done: false },
    ]},
    { type: 'heading', text: 'Rawat (Seiketsu) – Pemantapan' },
    { type: 'checklist', items: [
      { label: 'Jadwal pembersihan terpasang dan dipatuhi', done: false },
      { label: 'SOP visual management terpampang di area kerja', done: false },
    ]},
    { type: 'heading', text: 'Rajin (Shitsuke) – Pembiasaan' },
    { type: 'checklist', items: [
      { label: 'Seluruh staf mengetahui dan menerapkan 5R', done: false },
      { label: 'Audit 5R dilaksanakan minimal 1x/bulan', done: false },
    ]},
  ],
  'video_temuan_kritis.mp4': [
    { type: 'video', title: 'Video Training: Penanganan Temuan Kritis', duration: '14:32' },
    { type: 'paragraph', text: 'Video ini menjelaskan alur eskalasi temuan kritis dari CRO ke HO beserta cara upload evidence yang benar di aplikasi.' },
    { type: 'heading', text: 'Poin Utama Video' },
    { type: 'checklist', items: [
      { label: 'Definisi "temuan kritis" dan contoh kasus nyata', done: false },
      { label: 'Alur pelaporan: CRO → Supervisor → HO', done: false },
      { label: 'Cara mengambil foto evidence yang valid', done: false },
      { label: 'Upload evidence via aplikasi inspeksi (demo langkah demi langkah)', done: false },
      { label: 'SLA penanganan: temuan kritis wajib ditutup dalam 48 jam', done: false },
    ]},
  ],
};

// ─── AttachmentViewerSheet ──────────────────────────────────────────────────────

function AttachmentViewerSheet({
  filename,
  onClose,
}: {
  filename: string | null;
  onClose: () => void;
}) {
  const isOpen = filename !== null;
  const sections = filename ? ATTACHMENT_CONTENT[filename] ?? [] : [];
  const isVideo = filename?.endsWith('.mp4');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (key: string) =>
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="av-bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-black/50"
            onClick={onClose}
          />
          <motion.div
            key="av-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-[75] max-w-[480px] mx-auto rounded-t-[28px] bg-card shadow-[0_-8px_48px_rgba(0,0,0,0.20)] dark:shadow-[0_-8px_48px_rgba(0,0,0,0.6)]"
            style={{
              maxHeight: 'calc(100% - 48px)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-9 h-1 rounded-full bg-divider" />
            </div>

            {/* Header */}
            <div className="px-4 py-3 flex items-center gap-3 border-b border-divider/50 flex-shrink-0">
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0"
                aria-label="Kembali"
              >
                <ArrowLeft className="w-4 h-4 text-foreground" strokeWidth={2.2} />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-foreground truncate">{filename}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {isVideo ? 'Video Training' : 'Dokumen'}
                </p>
              </div>
              {isVideo ? (
                <PlayCircle className="w-5 h-5 text-amber-500 flex-shrink-0" strokeWidth={1.8} />
              ) : (
                <FileText className="w-5 h-5 text-primary-blue flex-shrink-0" strokeWidth={1.8} />
              )}
            </div>

            {/* Content */}
            <div
              className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4 space-y-4"
              style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 32px)' }}
            >
              {sections.map((sec, i) => {
                if (sec.type === 'heading') {
                  return (
                    <p key={i} className="text-[14px] font-bold text-foreground pt-1">{sec.text}</p>
                  );
                }
                if (sec.type === 'paragraph') {
                  return (
                    <p key={i} className="text-[13px] text-muted-foreground leading-relaxed">{sec.text}</p>
                  );
                }
                if (sec.type === 'checklist') {
                  return (
                    <div key={i} className="space-y-2">
                      {sec.items.map((item, j) => {
                        const key = `${i}-${j}`;
                        const checked = checkedItems[key] ?? item.done;
                        return (
                          <button
                            key={j}
                            onClick={() => toggleCheck(key)}
                            className="w-full flex items-center gap-3 text-left"
                          >
                            {checked ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" strokeWidth={2} />
                            ) : (
                              <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" strokeWidth={2} />
                            )}
                            <span
                              className={clsx(
                                'text-[13px] leading-snug',
                                checked ? 'text-muted-foreground line-through' : 'text-foreground'
                              )}
                            >
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  );
                }
                if (sec.type === 'table') {
                  return (
                    <div key={i} className="rounded-xl overflow-hidden border border-divider">
                      {/* Header row */}
                      <div className="grid bg-surface border-b border-divider" style={{ gridTemplateColumns: `repeat(${sec.headers.length}, 1fr)` }}>
                        {sec.headers.map((h, hi) => (
                          <div key={hi} className="px-2 py-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground border-r border-divider last:border-r-0">
                            {h}
                          </div>
                        ))}
                      </div>
                      {/* Data rows */}
                      {sec.rows.map((row, ri) => (
                        <div
                          key={ri}
                          className="grid border-b border-divider/50 last:border-b-0"
                          style={{ gridTemplateColumns: `repeat(${sec.headers.length}, 1fr)` }}
                        >
                          {row.map((cell, ci) => (
                            <div key={ci} className="px-2 py-2.5 text-[11px] text-foreground border-r border-divider/50 last:border-r-0 leading-snug">
                              {cell}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  );
                }
                if (sec.type === 'video') {
                  return (
                    <div key={i} className="rounded-2xl overflow-hidden bg-neutral-900 aspect-video flex flex-col items-center justify-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                        <PlayCircle className="w-8 h-8 text-white" strokeWidth={1.5} />
                      </div>
                      <p className="text-[13px] font-semibold text-white px-4 text-center">{sec.title}</p>
                      <p className="text-[11px] text-white/60">{sec.duration}</p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Category styling ──────────────────────────────────────────────────────────

const CATEGORY_ICON: Record<GuidanceCategory, typeof FileText> = {
  SOP: FileText,
  Checklist: CheckSquare,
  Video: PlayCircle,
  PDF: FileText,
};

const CATEGORY_ICON_BG: Record<GuidanceCategory, string> = {
  SOP: 'bg-blue-500/10 text-primary-blue',
  Checklist: 'bg-secondary text-muted-foreground',
  Video: 'bg-amber-500/10 text-amber-500',
  PDF: 'bg-red-500/10 text-red-400',
};

const CATEGORY_CHIP: Record<GuidanceCategory, string> = {
  SOP: 'bg-blue-50 dark:bg-blue-500/15 text-primary-blue border-blue-100 dark:border-blue-500/20',
  Checklist: 'bg-secondary text-muted-foreground border-divider',
  Video: 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20',
  PDF: 'bg-red-50 dark:bg-red-500/15 text-red-500 dark:text-red-400 border-red-100 dark:border-red-500/20',
};

const SESSION_STATUS_CHIP: Record<SessionStatus, string> = {
  'Hari Ini': 'bg-primary-blue text-white',
  'Terjadwal': 'bg-secondary text-muted-foreground',
  'Selesai': 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
};

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function Training() {
  const [activeTab, setActiveTab] = useState<TrainingTab>('guidance');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeGuidance, setActiveGuidance] = useState<GuidanceItem | null>(null);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [activeAttachment, setActiveAttachment] = useState<string | null>(null);

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
    <div className="bg-surface min-h-full">

      {/* ── Sticky header: title + tabs + search + chips ── */}
      <div className="sticky top-0 z-20 bg-card border-b border-divider">
        <div className="status-bar-aware px-4 pb-2">
          <h1 className="text-[17px] font-semibold tracking-tight text-foreground">Training</h1>
        </div>

        {/* Segmented tabs */}
        <div className="px-4 pb-2">
          <div className="flex rounded-xl p-[3px] h-10 gap-[3px] bg-secondary">
            <button
              onClick={() => setActiveTab('guidance')}
              className={clsx(
                'flex-1 rounded-[9px] text-[13px] font-semibold transition-colors',
                activeTab === 'guidance' ? 'bg-primary-blue text-white' : 'text-muted-foreground'
              )}
            >
              Guidance
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={clsx(
                'flex-1 rounded-[9px] text-[13px] font-semibold transition-colors',
                activeTab === 'schedule' ? 'bg-primary-blue text-white' : 'text-muted-foreground'
              )}
            >
              Schedule
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative px-4 pb-2">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" strokeWidth={1.8} />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={activeTab === 'guidance' ? 'Cari manual/SOP...' : 'Cari jadwal training...'}
            className="w-full h-9 pl-9 pr-9 rounded-xl bg-secondary text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-blue/20"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-7 top-1/2 -translate-y-1/2"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2} />
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
        <div className="rounded-xl bg-primary-blue/5 border border-primary-blue/20 px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-blue/10 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-[18px] h-[18px] text-primary-blue" strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-foreground">
              {guidanceItems.length} materi tersedia
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {totalRequired} wajib dibaca · {upcomingCount} jadwal mendatang
            </p>
          </div>
          <CalendarDays className="w-4 h-4 text-primary-blue/40 flex-shrink-0" strokeWidth={1.8} />
        </div>

        {/* ── Guidance list ── */}
        {activeTab === 'guidance' ? (
          filteredGuidance.length > 0 ? (
            <div className="rounded-2xl border border-divider bg-card divide-y divide-divider/50 overflow-hidden">
              {filteredGuidance.map((item) => {
                const isRead = readIds.includes(item.id);
                const Icon = CATEGORY_ICON[item.category];
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveGuidance(item)}
                    className="w-full text-left px-4 py-3.5 hover:bg-surface active:bg-secondary transition-colors flex items-center gap-3"
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
                          isRead ? 'text-muted-foreground' : 'text-foreground'
                        )}>
                          {item.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-[11px] text-muted-foreground">{item.updatedAt}</p>
                        {isRead && (
                          <span className="text-[10px] font-semibold px-1.5 py-[1px] rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
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
            <div className="py-16 text-center text-[13px] text-muted-foreground">
              Belum ada panduan yang sesuai filter.
            </div>
          )

        ) : /* ── Schedule list ── */ filteredSchedule.length > 0 ? (
          <div className="rounded-2xl border border-divider bg-card divide-y divide-divider/50 overflow-hidden">
            {filteredSchedule.map((session) => (
              <div key={session.id} className="px-4 py-4">
                {/* Title + status badge */}
                <div className="flex items-start gap-2 mb-2.5">
                  <p className="flex-1 text-[14px] font-semibold text-foreground leading-snug">{session.title}</p>
                  <span className={clsx('text-[10px] font-bold px-2 py-[3px] rounded-full flex-shrink-0 whitespace-nowrap', SESSION_STATUS_CHIP[session.status])}>
                    {session.status}
                  </span>
                </div>

                {/* Meta rows with icons */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" strokeWidth={1.8} />
                    <p className="text-[12px] text-muted-foreground">{session.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" strokeWidth={1.8} />
                    <p className="text-[12px] text-muted-foreground">{session.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <User2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" strokeWidth={1.8} />
                    <p className="text-[12px] text-muted-foreground">{session.trainer}</p>
                  </div>
                </div>

                <button
                  className={clsx(
                    'h-8 px-4 rounded-lg text-[12px] font-semibold',
                    session.status === 'Hari Ini'
                      ? 'bg-primary-blue text-white'
                      : 'bg-secondary text-foreground'
                  )}
                >
                  {session.status === 'Hari Ini' ? 'Join / Check-in' : 'Lihat Detail'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-[13px] text-muted-foreground">
            Belum ada jadwal training grooming minggu ini.
          </div>
        )}
      </div>

      {/* ── Attachment viewer ── */}
      <AttachmentViewerSheet
        filename={activeAttachment}
        onClose={() => setActiveAttachment(null)}
      />

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
                  ? 'bg-secondary text-foreground border border-divider'
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
            <section className="rounded-xl border border-divider/50 bg-surface px-3 py-3">
              <p className="text-[15px] font-semibold text-foreground">{activeGuidance.title}</p>
              <p className="text-[12px] text-muted-foreground mt-1">{activeGuidance.updatedAt}</p>
            </section>

            <section>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Overview</p>
              <p className="text-[13px] text-foreground leading-6">{activeGuidance.overview}</p>
            </section>

            {activeGuidance.attachments.length > 0 && (
              <section>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Lampiran</p>
                <div className="rounded-xl border border-divider divide-y divide-divider/50 overflow-hidden">
                  {activeGuidance.attachments.map((attachment) => (
                    <button
                      key={attachment}
                      onClick={() => setActiveAttachment(attachment)}
                      className="w-full px-3 py-2.5 text-left bg-card hover:bg-surface active:bg-secondary flex items-center gap-2 transition-colors"
                    >
                      {attachment.endsWith('.mp4') ? (
                        <PlayCircle className="w-4 h-4 text-amber-500 flex-shrink-0" strokeWidth={1.8} />
                      ) : (
                        <FileText className="w-4 h-4 text-primary-blue flex-shrink-0" strokeWidth={1.8} />
                      )}
                      <span className="flex-1 text-[13px] text-foreground truncate">{attachment}</span>
                      <svg className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.8">
                        <path d="M4.5 2.5L8 6L4.5 9.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {activeGuidance.relatedTemplates && activeGuidance.relatedTemplates.length > 0 && (
              <section>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Template Terkait
                </p>
                <div className="rounded-xl border border-divider divide-y divide-divider/50 overflow-hidden">
                  {activeGuidance.relatedTemplates.map((template) => (
                    <div key={template} className="px-3 py-2.5 bg-card text-[13px] text-foreground">
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
