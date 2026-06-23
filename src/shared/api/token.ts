// Single source of truth for auth token storage, shared by the axios instance
// (request auth header + 401 refresh) and the auth store (login/logout).

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken?: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
  // Mirror the access token into a cookie so the server-side proxy can read it.
  document.cookie = `${ACCESS_TOKEN_KEY}=${accessToken}; path=/; max-age=${ACCESS_COOKIE_MAX_AGE}; samesite=lax`;
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; max-age=0; samesite=lax`;
}
