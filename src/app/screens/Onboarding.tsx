import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

const ONBOARDING_KEY = 'onboardingDone';

// ─── Slide illustrations ─────────────────────────────────────────────────────

function IllustrationOne() {
  return (
    <svg viewBox="0 0 320 260" fill="none" className="w-full h-full">
      {/* Phone frame */}
      <rect x="80" y="20" width="160" height="220" rx="22" fill="white" opacity="0.95" />
      <rect x="80" y="20" width="160" height="220" rx="22" stroke="#E2E8F0" strokeWidth="1.5" />
      {/* Notch */}
      <rect x="128" y="24" width="64" height="12" rx="6" fill="#F1F5F9" />
      {/* Header bar */}
      <rect x="92" y="46" width="136" height="28" rx="10" fill="#EFF6FF" />
      <rect x="102" y="53" width="60" height="8" rx="4" fill="#2563EB" opacity="0.8" />
      <circle cx="213" cy="60" r="8" fill="#2563EB" opacity="0.15" />
      <path d="M210 60l2 2 4-4" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Checklist items */}
      <rect x="92" y="82" width="136" height="30" rx="8" fill="#F8FAFC" />
      <circle cx="107" cy="97" r="7" fill="#DCFCE7" />
      <path d="M104 97l2 2 4-4" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="120" y="92" width="70" height="6" rx="3" fill="#1E293B" opacity="0.7" />
      <rect x="120" y="102" width="50" height="5" rx="2.5" fill="#94A3B8" opacity="0.5" />
      <rect x="92" y="118" width="136" height="30" rx="8" fill="#F8FAFC" />
      <circle cx="107" cy="133" r="7" fill="#DCFCE7" />
      <path d="M104 133l2 2 4-4" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="120" y="128" width="55" height="6" rx="3" fill="#1E293B" opacity="0.7" />
      <rect x="120" y="138" width="75" height="5" rx="2.5" fill="#94A3B8" opacity="0.5" />
      <rect x="92" y="154" width="136" height="30" rx="8" fill="#EFF6FF" />
      <circle cx="107" cy="169" r="7" fill="#DBEAFE" />
      <rect x="103" y="167" width="8" height="2" rx="1" fill="#2563EB" />
      <rect x="106" y="164" width="2" height="8" rx="1" fill="#2563EB" />
      <rect x="120" y="164" width="65" height="6" rx="3" fill="#2563EB" opacity="0.5" />
      <rect x="120" y="174" width="45" height="5" rx="2.5" fill="#94A3B8" opacity="0.5" />
      {/* Progress bar */}
      <rect x="92" y="194" width="136" height="6" rx="3" fill="#F1F5F9" />
      <rect x="92" y="194" width="96" height="6" rx="3" fill="#2563EB" />
      <rect x="92" y="206" width="40" height="5" rx="2.5" fill="#94A3B8" opacity="0.4" />
      <rect x="178" y="206" width="50" height="5" rx="2.5" fill="#2563EB" opacity="0.4" />
      {/* Floating badge */}
      <rect x="190" y="58" width="68" height="28" rx="10" fill="#2563EB" />
      <rect x="196" y="65" width="28" height="5" rx="2.5" fill="white" opacity="0.9" />
      <rect x="196" y="74" width="40" height="4" rx="2" fill="white" opacity="0.5" />
      {/* Glow */}
      <ellipse cx="160" cy="255" rx="80" ry="8" fill="#2563EB" opacity="0.08" />
    </svg>
  );
}

