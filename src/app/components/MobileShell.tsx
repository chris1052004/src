import { useEffect, useState } from 'react';
import { StatusBar } from './StatusBar';
import { HomeIndicator } from './HomeIndicator';

interface MobileShellProps {
  children: React.ReactNode;
}

/**
 * MobileShell — wraps the entire app in a phone-frame container.
 *
 * On DESKTOP (>= 520px viewport):
 *   - Renders a fixed-dimension phone frame (390 × 852px, iPhone-like)
 *   - `transform: translate3d(0,0,0)` makes it the containing block for all
 *     `position: fixed` children, so fixed elements stay inside the frame
 *   - `overflow: hidden` — the frame clips content; scrolling is handled
 *     by MainLayout's inner scroll div
 *   - Shows phone chrome: StatusBar (notch + time) + HomeIndicator
 *
 * On MOBILE (<= 519px viewport):
 *   - Wraps children in a 100svh container so `h-full` works in MainLayout
 *   - No frame chrome, full native performance
 */
export function MobileShell({ children }: MobileShellProps) {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 520 : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 520px)');
    const update = (e: MediaQueryListEvent | MediaQueryList) => setIsDesktop(e.matches);
    mq.addEventListener('change', update as (e: MediaQueryListEvent) => void);
    update(mq);
    return () => mq.removeEventListener('change', update as (e: MediaQueryListEvent) => void);
  }, []);

  // ── Mobile: no frame, but give children a fixed height so h-full works ──
  if (!isDesktop) {
    return (
      <div style={{ height: '100svh', overflow: 'hidden' }}>
        {children}
      </div>
    );
  }

  // ── Desktop: phone frame ──────────────────────────────────────────────────
  return (
    <div
      style={{
        // ▸ THE KEY TRICK: transform creates a new containing block for
        //   position:fixed children, so they stay within the frame.
        transform: 'translate3d(0, 0, 0)',

        // ▸ Phone size
        width: '390px',
        height: 'min(852px, calc(100vh - 40px))',
        maxWidth: '100vw',

        // ▸ Clip frame — scrolling handled by MainLayout's inner div
        overflow: 'hidden',

        // ▸ Phone frame visual (Android — Samsung/Pixel style corners)
        borderRadius: '28px',
        boxShadow: [
          '0 0 0 2px #3a3a3a',
          '0 0 0 4px #1a1a1a',
          '0 0 0 6px #2a2a2a',
          '0 0 0 8px #111111',
          '0 0 0 10px #0a0a0a',
          '0 50px 100px rgba(0,0,0,0.9)',
          '0 20px 60px rgba(0,0,0,0.6)',
          'inset 0 0 0 1px rgba(255,255,255,0.06)',
        ].join(', '),

        // ▸ Clip content to rounded corners
        isolation: 'isolate',
        position: 'relative',
      }}
    >
      {/* ── Side buttons (visual only — Android/Samsung style) ── */}
      {/* Volume up */}
      <div style={{
        position: 'absolute', left: -9, top: 158, width: 3, height: 38,
        background: '#2a2a2a', borderRadius: '2px 0 0 2px', zIndex: 9999, pointerEvents: 'none',
        boxShadow: '-1px 0 2px rgba(0,0,0,0.5)',
      }} />
      {/* Volume down */}
      <div style={{
        position: 'absolute', left: -9, top: 208, width: 3, height: 38,
        background: '#2a2a2a', borderRadius: '2px 0 0 2px', zIndex: 9999, pointerEvents: 'none',
        boxShadow: '-1px 0 2px rgba(0,0,0,0.5)',
      }} />
      {/* Power button (right side, Android — shorter than iPhone) */}
      <div style={{
        position: 'absolute', right: -9, top: 168, width: 3, height: 48,
        background: '#2a2a2a', borderRadius: '0 2px 2px 0', zIndex: 9999, pointerEvents: 'none',
        boxShadow: '1px 0 2px rgba(0,0,0,0.5)',
      }} />

      {/* ── Status bar (fixed inside the frame) ── */}
      <StatusBar />

      {/* ── App content ── */}
      {children}

      {/* ── Home indicator (fixed inside the frame) ── */}
      <HomeIndicator />
    </div>
  );
}
