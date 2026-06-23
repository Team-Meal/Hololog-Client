"use client";

import { create } from "zustand";
import {
  getIngredientsApi,
  createIngredientApi,
  patchIngredientApi,
  deleteIngredientApi,
} from "../api/ingredient.api";
import type { IngredientItem, CreateIngredientPayload, PatchIngredientPayload } from "./types";

interface IngredientState {
  items: IngredientItem[];
  isLoading: boolean;
  error: string | null;
  fetchIngredients: () => Promise<void>;
  createIngredient: (payload: CreateIngredientPayload) => Promise<boolean>;
  updateIngredient: (id: number, payload: PatchIngredientPayload) => Promise<boolean>;
  deleteIngredient: (id: number) => Promise<boolean>;
  deleteIngredients: (ids: number[]) => Promise<void>;
}

function extractErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && "response" in err
    ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? fallback)
    : fallback;
}

export const useIngredientStore = create<IngredientState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchIngredients: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getIngredientsApi();
      set({ items: data, isLoading: false });
    } catch (err: unknown) {
      const message = extractErrorMessage(err, "식자재 목록을 불러오는 중 오류가 발생했습니다.");
      set({ error: message, isLoading: false });
    }
  },

  createIngredient: async (payload) => {
    try {
      await createIngredientApi(payload);
      await get().fetchIngredients();
      return true;
    } catch (err: unknown) {
      const message = extractErrorMessage(err, "식자재 등록 중 오류가 발생했습니다.");
      set({ error: message });
      return false;
    }
  },

  updateIngredient: async (id, payload) => {
    try {
      await patchIngredientApi(id, payload);
      await get().fetchIngredients();
      return true;
    } catch (err: unknown) {
      const message = extractErrorMessage(err, "식자재 수정 중 오류가 발생했습니다.");
      set({ error: message });
      return false;
    }
  },

  deleteIngredient: async (id) => {
    try {
      await deleteIngredientApi(id);
      set((state) => ({ items: state.items.filter((i) => i.ingredientId !== id) }));
      return true;
    } catch (err: unknown) {
      const message = extractErrorMessage(err, "식자재 삭제 중 오류가 발생했습니다.");
      set({ error: message });
      return false;
    }
  },

  deleteIngredients: async (ids) => {
    await Promise.allSettled(ids.map((id) => deleteIngredientApi(id)));
    set((state) => ({ items: state.items.filter((i) => !ids.includes(i.ingredientId)) }));
  },
}));
