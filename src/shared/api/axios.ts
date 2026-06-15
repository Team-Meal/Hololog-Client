import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach auth token if present.
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: unwrap errors into a predictable shape.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      // TODO: handle 401 refresh / global error toast here.
    }
    return Promise.reject(error);
  },
);

export default api;
