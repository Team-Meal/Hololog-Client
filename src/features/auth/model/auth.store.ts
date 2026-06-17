"use client";

import { create } from "zustand";
import { loginApi } from "../api/auth.api";
import type { LoginCredentials, AuthUser } from "@/entities/auth";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { tokens, user } = await loginApi(credentials);
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", tokens.accessToken);
        if (tokens.refreshToken) {
          localStorage.setItem("refreshToken", tokens.refreshToken);
        }
      }
      set({ user, isLoading: false });
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error && "response" in err
          ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ??
            "아이디 또는 비밀번호가 올바르지 않습니다.")
          : "로그인 중 오류가 발생했습니다.";
      set({ error: message, isLoading: false });
      return false;
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    set({ user: null, error: null });
  },

  clearError: () => set({ error: null }),
}));
