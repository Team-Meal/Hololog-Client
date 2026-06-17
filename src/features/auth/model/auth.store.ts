"use client";

import { create } from "zustand";
import { loginApi, registerApi } from "../api/auth.api";
import type { LoginCredentials, RegisterCredentials, AuthUser } from "@/entities/auth";

interface AuthState {
  user: AuthUser | null;
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
}

function extractErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && "response" in err
    ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        fallback)
    : fallback;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { tokens, user } = await loginApi(credentials);
      persistTokens(tokens.accessToken, tokens.refreshToken);
      set({ user, isLoading: false });
      return true;
    } catch (err: unknown) {
      const message = extractErrorMessage(
        err,
        "아이디 또는 비밀번호가 올바르지 않습니다.",
      );
      set({ error: message, isLoading: false });
      return false;
    }
  },

  register: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { tokens, user } = await registerApi(credentials);
      persistTokens(tokens.accessToken, tokens.refreshToken);
      set({ user, isLoading: false });
      return true;
    } catch (err: unknown) {
      const message = extractErrorMessage(err, "회원가입 중 오류가 발생했습니다.");
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
