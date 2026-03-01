/**
 * HomeIndicator — the swipe-up home bar at the bottom of the phone frame.
 * Position: fixed → relative to MobileShell (due to transform containing block).
 */
export function HomeIndicator() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 8,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 9998,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: 96,
          height: 4,
          borderRadius: 2,
          background: 'var(--foreground)',
          opacity: 0.18,
        }}
      />
    </div>
  );
}
