/**
 * AutoPatternBg — subtle grid / road-lane texture for the hero banner.
 * Render at 6–8% opacity; used only as a background decoration.
 */
interface Props { className?: string }

export function AutoPatternBg({ className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 360 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Horizontal grid lines */}
      <line x1="0" y1="40"  x2="360" y2="40"  stroke="currentColor" strokeWidth="0.5" />
      <line x1="0" y1="80"  x2="360" y2="80"  stroke="currentColor" strokeWidth="0.5" />
      <line x1="0" y1="120" x2="360" y2="120" stroke="currentColor" strokeWidth="0.5" />
      <line x1="0" y1="160" x2="360" y2="160" stroke="currentColor" strokeWidth="0.5" />

      {/* Vertical grid lines */}
      <line x1="60"  y1="0" x2="60"  y2="200" stroke="currentColor" strokeWidth="0.5" />
      <line x1="120" y1="0" x2="120" y2="200" stroke="currentColor" strokeWidth="0.5" />
      <line x1="180" y1="0" x2="180" y2="200" stroke="currentColor" strokeWidth="0.5" />
      <line x1="240" y1="0" x2="240" y2="200" stroke="currentColor" strokeWidth="0.5" />
      <line x1="300" y1="0" x2="300" y2="200" stroke="currentColor" strokeWidth="0.5" />

      {/* Diagonal road-lane dash hints */}
      <path d="M310 0 L360 35"  stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 9" />
      <path d="M245 0 L360 78"  stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 9" />
      <path d="M178 0 L360 122" stroke="currentColor" strokeWidth="0.9" strokeDasharray="4 9" />
    </svg>
  );
}
