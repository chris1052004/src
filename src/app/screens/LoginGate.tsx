import { Navigate } from 'react-router';
import { isLoggedIn } from '../lib/auth';
import Login from './Login';

const ONBOARDING_KEY = 'onboardingDone';

export default function LoginGate() {
  const hasOnboarded = localStorage.getItem(ONBOARDING_KEY) === '1';

  if (isLoggedIn()) {
    return <Navigate to="/app/home" replace />;
  }

  if (!hasOnboarded) {
    return <Navigate to="/" replace />;
  }

  return <Login />;
}