function IllustrationTwo() {
  return (
    <svg viewBox="0 0 320 260" fill="none" className="w-full h-full">
      {/* Main card */}
      <rect x="30" y="30" width="200" height="120" rx="18" fill="white" opacity="0.95" />
      <rect x="30" y="30" width="200" height="120" rx="18" stroke="#E2E8F0" strokeWidth="1.5" />
      {/* Red urgent badge */}
      <rect x="44" y="46" width="172" height="26" rx="10" fill="#FEF2F2" />
      <circle cx="58" cy="59" r="7" fill="#DC2626" />
      <path d="M55.5 57.5l5 5M60.5 57.5l-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="72" y="54" width="88" height="6" rx="3" fill="#DC2626" opacity="0.8" />
      <rect x="72" y="63" width="60" height="5" rx="2.5" fill="#DC2626" opacity="0.35" />
      {/* Assignee row */}
      <rect x="44" y="80" width="172" height="22" rx="8" fill="#F8FAFC" />
      <circle cx="56" cy="91" r="6" fill="#DBEAFE" />
      <rect x="68" y="87" width="50" height="5" rx="2.5" fill="#1E293B" opacity="0.6" />
      <rect x="68" y="95" width="35" height="4" rx="2" fill="#94A3B8" opacity="0.4" />
      {/* Calendar row */}
      <rect x="44" y="110" width="172" height="22" rx="8" fill="#F8FAFC" />
      <rect x="50" y="116" width="12" height="12" rx="3" fill="#FEF3C7" />
      <rect x="52" y="113" width="2" height="4" rx="1" fill="#D97706" />
      <rect x="58" y="113" width="2" height="4" rx="1" fill="#D97706" />
      <rect x="68" y="115" width="55" height="5" rx="2.5" fill="#1E293B" opacity="0.6" />
      <rect x="68" y="123" width="40" height="4" rx="2" fill="#D97706" opacity="0.5" />
      {/* Status pills */}
      <rect x="30" y="162" width="90" height="28" rx="10" fill="white" />
      <rect x="30" y="162" width="90" height="28" rx="10" stroke="#E2E8F0" strokeWidth="1.5" />
      <circle cx="46" cy="176" r="4" fill="#D97706" />
      <rect x="56" y="172" width="48" height="5" rx="2.5" fill="#1E293B" opacity="0.6" />
      <rect x="56" y="180" width="32" height="4" rx="2" fill="#94A3B8" opacity="0.4" />
      <rect x="130" y="162" width="90" height="28" rx="10" fill="white" />
      <rect x="130" y="162" width="90" height="28" rx="10" stroke="#E2E8F0" strokeWidth="1.5" />
      <circle cx="146" cy="176" r="4" fill="#2563EB" />
      <rect x="156" y="172" width="48" height="5" rx="2.5" fill="#1E293B" opacity="0.6" />
      <rect x="156" y="180" width="35" height="4" rx="2" fill="#94A3B8" opacity="0.4" />
      {/* Check card */}
      <rect x="230" y="60" width="62" height="62" rx="16" fill="#F0FDF4" />
      <rect x="230" y="60" width="62" height="62" rx="16" stroke="#BBF7D0" strokeWidth="1.5" />
      <circle cx="261" cy="91" r="16" fill="#DCFCE7" />
      <path d="M254 91l5 5 9-9" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Shadow */}
      <ellipse cx="160" cy="255" rx="80" ry="8" fill="#DC2626" opacity="0.07" />
    </svg>
  );
}

function IllustrationThree() {
  return (
    <svg viewBox="0 0 320 260" fill="none" className="w-full h-full">
      {/* Book / module card */}
      <rect x="50" y="25" width="220" height="145" rx="18" fill="white" opacity="0.95" />
      <rect x="50" y="25" width="220" height="145" rx="18" stroke="#E2E8F0" strokeWidth="1.5" />
      {/* Spine strip */}
      <rect x="50" y="25" width="18" height="145" rx="9" fill="#2563EB" />
      {/* Module rows */}
      <rect x="78" y="40" width="180" height="26" rx="8" fill="#EFF6FF" />
      <rect x="86" y="48" width="80" height="7" rx="3.5" fill="#2563EB" opacity="0.75" />
      <rect x="86" y="58" width="55" height="5" rx="2.5" fill="#94A3B8" opacity="0.5" />
      <rect x="234" y="45" width="16" height="16" rx="5" fill="#2563EB" />
      <path d="M238 53l3 3 6-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="78" y="74" width="180" height="26" rx="8" fill="#F8FAFC" />
      <rect x="86" y="82" width="70" height="7" rx="3.5" fill="#1E293B" opacity="0.6" />
      <rect x="86" y="92" width="90" height="5" rx="2.5" fill="#94A3B8" opacity="0.5" />
      <rect x="234" y="79" width="16" height="16" rx="5" fill="#F1F5F9" />
      <rect x="237" y="86" width="10" height="1.5" rx="0.75" fill="#94A3B8" />
      <rect x="237" y="89" width="7" height="1.5" rx="0.75" fill="#94A3B8" />
      <rect x="237" y="92" width="10" height="1.5" rx="0.75" fill="#94A3B8" />
      <rect x="78" y="108" width="180" height="26" rx="8" fill="#F8FAFC" />
      <rect x="86" y="116" width="85" height="7" rx="3.5" fill="#1E293B" opacity="0.6" />
      <rect x="86" y="126" width="60" height="5" rx="2.5" fill="#94A3B8" opacity="0.5" />
      <rect x="234" y="113" width="16" height="16" rx="5" fill="#F1F5F9" />
      <rect x="237" y="120" width="10" height="1.5" rx="0.75" fill="#94A3B8" />
      <rect x="237" y="123" width="7" height="1.5" rx="0.75" fill="#94A3B8" />
      {/* Progress ring */}
      <circle cx="80" cy="205" r="30" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="1.5" />
      <circle cx="80" cy="205" r="22" fill="none" stroke="#E2E8F0" strokeWidth="5" />
      <circle cx="80" cy="205" r="22" fill="none" stroke="#10B981" strokeWidth="5"
        strokeDasharray="100" strokeDashoffset="28" strokeLinecap="round"
        transform="rotate(-90 80 205)" />
      <rect x="72" y="202" width="16" height="6" rx="3" fill="#1E293B" opacity="0.6" />
      {/* Medals */}
      <circle cx="160" cy="205" r="24" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1.5" />
      <path d="M160 193l3 7h7l-6 4.5 2.5 7L160 207l-6.5 4.5 2.5-7-6-4.5h7z" fill="#FBBF24" />
      <circle cx="240" cy="205" r="24" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5" />
      <rect x="229" y="200" width="22" height="10" rx="5" fill="#2563EB" opacity="0.15" />
      <rect x="234" y="202" width="12" height="5" rx="2.5" fill="#2563EB" opacity="0.7" />
      {/* Shadow */}
      <ellipse cx="160" cy="255" rx="80" ry="8" fill="#10B981" opacity="0.08" />
    </svg>
  );
}

