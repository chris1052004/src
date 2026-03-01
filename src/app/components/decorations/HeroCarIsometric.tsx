/**
 * HeroCarIsometric — colored 3/4-view car illustration for the Home hero card.
 * Blue body + red accent stripe + green check badge. Use at opacity-80 or higher.
 */
interface Props { className?: string }

export function HeroCarIsometric({ className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 285 158"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hci-body" x1="142" y1="68" x2="142" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
        <linearGradient id="hci-cabin" x1="142" y1="40" x2="142" y2="68" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="hci-front" x1="249" y1="0" x2="262" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#172554" />
        </linearGradient>
        <radialGradient id="hci-hl" cx="15%" cy="50%" r="100%">
          <stop offset="0%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.4" />
        </radialGradient>
        <radialGradient id="hci-badge-shine" cx="32%" cy="28%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* ── Ground shadow ─────────────────────────────────────────────────── */}
      <ellipse cx="142" cy="151" rx="114" ry="7" fill="rgba(0,0,0,0.40)" />

      {/* ── LOWER BODY ───────────────────────────────────────────────────── */}
      <path
        d="M28 80 Q28 68 38 68 L247 68 Q257 68 257 80 L257 120 Q257 124 251 124 L34 124 Q28 124 28 120 Z"
        fill="url(#hci-body)"
      />

      {/* ── CABIN / GREENHOUSE ───────────────────────────────────────────── */}
      <path
        d="M84 68 L94 44 Q98 40 106 40 L178 40 Q186 40 190 44 L200 68 Z"
        fill="url(#hci-cabin)"
      />

      {/* Roofline highlight */}
      <path
        d="M94 44 Q142 36 190 44"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── SIDE WINDOWS ─────────────────────────────────────────────────── */}
      {/* Rear window */}
      <path
        d="M109 66 L115 48 L154 48 L154 66 Z"
        fill="rgba(147,197,253,0.24)"
        stroke="rgba(147,197,253,0.22)"
        strokeWidth="0.6"
      />
      {/* Front window */}
      <path
        d="M157 66 L157 48 L178 48 L185 66 Z"
        fill="rgba(147,197,253,0.24)"
        stroke="rgba(147,197,253,0.22)"
        strokeWidth="0.6"
      />

      {/* B-pillar */}
      <rect x="153.5" y="40" width="3.5" height="28" fill="rgba(8,14,30,0.80)" />

      {/* Door seam */}
      <line x1="155.5" y1="68" x2="155.5" y2="124" stroke="rgba(0,0,0,0.45)" strokeWidth="1.5" />

      {/* Door handles */}
      <rect x="100" y="94" width="22" height="4" rx="2" fill="rgba(255,255,255,0.22)" />
      <rect x="168" y="94" width="22" height="4" rx="2" fill="rgba(255,255,255,0.22)" />

      {/* ── RED ACCENT STRIPE ─────────────────────────────────────────────── */}
      <rect x="28" y="104" width="229" height="11" fill="#DC2626" />
      {/* Stripe highlight */}
      <rect x="28" y="104" width="229" height="3" fill="rgba(252,165,165,0.22)" />
      {/* Stripe fade at ends */}
      <rect x="28" y="104" width="10" height="11" fill="url(#hci-stripe-l)" opacity="1" />
      <rect x="247" y="104" width="10" height="11" fill="url(#hci-stripe-r)" opacity="1" />

      {/* Body crease line */}
      <path d="M30 104 L256 104" stroke="rgba(0,0,0,0.28)" strokeWidth="0.7" />

      {/* Belt-line gleam */}
      <path d="M38 68 L66 68" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M218 68 L246 68" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" strokeLinecap="round" />

      {/* ── FRONT FACE (3-D depth) ───────────────────────────────────────── */}
      <path
        d="M249 68 Q261 72 261 84 L261 120 Q261 124 257 124 L249 124 Z"
        fill="url(#hci-front)"
      />

      {/* ── REAR FACE (3-D depth) ────────────────────────────────────────── */}
      <path
        d="M36 68 Q24 72 24 84 L24 120 Q24 124 28 124 L36 124 Z"
        fill="#172554"
      />

      {/* ── HEADLIGHT ────────────────────────────────────────────────────── */}
      <path d="M249 72 L261 77 L261 96 L249 100 Z" fill="url(#hci-hl)" />
      <ellipse cx="256" cy="86" rx="3.5" ry="9" fill="rgba(219,234,254,0.55)" />

      {/* ── TAIL LIGHT ───────────────────────────────────────────────────── */}
      <path d="M36 72 L24 77 L24 96 L36 100 Z" fill="#DC2626" />
      <ellipse cx="29" cy="86" rx="3.5" ry="9" fill="rgba(252,165,165,0.42)" />

      {/* ── WHEEL ARCH CUTOUTS (use hero bg color to simulate cutout) ─────── */}
      {/* Rear arch  — peak computed so curve apex is near wheel top */}
      <path d="M50 124 Q72 82 94 124 Z" fill="#0D0F1C" />
      {/* Front arch */}
      <path d="M188 124 Q210 82 232 124 Z" fill="#0D0F1C" />

      {/* ── REAR WHEEL ───────────────────────────────────────────────────── */}
      <circle cx="72" cy="126" r="23" fill="#07101D" />
      <circle cx="72" cy="126" r="17" fill="#0D1828" />
      {/* Spokes */}
      <line x1="72" y1="103" x2="72" y2="117" stroke="rgba(255,255,255,0.17)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="61" y1="107" x2="67" y2="118" stroke="rgba(255,255,255,0.17)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="83" y1="107" x2="77" y2="118" stroke="rgba(255,255,255,0.17)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="72" y1="149" x2="72" y2="135" stroke="rgba(255,255,255,0.17)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="61" y1="145" x2="67" y2="134" stroke="rgba(255,255,255,0.17)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="83" y1="145" x2="77" y2="134" stroke="rgba(255,255,255,0.17)" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="72" cy="126" r="5" fill="#050910" />

      {/* ── FRONT WHEEL ──────────────────────────────────────────────────── */}
      <circle cx="210" cy="126" r="23" fill="#07101D" />
      <circle cx="210" cy="126" r="17" fill="#0D1828" />
      {/* Spokes */}
      <line x1="210" y1="103" x2="210" y2="117" stroke="rgba(255,255,255,0.17)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="199" y1="107" x2="205" y2="118" stroke="rgba(255,255,255,0.17)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="221" y1="107" x2="215" y2="118" stroke="rgba(255,255,255,0.17)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="210" y1="149" x2="210" y2="135" stroke="rgba(255,255,255,0.17)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="199" y1="145" x2="205" y2="134" stroke="rgba(255,255,255,0.17)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="221" y1="145" x2="215" y2="134" stroke="rgba(255,255,255,0.17)" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="210" cy="126" r="5" fill="#050910" />

      {/* ── FLOATING CHECK BADGE (upper-right) ────────────────────────────── */}
      <circle cx="241" cy="26" r="22" fill="rgba(5,150,105,0.16)" />
      <circle cx="241" cy="26" r="17" fill="#059669" />
      <circle cx="241" cy="26" r="17" fill="url(#hci-badge-shine)" />
      <path
        d="M232 26 L238 32 L250 18"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── SPARKLE DOTS ─────────────────────────────────────────────────── */}
      <circle cx="18" cy="30" r="3.5" fill="rgba(59,130,246,0.48)" />
      <circle cx="11" cy="50" r="2.2" fill="rgba(220,38,38,0.55)" />
      <circle cx="13" cy="38" r="1.5" fill="rgba(59,130,246,0.30)" />
      <circle cx="272" cy="55" r="2.5" fill="rgba(59,130,246,0.38)" />
      <circle cx="266" cy="40" r="3" fill="rgba(220,38,38,0.30)" />
      <circle cx="278" cy="70" r="1.5" fill="rgba(147,197,253,0.40)" />

      {/* Stripe fade gradients (defined last so they can reference rects above) */}
      <defs>
        <linearGradient id="hci-stripe-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0D0F1C" />
          <stop offset="100%" stopColor="#0D0F1C" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hci-stripe-r" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0D0F1C" stopOpacity="0" />
          <stop offset="100%" stopColor="#0D0F1C" />
        </linearGradient>
      </defs>
    </svg>
  );
}
