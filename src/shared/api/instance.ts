import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./token";

declare module "axios" {
  interface AxiosRequestConfig {
    requiresAuth?: boolean;
    // Set internally by the refresh interceptor to avoid loops / double retries.
    _retry?: boolean;
    _skipAuthRefresh?: boolean;
  }
}

// Subset of POST /auth/reissue's response we actually persist.
interface ReissueResult {
  accessToken: string;
  refreshToken: string;
}

export const instance = axios.create({
  // Same-origin path proxied to the backend via the /api/backend rewrite (next.config.ts).
  // Keeps browser requests CORS-free; the backend only whitelists its own origin.
  baseURL: "/api/backend",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  if (config.requiresAuth) {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

// Reissue a token pair from the refresh token. Shared across concurrent 401s so
// a burst of failed requests triggers only one /auth/reissue call.
let refreshPromise: Promise<string> | null = null;

// Whether the stored access token's `exp` claim has already passed. This backend
// answers expired/invalid tokens with 403 (not 401), so we decode the token to tell
// "expired session" apart from a genuine "insufficient permission" 403.
function isAccessTokenExpired(): boolean {
  const token = getAccessToken();
  const payload = token?.split(".")[1];
  if (!payload) return false;
  try {
    const claims = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as {
      exp?: number;
    };
    return typeof claims.exp === "number" && claims.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
}

async function reissueAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("리프레시 토큰이 없습니다.");
  }

  const { data } = await instance.post<ReissueResult>("/auth/reissue", null, {
    headers: { "Refresh-Token": refreshToken },
    // Don't let the response interceptor try to refresh the refresh call itself.
    _skipAuthRefresh: true,
  });

  setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const original = error.config;
    const status = error.response?.status;
    // 401 = token rejected; 403 + expired token = expired session (this backend
    // returns 403 for expired tokens). Either way, reissue and replay once.
    const shouldReissue = status === 401 || (status === 403 && isAccessTokenExpired());

    if (
      shouldReissue &&
      original &&
      original.requiresAuth &&
      !original._skipAuthRefresh &&
      !original._retry
    ) {
      original._retry = true;
      try {
        refreshPromise = refreshPromise ?? reissueAccessToken();
        const accessToken = await refreshPromise;
        original.headers.Authorization = `Bearer ${accessToken}`;
        return instance(original);
      } catch (refreshError) {
        // Refresh token is dead too — drop the session and bounce to login.
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        refreshPromise = null;
      }
    }

    const data = error.response?.data as { message?: string } | undefined;
    console.error(data?.message ?? error.message ?? "요청을 처리하지 못했습니다.");
    return Promise.reject(error);
  },
);

export default instance;
