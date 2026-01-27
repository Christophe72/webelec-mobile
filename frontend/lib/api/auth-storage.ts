const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const COOKIE_KEY = "token";
const TOKEN_EVENT = "auth:token-change";

function notifyTokenChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(TOKEN_EVENT));
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));
  if (!match) return null;
  const value = match.slice(name.length + 1);
  return value ? decodeURIComponent(value) : null;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(TOKEN_KEY);
  if (stored) {
    return stored;
  }
  return readCookie(COOKIE_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  // Stocke en localStorage
  window.localStorage.setItem(TOKEN_KEY, token);
  // Stocke aussi en cookie pour le middleware Next.js
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(token)}; path=/; SameSite=Strict; max-age=86400`;
  notifyTokenChange();
}

export function setRefreshToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  // Supprime aussi le cookie
  document.cookie = `${COOKIE_KEY}=; path=/; max-age=0`;
  notifyTokenChange();
}
