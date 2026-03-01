import { Navigate, useLocation } from 'react-router';
import { isLoggedIn } from '../lib/auth';

const ONBOARDING_KEY = 'onboardingDone';

/**
 * Entry — pure redirect gate at "/".
 * Never renders any UI; just decides where to send the user.
 *
 * Flow:
 *   logged in                    → /app
 *   first time (no onboarding)   → /onboarding
 *   force (?onboarding=1)        → /onboarding
 *   seen onboarding, not logged  → /landing
 */
export default function Entry() {
  const location = useLocation();
  const forceOnboarding = new URLSearchParams(location.search).get('onboarding') === '1';
  const hasOnboarded = localStorage.getItem(ONBOARDING_KEY) === '1';

  if (!forceOnboarding && isLoggedIn()) {
    return <Navigate to="/app" replace />;
  }

  if (forceOnboarding || !hasOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Navigate to="/landing" replace />;
}
