export const API = 'https://api.modstack.online';

export interface ModstackUser {
  id: string;
  username: string;
  avatar: string | null;
  created_at: string;
}

let accessToken: string | null = null;
let currentUser: ModstackUser | null = null;
let refreshListeners: Array<() => void> = [];

// XSS-safe text: strips any HTML from untrusted strings
export function sanitizeText(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Same rules the API enforces (Minecraft usernames): 3-16 chars, letters, numbers and _
export function isValidUsername(username: string): boolean {
  return /^[A-Za-z0-9_]{3,16}$/.test(username);
}

export function avatarUrl(avatar: string | null | undefined): string {
  if (!avatar) return '/images/placeholder.png';
  // Only allow http/https URLs or paths starting with /
  if (avatar.startsWith('https://') || avatar.startsWith('http://')) return avatar;
  if (avatar.startsWith('/')) return `${API}${avatar}`;
  return '/img/avatar-default.png';
}

export async function initSession(): Promise<ModstackUser | null> {
  try {
    const res = await fetch(`${API}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) {
      accessToken = null;
      currentUser = null;
      notifyListeners();
      return null;
    }
    const data = await res.json();
    accessToken = data.accessToken ?? null;
    currentUser = data.user ?? null;
    notifyListeners();
    return currentUser;
  } catch {
    accessToken = null;
    currentUser = null;
    notifyListeners();
    return null;
  }
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(typeof options.body === 'string' ? { 'Content-Type': 'application/json' } : {}),
  };

  const res = await fetch(`${API}${path}`, { ...options, headers });

  if (res.status === 401) {
    const refreshed = await initSession();
    if (refreshed) return apiFetch(path, options);
  }

  return res;
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
  } catch { /* ignore */ }
  accessToken = null;
  currentUser = null;
  notifyListeners();
}

export function getAccessToken(): string | null { return accessToken; }
export function getCurrentUser(): ModstackUser | null { return currentUser; }

export function onAuthChange(cb: () => void): () => void {
  refreshListeners.push(cb);
  return () => { refreshListeners = refreshListeners.filter(l => l !== cb); };
}

function notifyListeners() {
  refreshListeners.forEach(cb => cb());
}

// Handle OAuth redirect hashes
export function handleAuthRedirect(): void {
  const hash = new URLSearchParams(location.hash.slice(1));
  const authError = hash.get('auth_error');
  if (authError) {
    // sanitize before displaying
    const safe = sanitizeText(authError);
    alert(`Login error: ${safe}`);
  }
  if (hash.has('auth') || hash.has('auth_error')) {
    history.replaceState(null, '', location.pathname + location.search);
  }
}