// ─── Slide data ───────────────────────────────────────────────────────────────

const SLIDES = [
  {
    bg: 'from-blue-50 via-white to-white',
    accentBg: 'bg-blue-50',
    accentRing: 'ring-blue-100',
    dot: '#2563EB',
    tag: 'INSPEKSI',
    tagColor: 'text-blue-600 bg-blue-100',
    title: 'Checklist Inspeksi\nDigital & Cepat',
    desc: 'Buat dan jalankan template inspeksi kendaraan secara digital. Semua temuan tercatat otomatis, real-time.',
    Illustration: IllustrationOne,
  },
  {
    bg: 'from-red-50 via-white to-white',
    accentBg: 'bg-red-50',
    accentRing: 'ring-red-100',
    dot: '#DC2626',
    tag: 'TINDAKAN',
    tagColor: 'text-red-600 bg-red-100',
    title: 'Temuan Jadi Tindakan\nDalam Hitungan Detik',
    desc: 'Setiap temuan CRO langsung diubah jadi action item dengan assignee, prioritas, dan due date otomatis.',
    Illustration: IllustrationTwo,
  },
  {
    bg: 'from-emerald-50 via-white to-white',
    accentBg: 'bg-emerald-50',
    accentRing: 'ring-emerald-100',
    dot: '#059669',
    tag: 'PELATIHAN',
    tagColor: 'text-emerald-700 bg-emerald-100',
    title: 'SOP & Pelatihan\nSelalu di Genggaman',
    desc: 'Akses modul pelatihan dealer, manual book, dan jadwal training kapan saja dari satu aplikasi.',
    Illustration: IllustrationThree,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Onboarding() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState(0);
  const maxIndex = SLIDES.length - 1;

  const finish = () => {
    localStorage.setItem(ONBOARDING_KEY, '1');
    navigate('/landing', { replace: true });
  };

  const handleNext = () => {
    if (current < maxIndex) {
      scrollRef.current?.scrollTo({
        left: scrollRef.current.clientWidth * (current + 1),
        behavior: 'smooth',
      });
    } else {
      finish();
    }
  };

  const onScroll = () => {
    if (!scrollRef.current) return;
    const idx = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
    setCurrent(idx);
  };

  const slide = SLIDES[current];

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">

      {/* Slides — horizontal scroll */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="flex h-full" style={{ width: `${SLIDES.length * 100}%` }}>
          {SLIDES.map((s, i) => (
            <div
              key={s.tag}
              className="snap-center flex flex-col"
              style={{ width: `${100 / SLIDES.length}%` }}
            >
              {/* Illustration area */}
              <div className={`bg-gradient-to-b ${s.bg} flex items-center justify-center pt-14 pb-4 flex-shrink-0`}
                style={{ height: '52%' }}>
                <div className={`w-[280px] h-[220px] rounded-3xl ${s.accentBg} ring-1 ${s.accentRing} flex items-center justify-center overflow-hidden shadow-sm`}>
                  <s.Illustration />
                </div>
              </div>

              {/* Text area */}
              <div className="flex-1 flex flex-col px-6 pt-6">
                <span className={`self-start text-[10px] font-bold tracking-[0.15em] px-2.5 py-1 rounded-full ${s.tagColor} mb-3`}>
                  {s.tag}
                </span>
                <h2 className="text-[24px] font-bold text-neutral-900 leading-snug whitespace-pre-line">
                  {s.title}
                </h2>
                <p className="mt-3 text-[14px] text-neutral-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex-shrink-0 px-6 pt-4 pb-10" style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 24px, 40px)' }}>
        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {SLIDES.map((s, i) => (
            <motion.div
              key={i}
              animate={{ width: i === current ? 22 : 8, opacity: i === current ? 1 : 0.35 }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              className="h-2 rounded-full"
              style={{ background: s.dot }}
            />
          ))}
        </div>

        {/* Next / Mulai button */}
        <AnimatePresence mode="wait">
          <motion.button
            key={current}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onClick={handleNext}
            className="h-13 w-full rounded-2xl text-white text-[15px] font-semibold shadow-lg active:scale-[0.98] transition-transform"
            style={{ background: slide.dot, boxShadow: `0 4px 16px ${slide.dot}40` }}
          >
            {current === maxIndex ? 'Mulai Sekarang' : 'Lanjut'}
          </motion.button>
        </AnimatePresence>

        {/* Skip */}
        {current < maxIndex && (
          <button
            onClick={finish}
            className="w-full mt-3 h-10 text-[13px] text-neutral-400 font-medium"
          >
            Lewati
          </button>
        )}
      </div>
    </div>
  );
}
