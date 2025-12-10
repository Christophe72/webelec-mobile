const TOKEN_KEY = "jwt_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  // Stocke en localStorage
  window.localStorage.setItem(TOKEN_KEY, token);
  // Stocke aussi en cookie pour le middleware Next.js
  document.cookie = `token=${token}; path=/; SameSite=Strict; max-age=86400`;
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  // Supprime aussi le cookie
  document.cookie = "token=; path=/; max-age=0";
}
