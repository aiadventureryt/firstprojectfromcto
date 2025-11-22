import { AuthUser } from '@workspace/shared';

const AUTH_KEY = 'auth_user';

export function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

export function setAuthUser(user: AuthUser): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearAuthUser(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAdmin(): boolean {
  const user = getAuthUser();
  return user?.role === 'admin';
}

export function setMockAuthUser(): void {
  const mockUser: AuthUser = {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  };
  setAuthUser(mockUser);
}
