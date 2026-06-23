"use client";

import { create } from "zustand";
import {
  getSignupRequestsApi,
  approveSignupRequestApi,
  rejectSignupRequestApi,
} from "../api/admin.api";
import type { SignupRequestItem } from "./types";

interface AdminState {
  requests: SignupRequestItem[];
  page: number;
  totalPages: number;
  isLoading: boolean;
  actionLoading: boolean;
  error: string | null;
  fetchRequests: (page?: number) => Promise<void>;
  approve: (requestId: number) => Promise<boolean>;
  reject: (requestId: number) => Promise<boolean>;
}

function extractErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && "response" in err
    ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? fallback)
    : fallback;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  requests: [],
  page: 0,
  totalPages: 1,
  isLoading: false,
  actionLoading: false,
  error: null,

  fetchRequests: async (page = 0) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getSignupRequestsApi(page);
      set({
        requests: data.content,
        page: data.number,
        totalPages: data.totalPages,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message = extractErrorMessage(err, "목록을 불러오는 중 오류가 발생했습니다.");
      set({ error: message, isLoading: false });
    }
  },

  approve: async (requestId) => {
    set({ actionLoading: true });
    try {
      await approveSignupRequestApi(requestId);
      set({ actionLoading: false });
      await get().fetchRequests(get().page);
      return true;
    } catch (err: unknown) {
      const message = extractErrorMessage(err, "승인 처리 중 오류가 발생했습니다.");
      set({ error: message, actionLoading: false });
      return false;
    }
  },

  reject: async (requestId) => {
    set({ actionLoading: true });
    try {
      await rejectSignupRequestApi(requestId);
      set({ actionLoading: false });
      await get().fetchRequests(get().page);
      return true;
    } catch (err: unknown) {
      const message = extractErrorMessage(err, "거절 처리 중 오류가 발생했습니다.");
      set({ error: message, actionLoading: false });
      return false;
    }
  },
}));
