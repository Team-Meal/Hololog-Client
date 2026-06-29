"use client";

import { create } from "zustand";
import { setTokens, clearTokens } from "@/shared/api";
import { loginApi, logoutApi, registerApi, submitSignupRequestApi } from "../api/auth.api";
import type { LoginCredentials, RegisterCredentials, SignupRequestPayload } from "@/entities/auth";
import { useMemberProfileStore } from "@/entities/member";

interface AuthState {
  role: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  submitSignupRequest: (payload: SignupRequestPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

function extractErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && "response" in err
    ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? fallback)
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
      setTokens(data.accessToken, data.refreshToken);
      set({ role: data.role, isLoading: false });
      return true;
    } catch (err: unknown) {
      const message = extractErrorMessage(err, "이메일 또는 비밀번호가 올바르지 않습니다.");
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

  // Requires a signed-in PENDING_NUTRITIONIST — call after login() so the token is set.
  submitSignupRequest: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await submitSignupRequestApi(payload);
      set({ isLoading: false });
      return true;
    } catch (err: unknown) {
      const message = extractErrorMessage(err, "영양사 가입 요청 중 오류가 발생했습니다.");
      set({ error: message, isLoading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      // Best-effort server-side refresh-token deletion; clear locally regardless.
      await logoutApi();
    } catch {
      // Already signed out or network error — still clear the local session.
    }
    clearTokens();
    useMemberProfileStore.getState().clearProfile();
    set({ role: null, error: null });
  },

  clearError: () => set({ error: null }),
}));
