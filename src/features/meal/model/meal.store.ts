"use client";

import { create } from "zustand";
import {
  getTodayMealApi,
  getMealSuggestionsApi,
  createMealSuggestionApi,
  updateSuggestionStatusApi,
} from "../api/meal.api";
import type {
  ServerMealType,
  TodayMealResponse,
  MealSuggestion,
  CreateSuggestionPayload,
  UpdateSuggestionStatusPayload,
} from "./types";

const MEAL_TYPES: ServerMealType[] = ["BREAKFAST", "LUNCH", "DINNER"];

interface MealState {
  todayMeals: Partial<Record<ServerMealType, TodayMealResponse>>;
  isTodayLoading: boolean;
  suggestions: MealSuggestion[];
  isSuggestionsLoading: boolean;
  error: string | null;
  fetchTodayMeals: () => Promise<void>;
  fetchSuggestions: () => Promise<void>;
  createSuggestion: (payload: CreateSuggestionPayload) => Promise<boolean>;
  updateSuggestionStatus: (
    id: number,
    payload: UpdateSuggestionStatusPayload,
  ) => Promise<boolean>;
}

function extractErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && "response" in err
    ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? fallback)
    : fallback;
}

export const useMealStore = create<MealState>((set, get) => ({
  todayMeals: {},
  isTodayLoading: false,
  suggestions: [],
  isSuggestionsLoading: false,
  error: null,

  fetchTodayMeals: async () => {
    set({ isTodayLoading: true, error: null });
    const results = await Promise.allSettled(MEAL_TYPES.map((t) => getTodayMealApi(t)));
    const todayMeals: Partial<Record<ServerMealType, TodayMealResponse>> = {};
    results.forEach((result, i) => {
      if (result.status === "fulfilled") todayMeals[MEAL_TYPES[i]] = result.value;
    });
    set({ todayMeals, isTodayLoading: false });
  },

  fetchSuggestions: async () => {
    set({ isSuggestionsLoading: true, error: null });
    try {
      const data = await getMealSuggestionsApi();
      set({ suggestions: data, isSuggestionsLoading: false });
    } catch (err: unknown) {
      const message = extractErrorMessage(err, "건의 목록을 불러오는 중 오류가 발생했습니다.");
      set({ error: message, isSuggestionsLoading: false });
    }
  },

  createSuggestion: async (payload) => {
    try {
      await createMealSuggestionApi(payload);
      await get().fetchSuggestions();
      return true;
    } catch (err: unknown) {
      const message = extractErrorMessage(err, "건의 등록 중 오류가 발생했습니다.");
      set({ error: message });
      return false;
    }
  },

  updateSuggestionStatus: async (id, payload) => {
    try {
      await updateSuggestionStatusApi(id, payload);
      await get().fetchSuggestions();
      return true;
    } catch (err: unknown) {
      const message = extractErrorMessage(err, "건의 상태 변경 중 오류가 발생했습니다.");
      set({ error: message });
      return false;
    }
  },
}));
