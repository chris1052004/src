import { Navigate, Outlet } from 'react-router';
import { BottomNav } from './BottomNav';
import { isLoggedIn } from '../lib/auth';

/**
 * MainLayout — the scroll architecture.
 *
 * Outer div: h-full overflow-hidden — fills the MobileShell frame (or 100svh on mobile)
 * Inner div: h-full overflow-y-auto — the ONLY scroll container for all screens
 *   pb-24 gives 96px clearance at bottom so content is never hidden under BottomNav
 *
 * BottomNav is position:fixed so it sits on top regardless of scroll position.
 */
export default function MainLayout() {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;

  return (
    <div className="h-full overflow-hidden bg-background">
      <div className="h-full overflow-y-auto scrollbar-hide ios-scroll pb-24">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
