import { useEffect, useState } from 'react';

/**
 * StatusBar — simulates the iOS/Android status bar.
 *
 * Uses `position: fixed` which, due to MobileShell's `transform: translate3d(0,0,0)`,
 * is positioned relative to the shell (not the viewport).
 *
 * Only rendered on desktop (inside MobileShell). On mobile, the OS provides the real status bar.
 */
export function StatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    update();
    const id = setInterval(update, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 50,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingLeft: 28,
        paddingRight: 20,
        paddingBottom: 8,
        pointerEvents: 'none',
        // Transparent — blends with whatever is below (hero gradient, card bg, etc.)
        background: 'transparent',
      }}
    >
      {/* Time */}
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 0,
          color: 'var(--foreground)',
          opacity: 0.85,
          fontFamily: 'Poppins, sans-serif',
          lineHeight: 1,
        }}
      >
        {time}
      </span>

      {/* Punch-hole camera (Android centre camera — Samsung/Pixel style) */}
      <div
        style={{
          position: 'absolute',
          top: 13,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 11,
          height: 11,
          background: '#111',
          borderRadius: '50%',
          boxShadow: '0 0 0 1.5px #222',
        }}
      />

      {/* Right: Signal + WiFi + Battery */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {/* Signal bars */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor" opacity="0.85" />
          <rect x="4.5" y="5" width="3" height="7" rx="1" fill="currentColor" opacity="0.85" />
          <rect x="9" y="2.5" width="3" height="9.5" rx="1" fill="currentColor" opacity="0.85" />
          <rect x="13.5" y="0" width="2.5" height="12" rx="1" fill="currentColor" opacity="0.3" />
        </svg>

        {/* WiFi */}
        <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
          <path d="M7.5 10 L7.5 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          <path d="M5 7.5 Q7.5 5.5 10 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85" />
          <path d="M2.5 5 Q7.5 1 12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
        </svg>

        {/* Battery */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.85, fontFamily: 'Poppins, sans-serif', lineHeight: 1 }}>87</span>
          <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
            {/* Battery body */}
            <rect x="0.5" y="0.5" width="18" height="11" rx="3" stroke="currentColor" strokeOpacity="0.5" />
            {/* Battery fill */}
            <rect x="1.5" y="1.5" width="14" height="9" rx="2.5" fill="currentColor" opacity="0.8" />
            {/* Battery tip */}
            <path d="M19.5 4 L19.5 8 Q22 8 22 6 Q22 4 19.5 4 Z" fill="currentColor" opacity="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
