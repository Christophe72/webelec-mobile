const TOKEN_KEY = "jwt_token";
const COOKIE_KEY = "token";

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

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  // Stocke en localStorage
  window.localStorage.setItem(TOKEN_KEY, token);
  // Stocke aussi en cookie pour le middleware Next.js
  document.cookie = `${COOKIE_KEY}=${encodeURIComponent(token)}; path=/; SameSite=Strict; max-age=86400`;
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  // Supprime aussi le cookie
  document.cookie = `${COOKIE_KEY}=; path=/; max-age=0`;
}
