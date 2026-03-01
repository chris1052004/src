interface CarBlueprintBackgroundProps {
  className?: string;
}

export function CarBlueprintBackground({ className = '' }: CarBlueprintBackgroundProps) {
  return (
    <svg
      viewBox="0 0 360 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g opacity="0.35" stroke="currentColor" strokeWidth="1">
        <path d="M22 126 C35 104 64 88 98 88 H242 C278 88 308 104 328 126" />
        <path d="M54 126 H296" />
        <circle cx="102" cy="126" r="24" />
        <circle cx="258" cy="126" r="24" />
        <path d="M108 88 L134 58 H226 L252 88" />
        <path d="M142 60 H218" />
        <path d="M164 88 V60" />
        <path d="M196 88 V60" />
        <path d="M63 126 H34" />
        <path d="M326 126 H295" />
      </g>

      <g opacity="0.18" stroke="currentColor" strokeWidth="0.8">
        <path d="M0 34 H360" />
        <path d="M0 70 H360" />
        <path d="M0 106 H360" />
        <path d="M0 142 H360" />
        <path d="M38 0 V180" />
        <path d="M98 0 V180" />
        <path d="M158 0 V180" />
        <path d="M218 0 V180" />
        <path d="M278 0 V180" />
        <path d="M338 0 V180" />
      </g>

      <g opacity="0.25" stroke="currentColor" strokeWidth="1">
        <path d="M16 164 C64 148 126 142 180 142 C234 142 296 148 344 164" />
      </g>
    </svg>
  );
}
