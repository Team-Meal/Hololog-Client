"use client";

import { create } from "zustand";
import { loginApi, registerApi } from "../api/auth.api";
import type { LoginCredentials, RegisterCredentials } from "@/entities/auth";

interface AuthState {
  role: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

function persistTokens(accessToken: string, refreshToken?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("accessToken", accessToken);
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
  // Mirror the token into a cookie so the server-side proxy (middleware) can read it.
  document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
}

function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  document.cookie = "accessToken=; path=/; max-age=0; samesite=lax";
}

function extractErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && "response" in err
    ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        fallback)
    : fallback;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await loginApi(credentials);
      persistTokens(data.accessToken, data.refreshToken);
      set({ role: data.role, isLoading: false });
      return true;
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "이메일 또는 비밀번호가 올바르지 않습니다.",
      );
      set({ error: message, isLoading: false });
      return false;
    }
  },

  register: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      // Signup returns 204 with no tokens — the user signs in afterwards.
      await registerApi(credentials);
      set({ isLoading: false });
      return true;
    } catch (err: unknown) {
      const message = extractErrorMessage(err, "회원가입 중 오류가 발생했습니다.");
      set({ error: message, isLoading: false });
      return false;
    }
  },

  logout: () => {
    clearTokens();
    set({ role: null, error: null });
  },

  clearError: () => set({ error: null }),
}));
