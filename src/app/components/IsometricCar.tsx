// Inspector illustrations for G Tech Auditor

interface IsometricCarProps {
  className?: string;
}

export function IsometricCar({ className = '' }: IsometricCarProps) {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Car shadow */}
      <ellipse cx="100" cy="135" rx="55" ry="6" fill="currentColor" opacity="0.08">
        <animate attributeName="rx" values="55;50;55" dur="3s" repeatCount="indefinite" />
      </ellipse>
      
      {/* Car body */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="3s" repeatCount="indefinite" />
        
        {/* Underbody */}
        <rect x="55" y="105" width="90" height="8" rx="4" fill="#1E3A5F" opacity="0.6" />
        
        {/* Main body */}
        <path
          d="M52 78 Q52 72 58 72 L142 72 Q148 72 148 78 L148 105 Q148 110 143 110 L57 110 Q52 110 52 105 Z"
          fill="url(#carBody)"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity="0.95"
        />
        
        {/* Hood line */}
        <path d="M52 90 L148 90" stroke="currentColor" strokeWidth="0.4" opacity="0.15" />
        
        {/* Cabin / roof */}
        <path
          d="M72 48 Q74 42 80 42 L120 42 Q126 42 128 48 L134 68 Q135 72 131 72 L69 72 Q65 72 66 68 Z"
          fill="url(#carCabin)"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity="0.95"
        />
        
        {/* Front windshield */}
        <path
          d="M126 48 L132 68 Q133 71 130 71 L108 71 L112 48 Z"
          fill="#93C5FD"
          opacity="0.35"
        />
        
        {/* Rear windshield */}
        <path
          d="M74 48 L68 68 Q67 71 70 71 L92 71 L88 48 Z"
          fill="#93C5FD"
          opacity="0.3"
        />
        
        {/* Window divider */}
        <path d="M100 46 L100 71" stroke="currentColor" strokeWidth="1.2" opacity="0.25" />
        
        {/* Side mirror front */}
        <ellipse cx="148" cy="80" rx="4" ry="2.5" fill="#60A5FA" opacity="0.6" />
        
        {/* Front bumper detail */}
        <rect x="140" y="88" width="8" height="3" rx="1.5" fill="#FCD34D" opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
        </rect>
        
        {/* Rear light */}
        <rect x="52" y="88" width="6" height="3" rx="1.5" fill="#EF4444" opacity="0.6" />
        
        {/* Grille lines */}
        <g stroke="currentColor" strokeWidth="0.3" opacity="0.2">
          <line x1="142" y1="76" x2="148" y2="76" />
          <line x1="142" y1="79" x2="148" y2="79" />
          <line x1="142" y1="82" x2="148" y2="82" />
        </g>
        
        {/* Door handle */}
        <rect x="104" y="82" width="8" height="1.5" rx="0.75" fill="currentColor" opacity="0.15" />
        
        {/* Body trim line */}
        <path d="M58 95 L142 95" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      </g>
      
      {/* Wheels */}
      <g>
        {/* Front wheel */}
        <circle cx="125" cy="113" r="13" fill="#1F2937" stroke="#374151" strokeWidth="2" />
        <circle cx="125" cy="113" r="8" fill="#374151" />
        <circle cx="125" cy="113" r="3" fill="#6B7280" />
        {/* Wheel spokes */}
        <g stroke="#6B7280" strokeWidth="0.8" opacity="0.5">
          <animateTransform attributeName="transform" type="rotate" from="0 125 113" to="360 125 113" dur="4s" repeatCount="indefinite" />
          <line x1="125" y1="106" x2="125" y2="108" />
          <line x1="131" y1="109" x2="129.5" y2="110.5" />
          <line x1="132" y1="113" x2="130" y2="113" />
          <line x1="131" y1="117" x2="129.5" y2="115.5" />
          <line x1="125" y1="120" x2="125" y2="118" />
          <line x1="119" y1="117" x2="120.5" y2="115.5" />
          <line x1="118" y1="113" x2="120" y2="113" />
          <line x1="119" y1="109" x2="120.5" y2="110.5" />
        </g>
        
        {/* Rear wheel */}
        <circle cx="75" cy="113" r="13" fill="#1F2937" stroke="#374151" strokeWidth="2" />
        <circle cx="75" cy="113" r="8" fill="#374151" />
        <circle cx="75" cy="113" r="3" fill="#6B7280" />
        <g stroke="#6B7280" strokeWidth="0.8" opacity="0.5">
          <animateTransform attributeName="transform" type="rotate" from="0 75 113" to="360 75 113" dur="4s" repeatCount="indefinite" />
          <line x1="75" y1="106" x2="75" y2="108" />
          <line x1="81" y1="109" x2="79.5" y2="110.5" />
          <line x1="82" y1="113" x2="80" y2="113" />
          <line x1="81" y1="117" x2="79.5" y2="115.5" />
          <line x1="75" y1="120" x2="75" y2="118" />
          <line x1="69" y1="117" x2="70.5" y2="115.5" />
          <line x1="68" y1="113" x2="70" y2="113" />
          <line x1="69" y1="109" x2="70.5" y2="110.5" />
        </g>
      </g>
      
      <defs>
        <linearGradient id="carBody" x1="52" y1="72" x2="148" y2="110">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="carCabin" x1="66" y1="42" x2="134" y2="72">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function IsometricChecklistScene({ className = '' }: IsometricCarProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shadow */}
      <ellipse cx="60" cy="108" rx="28" ry="4" fill="currentColor" opacity="0.06" />
      
      {/* Clipboard board */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0" dur="4s" repeatCount="indefinite" />
        
        <rect
          x="35" y="28" width="50" height="70" rx="4"
          fill="url(#cbGrad)" stroke="currentColor" strokeWidth="1"
        />
        
        {/* Paper inner */}
        <rect x="39" y="36" width="42" height="58" rx="2" fill="white" opacity="0.05" />
        
        {/* Clipboard clip */}
        <rect x="50" y="23" width="20" height="10" rx="3" fill="#4B5563" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="60" cy="28" r="2" fill="#9CA3AF" />
        
        {/* Check item 1 */}
        <g opacity="1">
          <rect x="43" y="42" width="12" height="12" rx="3" fill="#10B981" opacity="0.15" />
          <polyline points="46,48 49,51 55,45" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <animate attributeName="stroke-dasharray" values="0 20;20 0" dur="0.5s" begin="0.5s" fill="freeze" />
          </polyline>
          <rect x="59" y="46" width="16" height="3" rx="1.5" fill="currentColor" opacity="0.12" />
        </g>
        
        {/* Check item 2 */}
        <g opacity="1">
          <rect x="43" y="58" width="12" height="12" rx="3" fill="#10B981" opacity="0.15" />
          <polyline points="46,64 49,67 55,61" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <animate attributeName="stroke-dasharray" values="0 20;20 0" dur="0.5s" begin="1s" fill="freeze" />
          </polyline>
          <rect x="59" y="62" width="12" height="3" rx="1.5" fill="currentColor" opacity="0.12" />
        </g>
        
        {/* Check item 3 - pending */}
        <g opacity="0.5">
          <rect x="43" y="74" width="12" height="12" rx="3" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
          <rect x="59" y="78" width="18" height="3" rx="1.5" fill="currentColor" opacity="0.08" />
        </g>
      </g>
      
      {/* Pencil decoration */}
      <g transform="translate(82, 55) rotate(20)">
        <animateTransform attributeName="transform" type="translate" values="82,55;84,53;82,55" dur="3s" repeatCount="indefinite" />
        <rect x="-2" y="-12" width="4" height="18" rx="1" fill="#F59E0B" />
        <polygon points="-2,6 2,6 0,10" fill="#FCD34D" />
        <rect x="-2" y="-12" width="4" height="3" rx="1" fill="#D97706" />
      </g>
      
      <defs>
        <linearGradient id="cbGrad" x1="35" y1="28" x2="85" y2="98">
          <stop offset="0%" stopColor="#E5E7EB" />
          <stop offset="100%" stopColor="#D1D5DB" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function IsometricRoadScene({ className = '' }: IsometricCarProps) {
  return (
    <svg
      viewBox="0 0 260 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Subtle grid */}
      <g stroke="currentColor" strokeWidth="0.3" opacity="0.04">
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 30} x2="260" y2={i * 30} />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 30 + 10} y1="0" x2={i * 30 + 10} y2="200" />
        ))}
      </g>
      
      {/* Road */}
      <path d="M10 130 Q130 125 250 130 L240 175 Q130 170 20 175 Z" fill="#1F2937" opacity="0.7" />
      
      {/* Road center line */}
      <g fill="#FCD34D" opacity="0.4">
        <rect x="45" y="148" width="18" height="2.5" rx="1.25" />
        <rect x="80" y="147" width="18" height="2.5" rx="1.25" />
        <rect x="115" y="146" width="18" height="2.5" rx="1.25" />
        <rect x="150" y="147" width="18" height="2.5" rx="1.25" />
        <rect x="185" y="148" width="18" height="2.5" rx="1.25" />
      </g>
      
      {/* Animated car on road */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="-40,0;300,0" dur="6s" repeatCount="indefinite" />
        {/* Small car silhouette */}
        <g transform="translate(0, 120)">
          <ellipse cx="18" cy="32" rx="14" ry="2" fill="currentColor" opacity="0.06" />
          <path d="M5 20 L31 20 Q34 20 34 23 L34 28 Q34 30 32 30 L4 30 Q2 30 2 28 L2 23 Q2 20 5 20 Z" fill="#2563EB" />
          <path d="M9 14 Q10 11 13 11 L23 11 Q26 11 27 14 L30 19 L6 19 Z" fill="#3B82F6" />
          <circle cx="10" cy="30" r="4" fill="#1F2937" />
          <circle cx="26" cy="30" r="4" fill="#1F2937" />
          <circle cx="10" cy="30" r="2" fill="#374151" />
          <circle cx="26" cy="30" r="2" fill="#374151" />
          <rect x="31" y="22" width="3" height="2" rx="1" fill="#FCD34D" opacity="0.8" />
        </g>
      </g>
      
      {/* Traffic cone left */}
      <g transform="translate(35, 130)">
        <path d="M0 28 L6 8 L12 28 Z" fill="#F97316" opacity="0.8" />
        <rect x="1" y="18" width="10" height="2" rx="1" fill="white" opacity="0.6" />
        <rect x="-1" y="26" width="14" height="3" rx="1.5" fill="#EA580C" opacity="0.7" />
      </g>
      
      {/* Traffic cone right */}
      <g transform="translate(205, 130)">
        <path d="M0 28 L6 8 L12 28 Z" fill="#F97316" opacity="0.8" />
        <rect x="1" y="18" width="10" height="2" rx="1" fill="white" opacity="0.6" />
        <rect x="-1" y="26" width="14" height="3" rx="1.5" fill="#EA580C" opacity="0.7" />
      </g>
      
      {/* Main parked car (detailed) */}
      <g transform="translate(95, 58)">
        <animateTransform attributeName="transform" type="translate" values="95,58;95,55;95,58" dur="4s" repeatCount="indefinite" />
        
        {/* Shadow */}
        <ellipse cx="35" cy="72" rx="28" ry="4" fill="currentColor" opacity="0.06" />
        
        {/* Body */}
        <path
          d="M5 40 Q5 36 9 36 L61 36 Q65 36 65 40 L65 58 Q65 62 61 62 L9 62 Q5 62 5 58 Z"
          fill="url(#mainCarG)" stroke="currentColor" strokeWidth="0.6"
        />
        
        {/* Cabin */}
        <path
          d="M16 24 Q18 18 22 18 L48 18 Q52 18 54 24 L59 35 Q60 37 58 37 L12 37 Q10 37 11 35 Z"
          fill="url(#mainCabG)" stroke="currentColor" strokeWidth="0.6"
        />
        
        {/* Windows */}
        <path d="M52 24 L57 35 L42 35 L44 20 Z" fill="#93C5FD" opacity="0.3" />
        <path d="M18 24 L13 35 L28 35 L26 20 Z" fill="#93C5FD" opacity="0.25" />
        <path d="M35 20 L35 35" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
        
        {/* Headlights */}
        <rect x="61" y="42" width="4" height="3" rx="1.5" fill="#FCD34D" opacity="0.8">
          <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
        </rect>
        
        {/* Tail lights */}
        <rect x="5" y="42" width="3" height="3" rx="1.5" fill="#EF4444" opacity="0.5" />
        
        {/* Wheels */}
        <circle cx="20" cy="62" r="7" fill="#1F2937" stroke="#374151" strokeWidth="1.5" />
        <circle cx="20" cy="62" r="3.5" fill="#374151" />
        <circle cx="50" cy="62" r="7" fill="#1F2937" stroke="#374151" strokeWidth="1.5" />
        <circle cx="50" cy="62" r="3.5" fill="#374151" />
        
        {/* Wheel rotation */}
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0 20 62" to="360 20 62" dur="6s" repeatCount="indefinite" />
          <line x1="20" y1="56" x2="20" y2="58" stroke="#6B7280" strokeWidth="0.5" />
          <line x1="25" y1="60" x2="23.5" y2="61" stroke="#6B7280" strokeWidth="0.5" />
          <line x1="25" y1="64" x2="23.5" y2="63" stroke="#6B7280" strokeWidth="0.5" />
          <line x1="20" y1="68" x2="20" y2="66" stroke="#6B7280" strokeWidth="0.5" />
          <line x1="15" y1="64" x2="16.5" y2="63" stroke="#6B7280" strokeWidth="0.5" />
          <line x1="15" y1="60" x2="16.5" y2="61" stroke="#6B7280" strokeWidth="0.5" />
        </g>
      </g>
      
      {/* Magnifying glass / inspection icon */}
      <g transform="translate(175, 40)">
        <animateTransform attributeName="transform" type="translate" values="175,40;177,38;175,40" dur="3s" repeatCount="indefinite" />
        <circle cx="12" cy="12" r="10" fill="none" stroke="#3B82F6" strokeWidth="2" opacity="0.5" />
        <circle cx="12" cy="12" r="6" fill="#3B82F6" opacity="0.1" />
        <line x1="20" y1="20" x2="28" y2="28" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
        {/* Checkmark inside */}
        <polyline points="8,12 11,15 17,9" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      </g>
      
      <defs>
        <linearGradient id="mainCarG" x1="5" y1="36" x2="65" y2="62">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="mainCabG" x1="10" y1="18" x2="60" y2="37">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Animated gauge/speedometer for hero
export function AnimatedGauge({ className = '', value = 72 }: { className?: string; value?: number }) {
  const radius = 40;
  const circumference = Math.PI * radius; // semi-circle
  const dashOffset = circumference - (value / 100) * circumference;
  
  return (
    <svg viewBox="0 0 100 60" className={className} fill="none">
      {/* Background arc */}
      <path
        d="M10 55 A40 40 0 0 1 90 55"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.1"
      />
      {/* Filled arc */}
      <path
        d="M10 55 A40 40 0 0 1 90 55"
        stroke="url(#gaugeGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${circumference}`}
        strokeDashoffset={dashOffset}
      >
        <animate
          attributeName="stroke-dashoffset"
          from={circumference}
          to={dashOffset}
          dur="1.5s"
          fill="freeze"
          calcMode="spline"
          keySplines="0.25 0.1 0.25 1"
          keyTimes="0;1"
        />
      </path>
      {/* Center value */}
      <text x="50" y="48" textAnchor="middle" fill="currentColor" fontSize="14" fontFamily="Poppins" fontWeight="600">
        {value}%
      </text>
      <text x="50" y="58" textAnchor="middle" fill="currentColor" fontSize="5" opacity="0.5" fontFamily="Poppins">
        completion
      </text>
      <defs>
        <linearGradient id="gaugeGrad" x1="10" y1="55" x2="90" y2="55">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Animated wrench + gear for settings/actions
export function AnimatedToolsIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      {/* Gear */}
      <g transform="translate(28, 20)">
        <animateTransform attributeName="transform" type="rotate" from="0 28 20" to="360 28 20" dur="8s" repeatCount="indefinite" />
        <path
          d="M0 -10 L2 -7 L6 -8 L8 -5 L6 -2 L8 1 L5 3 L5 7 L2 7 L0 10 L-2 7 L-5 7 L-5 3 L-8 1 L-6 -2 L-8 -5 L-6 -8 L-2 -7 Z"
          fill="#6B7280"
          opacity="0.4"
          transform="translate(28, 20)"
        />
        <circle cx="28" cy="20" r="4" fill="#374151" opacity="0.5" />
      </g>
      
      {/* Wrench */}
      <path
        d="M8 38 L22 24 Q24 22 26 24 L28 26 Q30 28 28 30 L14 44"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

// ─── Inspector Hero Character ───────────────────────────────────────────────
// A stylized 3D-ish inspector character for the Home dashboard hero.
export function InspectorHeroCharacter({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="vestG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="shirtG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="helmetG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="tabletG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#0f1f3a" />
        </linearGradient>
        <linearGradient id="screenG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.4" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.25" />
        </filter>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Floating animation wrapper ── */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,-7; 0,0"
          dur="3.5s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95"
        />

        {/* ── Shadow on ground ── */}
        <ellipse cx="80" cy="215" rx="36" ry="5" fill="#000" opacity="0.15">
          <animate attributeName="rx" values="36;30;36" dur="3.5s" repeatCount="indefinite"
            calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95" />
          <animate attributeName="opacity" values="0.15;0.08;0.15" dur="3.5s" repeatCount="indefinite"
            calcMode="spline" keySplines="0.45 0.05 0.55 0.95; 0.45 0.05 0.55 0.95" />
        </ellipse>

        {/* ── Legs ── */}
        {/* Left leg */}
        <rect x="62" y="162" width="18" height="44" rx="9" fill="#1E3A5F" filter="url(#shadow)" />
        {/* Right leg */}
        <rect x="82" y="162" width="18" height="44" rx="9" fill="#1E3A5F" filter="url(#shadow)" />
        {/* Boots */}
        <rect x="59" y="196" width="22" height="12" rx="6" fill="#111827" />
        <rect x="80" y="196" width="22" height="12" rx="6" fill="#111827" />

        {/* ── Body / Shirt ── */}
        <rect x="52" y="108" width="56" height="60" rx="14" fill="url(#shirtG)" filter="url(#shadow)" />

        {/* ── Safety Vest ── */}
        {/* Left panel */}
        <path d="M52 112 L52 165 Q62 168 68 164 L68 112 Z" fill="url(#vestG)" opacity="0.92" />
        {/* Right panel */}
        <path d="M108 112 L108 165 Q98 168 92 164 L92 112 Z" fill="url(#vestG)" opacity="0.92" />
        {/* Reflective strip left */}
        <rect x="52" y="138" width="16" height="4" rx="2" fill="white" opacity="0.5" />
        {/* Reflective strip right */}
        <rect x="92" y="138" width="16" height="4" rx="2" fill="white" opacity="0.5" />
        {/* Vest center stripe */}
        <rect x="68" y="108" width="24" height="56" rx="0" fill="#2563EB" opacity="0.0" />

        {/* ── Left arm (raised, holding tablet) ── */}
        <rect x="22" y="112" width="34" height="16" rx="8" fill="url(#shirtG)"
          transform="rotate(-20 56 120)" filter="url(#shadow)" />
        {/* Left vest sleeve */}
        <rect x="22" y="112" width="20" height="16" rx="8" fill="url(#vestG)"
          transform="rotate(-20 56 120)" opacity="0.9" />

        {/* ── Right arm (down, slightly out) ── */}
        <rect x="108" y="112" width="30" height="15" rx="7.5" fill="url(#shirtG)"
          transform="rotate(15 108 119)" filter="url(#shadow)" />
        <rect x="108" y="112" width="20" height="15" rx="7.5" fill="url(#vestG)"
          transform="rotate(15 108 119)" opacity="0.9" />

        {/* ── Tablet / Clipboard ── */}
        <g transform="translate(16, 120) rotate(-20)">
          {/* Tablet body */}
          <rect x="0" y="0" width="38" height="50" rx="5" fill="url(#tabletG)" filter="url(#shadow)" />
          {/* Screen */}
          <rect x="3" y="4" width="32" height="38" rx="3" fill="url(#screenG)" />
          {/* Screen content - checklist lines */}
          <rect x="7" y="10" width="8" height="8" rx="2" fill="#10B981" opacity="0.7" />
          <polyline points="9,14 11,16 14,12" stroke="white" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
          <rect x="18" y="12" width="12" height="2" rx="1" fill="white" opacity="0.4" />
          <rect x="7" y="22" width="8" height="8" rx="2" fill="#10B981" opacity="0.7" />
          <polyline points="9,26 11,28 14,24" stroke="white" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
          <rect x="18" y="24" width="10" height="2" rx="1" fill="white" opacity="0.4" />
          <rect x="7" y="34" width="8" height="8" rx="2" fill="#374151" opacity="0.5"
            stroke="white" strokeWidth="0.5" strokeDasharray="2 1" />
          <rect x="18" y="36" width="14" height="2" rx="1" fill="white" opacity="0.25" />
          {/* Home button */}
          <circle cx="19" cy="46" r="2" fill="#374151" opacity="0.6" />
        </g>

        {/* ── Neck ── */}
        <rect x="73" y="96" width="14" height="16" rx="7" fill="#FBBF24" />

        {/* ── Head ── */}
        <circle cx="80" cy="80" r="28" fill="#FBBF24" filter="url(#shadow)" />
        {/* Face shadow/shading */}
        <ellipse cx="80" cy="88" rx="20" ry="14" fill="#F59E0B" opacity="0.3" />

        {/* ── Face ── */}
        {/* Eyes */}
        <circle cx="70" cy="76" r="5" fill="white" />
        <circle cx="90" cy="76" r="5" fill="white" />
        <circle cx="71.5" cy="77" r="3" fill="#1E3A5F" />
        <circle cx="91.5" cy="77" r="3" fill="#1E3A5F" />
        {/* Eye shine */}
        <circle cx="72.5" cy="75.5" r="1" fill="white" opacity="0.9" />
        <circle cx="92.5" cy="75.5" r="1" fill="white" opacity="0.9" />
        {/* Smile */}
        <path d="M70 88 Q80 96 90 88" stroke="#D97706" strokeWidth="2.5"
          strokeLinecap="round" fill="none" />
        {/* Cheek blush */}
        <circle cx="65" cy="84" r="5" fill="#F97316" opacity="0.2" />
        <circle cx="95" cy="84" r="5" fill="#F97316" opacity="0.2" />

        {/* ── Helmet ── */}
        <path d="M52 72 Q52 44 80 44 Q108 44 108 72 L104 78 Q80 68 56 78 Z"
          fill="url(#helmetG)" filter="url(#shadow)" />
        {/* Helmet brim */}
        <path d="M48 74 Q80 64 112 74 L112 78 Q80 70 48 78 Z"
          fill="#D97706" opacity="0.8" />
        {/* Helmet shine */}
        <ellipse cx="72" cy="56" rx="10" ry="5" fill="white" opacity="0.18"
          transform="rotate(-10 72 56)" />
        {/* Helmet logo */}
        <circle cx="80" cy="62" r="7" fill="#2563EB" opacity="0.9" />
        <text x="80" y="65.5" textAnchor="middle" fill="white" fontSize="7"
          fontFamily="Poppins, sans-serif" fontWeight="700">G</text>

        {/* ── Sparkles around character ── */}
        {/* Top left sparkle */}
        <g opacity="0.8" filter="url(#glow)">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"
            begin="0s" />
          <path d="M32 38 L33.5 34 L35 38 L39 39.5 L35 41 L33.5 45 L32 41 L28 39.5 Z"
            fill="#FCD34D" />
        </g>
        {/* Top right sparkle */}
        <g opacity="0.6" filter="url(#glow)">
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite"
            begin="0.8s" />
          <path d="M118 32 L119 29 L120 32 L123 33 L120 34 L119 37 L118 34 L115 33 Z"
            fill="#60A5FA" />
        </g>
        {/* Right sparkle */}
        <g opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.1;0.5" dur="3s" repeatCount="indefinite"
            begin="1.5s" />
          <path d="M128 88 L129 85.5 L130 88 L132.5 89 L130 90 L129 92.5 L128 90 L125.5 89 Z"
            fill="#10B981" />
        </g>
      </g>
    </svg>
  );
}