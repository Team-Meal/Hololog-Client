"use client";

import { create } from "zustand";
import {
  getDietsApi,
  getDietApi,
  createDietApi,
  patchDietApi,
  deleteDietApi,
  getLeftoversApi,
  createLeftoversApi,
  exportDietApi,
} from "../api/diet.api";
import type {
  DietItem,
  DietDetail,
  CreateDietPayload,
  PatchDietPayload,
  LeftoverItem,
  CreateLeftoverPayload,
  DietExportFormat,
  ExportResponse,
} from "./types";

interface DietState {
  diets: DietItem[];
  currentDiet: DietDetail | null;
  leftovers: LeftoverItem[];
  isLoading: boolean;
  error: string | null;
  fetchDiets: () => Promise<void>;
  fetchDiet: (dietId: number) => Promise<void>;
  createDiet: (payload: CreateDietPayload) => Promise<boolean>;
  updateDiet: (dietId: number, payload: PatchDietPayload) => Promise<boolean>;
  deleteDiet: (dietId: number) => Promise<boolean>;
  fetchLeftovers: (dietId: number) => Promise<void>;
  recordLeftovers: (dietId: number, payload: CreateLeftoverPayload) => Promise<boolean>;
  exportDiet: (dietId: number, format: DietExportFormat) => Promise<ExportResponse | null>;
}

function extractErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && "response" in err
    ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? fallback)
    : fallback;
}

export const useDietStore = create<DietState>((set, get) => ({
  diets: [],
  currentDiet: null,
  leftovers: [],
  isLoading: false,
  error: null,

  fetchDiets: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getDietsApi();
      set({ diets: data, isLoading: false });
    } catch (err: unknown) {
      set({ error: extractErrorMessage(err, "식단 목록 조회 중 오류가 발생했습니다."), isLoading: false });
    }
  },

  fetchDiet: async (dietId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getDietApi(dietId);
      set({ currentDiet: data, isLoading: false });
    } catch (err: unknown) {
      set({ error: extractErrorMessage(err, "식단 조회 중 오류가 발생했습니다."), isLoading: false });
    }
  },

  createDiet: async (payload) => {
    try {
      await createDietApi(payload);
      await get().fetchDiets();
      return true;
    } catch (err: unknown) {
      set({ error: extractErrorMessage(err, "식단 등록 중 오류가 발생했습니다.") });
      return false;
    }
  },

  updateDiet: async (dietId, payload) => {
    try {
      const updated = await patchDietApi(dietId, payload);
      set((state) => ({
        diets: state.diets.map((d) => (d.id === dietId ? { ...d, ...updated } : d)),
        currentDiet: state.currentDiet?.id === dietId ? updated : state.currentDiet,
      }));
      return true;
    } catch (err: unknown) {
      set({ error: extractErrorMessage(err, "식단 수정 중 오류가 발생했습니다.") });
      return false;
    }
  },

  deleteDiet: async (dietId) => {
    try {
      await deleteDietApi(dietId);
      set((state) => ({ diets: state.diets.filter((d) => d.id !== dietId) }));
      return true;
    } catch (err: unknown) {
      set({ error: extractErrorMessage(err, "식단 삭제 중 오류가 발생했습니다.") });
      return false;
    }
  },

  fetchLeftovers: async (dietId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getLeftoversApi(dietId);
      set({ leftovers: data, isLoading: false });
    } catch (err: unknown) {
      set({ error: extractErrorMessage(err, "잔반 데이터 조회 중 오류가 발생했습니다."), isLoading: false });
    }
  },

  recordLeftovers: async (dietId, payload) => {
    try {
      await createLeftoversApi(dietId, payload);
      await get().fetchLeftovers(dietId);
      return true;
    } catch (err: unknown) {
      set({ error: extractErrorMessage(err, "잔반 기록 중 오류가 발생했습니다.") });
      return false;
    }
  },

  exportDiet: async (dietId, format) => {
    try {
      const data = await exportDietApi(dietId, { dietExportFormat: format });
      return data;
    } catch (err: unknown) {
      set({ error: extractErrorMessage(err, "내보내기 중 오류가 발생했습니다.") });
      return null;
    }
  },
}));
