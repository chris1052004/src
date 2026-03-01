import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { isLoggedIn } from '../lib/auth';

// ─── Hero illustration ────────────────────────────────────────────────────────

function HeroIllustration() {
  return (
    <svg viewBox="0 0 320 300" fill="none" className="w-full h-full" aria-hidden>
      {/* Background blobs */}
      <circle cx="160" cy="130" r="100" fill="url(#g1)" opacity="0.18" />
      <circle cx="60"  cy="60"  r="50"  fill="#2563EB" opacity="0.08" />
      <circle cx="270" cy="200" r="55"  fill="#2563EB" opacity="0.07" />

      {/* Central shield */}
      <circle cx="160" cy="130" r="54" fill="white" opacity="0.96" />
      <circle cx="160" cy="130" r="54" stroke="#BFDBFE" strokeWidth="1.5" />
      <path
        d="M160 102c0 0-22 8-22 28v16l22 16 22-16v-16c0-20-22-28-22-28z"
        fill="#2563EB" opacity="0.9"
      />
      <path d="M152 130l6 6 12-12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Floating card — Inspeksi */}
      <g>
        <rect x="8" y="60" width="108" height="52" rx="14" fill="white" />
        <rect x="8" y="60" width="108" height="52" rx="14" stroke="#E2E8F0" strokeWidth="1" />
        <rect x="18" y="70" width="32" height="5" rx="2.5" fill="#2563EB" opacity="0.7" />
        <rect x="18" y="80" width="76" height="5" rx="2.5" fill="#1E293B" opacity="0.55" />
        <rect x="18" y="90" width="55" height="4" rx="2" fill="#94A3B8" opacity="0.45" />
        <circle cx="98" cy="75" r="7" fill="#DCFCE7" />
        <path d="M95 75l2 2 4-4" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Floating card — Action */}
      <g>
        <rect x="204" y="48" width="108" height="52" rx="14" fill="white" />
        <rect x="204" y="48" width="108" height="52" rx="14" stroke="#E2E8F0" strokeWidth="1" />
        <rect x="214" y="58" width="28" height="5" rx="2.5" fill="#DC2626" opacity="0.7" />
        <rect x="214" y="68" width="80" height="5" rx="2.5" fill="#1E293B" opacity="0.55" />
        <rect x="214" y="78" width="60" height="4" rx="2" fill="#94A3B8" opacity="0.45" />
        <circle cx="302" cy="63" r="7" fill="#FEE2E2" />
        <path d="M299 63h6M302 60v6" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Floating card — Training */}
      <g>
        <rect x="80" y="210" width="160" height="52" rx="14" fill="white" />
        <rect x="80" y="210" width="160" height="52" rx="14" stroke="#E2E8F0" strokeWidth="1" />
        <rect x="92" y="220" width="36" height="5" rx="2.5" fill="#059669" opacity="0.7" />
        <rect x="92" y="230" width="110" height="5" rx="2.5" fill="#1E293B" opacity="0.55" />
        <rect x="92" y="240" width="80" height="4" rx="2" fill="#94A3B8" opacity="0.45" />
        <circle cx="226" cy="225" r="7" fill="#D1FAE5" />
        <path d="M222 225l2.5 2.5 5-5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Connecting dots */}
      <circle cx="110" cy="125" r="3" fill="#BFDBFE" />
      <circle cx="210" cy="115" r="3" fill="#BFDBFE" />
      <circle cx="160" cy="200" r="3" fill="#BFDBFE" />
      <line x1="113" y1="125" x2="140" y2="128" stroke="#BFDBFE" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="207" y1="115" x2="182" y2="120" stroke="#BFDBFE" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="160" y1="197" x2="160" y2="180" stroke="#BFDBFE" strokeWidth="1" strokeDasharray="3 3" />

      <defs>
        <radialGradient id="g1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) navigate('/app', { replace: true });
  }, [navigate]);

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">

      {/* ── Hero area ──────────────────────────────────────────── */}
      <div className="relative flex items-center justify-center overflow-hidden flex-shrink-0"
        style={{ height: '52%' }}
      >
        {/* Gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-blue-50/60 to-white" />

        {/* Decorative circles */}
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-primary-blue/6" />
        <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-primary-blue/5" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-[320px] px-4"
          style={{ height: 300 }}
        >
          <HeroIllustration />
        </motion.div>
      </div>

      {/* ── Content area ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col px-6 pt-4 pb-safe overflow-hidden"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 24px, 36px)' }}
      >
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mb-auto"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-primary-blue flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M12 3s-7 2.5-7 9v5l7 5 7-5v-5c0-6.5-7-9-7-9z" fill="white" opacity="0.95" />
                <path d="M9 12l2 2 4-4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[11px] font-bold tracking-[0.12em] text-neutral-400 uppercase">G Tech Solutions</span>
          </div>
          <h1 className="text-[30px] font-bold text-neutral-900 tracking-tight leading-tight">
            G Tech Auditor
          </h1>
          <p className="mt-1.5 text-[14px] text-neutral-500 leading-relaxed">
            Platform inspeksi & audit kendaraan digital untuk dealer Toyota Indonesia.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          className="space-y-3 mt-6"
        >
          <button
            onClick={() => navigate('/login')}
            className="h-13 w-full rounded-2xl bg-primary-blue text-white text-[15px] font-semibold shadow-lg shadow-primary-blue/25 active:scale-[0.98] transition-transform"
          >
            Masuk
          </button>
          <button
            onClick={() => navigate('/login')}
            className="h-13 w-full rounded-2xl border-2 border-primary-blue/20 bg-blue-50 text-primary-blue text-[15px] font-semibold active:scale-[0.98] transition-transform"
          >
            Daftar
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-center text-[11px] text-neutral-400 leading-relaxed"
        >
          Dengan mendaftar, Anda menyetujui{' '}
          <span className="text-primary-blue">Syarat &amp; Ketentuan</span> kami.
        </motion.p>
      </div>
    </div>
  );
}
