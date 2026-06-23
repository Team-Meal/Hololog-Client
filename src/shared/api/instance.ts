import axios from "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    requiresAuth?: boolean;
  }
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
  if (config.requiresAuth && typeof window !== "undefined") {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as { message?: string } | undefined;
      console.error(data?.message ?? error.message ?? "요청을 처리하지 못했습니다.");
    }
    return Promise.reject(error);
  },
);

export default instance;
