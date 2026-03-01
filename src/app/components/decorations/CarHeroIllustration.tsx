/**
 * CarHeroIllustration — blueprint-style car outline with small checklist
 * and tool decorations. Render at 8–11% opacity on the hero banner.
 * All paths use currentColor; no fills — pure stroke illustration.
 */
interface Props { className?: string }

export function CarHeroIllustration({ className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 320 155"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* ── Small floating checklist (upper-left corner) ────────────────── */}
      {/* Item 1 — checked */}
      <rect x="8" y="14" width="10" height="10" rx="2"
        stroke="currentColor" strokeWidth="1.3" />
      <path d="M10.5 19 L12.5 21 L16.5 16"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="23" y="17" width="20" height="2.5" rx="1.25"
        fill="currentColor" opacity="0.7" />

      {/* Item 2 — checked */}
      <rect x="8" y="30" width="10" height="10" rx="2"
        stroke="currentColor" strokeWidth="1.3" />
      <path d="M10.5 35 L12.5 37 L16.5 32"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="23" y="33" width="16" height="2.5" rx="1.25"
        fill="currentColor" opacity="0.7" />

      {/* Item 3 — pending */}
      <rect x="8" y="46" width="10" height="10" rx="2"
        stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.5" />
      <rect x="23" y="49" width="22" height="2.5" rx="1.25"
        fill="currentColor" opacity="0.4" />

      {/* ── Simple socket / key tool (upper-right) ──────────────────────── */}
      <g transform="translate(291 17) rotate(30)">
        {/* Tool head (hexagonal socket) */}
        <path d="M-6 -4 L-3 -8 L3 -8 L6 -4 L6 4 L3 8 L-3 8 L-6 4 Z"
          stroke="currentColor" strokeWidth="1.2" />
        <circle cx="0" cy="0" r="3"
          stroke="currentColor" strokeWidth="1" />
        {/* Handle */}
        <line x1="0" y1="8" x2="0" y2="24"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* ── Car — blueprint outline ─────────────────────────────────────── */}
      {/* Rear wheel */}
      <circle cx="82"  cy="118" r="24" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="82"  cy="118" r="13" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="82"  cy="118" r="4"  stroke="currentColor" strokeWidth="1"   />

      {/* Front wheel */}
      <circle cx="238" cy="118" r="24" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="238" cy="118" r="13" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="238" cy="118" r="4"  stroke="currentColor" strokeWidth="1"   />

      {/* Underbody / chassis */}
      <path
        d="M34 88 Q34 78 44 78 L276 78 Q286 78 286 88 L286 112 Q286 120 278 120 L42 120 Q34 120 34 112 Z"
        stroke="currentColor" strokeWidth="1.8"
      />

      {/* Cabin / greenhouse */}
      <path
        d="M86 42 Q90 32 100 32 L220 32 Q230 32 234 42 L262 78 L58 78 Z"
        stroke="currentColor" strokeWidth="1.8"
      />

      {/* B-pillar */}
      <line x1="160" y1="32" x2="160" y2="78"
        stroke="currentColor" strokeWidth="1.2" />

      {/* Windshield frame angles */}
      <line x1="100" y1="32" x2="80"  y2="78"
        stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.7" />
      <line x1="220" y1="32" x2="240" y2="78"
        stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.7" />

      {/* Roofline curve */}
      <path d="M100 32 Q160 24 220 32"
        stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />

      {/* Headlight cluster (right / front) */}
      <path d="M280 86 L296 88 L296 100 L280 102"
        stroke="currentColor" strokeWidth="1.2" />
      <line x1="284" y1="94" x2="295" y2="94"
        stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.6" />

      {/* Tail light cluster (left / rear) */}
      <path d="M40 86 L24 88 L24 100 L40 102"
        stroke="currentColor" strokeWidth="1.2" />
      <line x1="36" y1="94" x2="25" y2="94"
        stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.6" />

      {/* Body crease */}
      <path d="M46 104 L274 104"
        stroke="currentColor" strokeWidth="0.9" strokeDasharray="5 8" strokeOpacity="0.65" />

      {/* Door seam */}
      <line x1="160" y1="78" x2="160" y2="120"
        stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.65" />

      {/* Door handles */}
      <rect x="114" y="94" width="22" height="4" rx="2"
        stroke="currentColor" strokeWidth="0.9" />
      <rect x="184" y="94" width="20" height="4" rx="2"
        stroke="currentColor" strokeWidth="0.9" />

      {/* Side mirror */}
      <path d="M280 82 L298 79 L300 88 L282 89 Z"
        stroke="currentColor" strokeWidth="0.9" />

      {/* Wheel arches */}
      <path d="M58 120 Q82 98 106 120"
        stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M214 120 Q238 98 262 120"
        stroke="currentColor" strokeWidth="1.2" fill="none" />

      {/* Front bumper */}
      <path d="M284 106 L298 106 L300 116 L286 118"
        stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.7" />

      {/* Rear bumper */}
      <path d="M36 106 L22 106 L20 116 L34 118"
        stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.7" />
    </svg>
  );
}
