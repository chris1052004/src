/**
 * auth — simple localStorage-backed auth state.
 * No real server calls; simulates login/logout for the prototype.
 */

const AUTH_KEY = 'auth.user';
const LEGACY_AUTH_KEY = 'veh_auth_user_v1';

export type AuthUser = {
  email: string;
  name: string;
};

function migrateLegacyAuth(): void {
  try {
    if (localStorage.getItem(AUTH_KEY)) return;
    const legacy = localStorage.getItem(LEGACY_AUTH_KEY);
    if (legacy) {
      localStorage.setItem(AUTH_KEY, legacy);
      localStorage.removeItem(LEGACY_AUTH_KEY);
    }
  } catch {}
}

export function login(email: string): void {
  const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const user: AuthUser = { email, name };
  try { localStorage.setItem(AUTH_KEY, JSON.stringify(user)); } catch {}
}

export function logout(): void {
  try {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(LEGACY_AUTH_KEY);
  } catch {}
}

export function isLoggedIn(): boolean {
  try {
    migrateLegacyAuth();
    return Boolean(localStorage.getItem(AUTH_KEY));
  } catch {
    return false;
  }
}

export function getUser(): AuthUser | null {
  try {
    migrateLegacyAuth();
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch { return null; }
}
