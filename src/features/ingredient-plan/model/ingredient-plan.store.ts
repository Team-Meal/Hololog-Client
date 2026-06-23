import { create } from "zustand";
import type { IngredientPlan } from "@/entities/ingredient-plan";
import { getIngredientPlanById, getIngredientPlans } from "../api/ingredient-plan.api";

interface IngredientPlanStore {
  plans: IngredientPlan[];
  selectedPlan: IngredientPlan | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  error: string | null;
  detailError: string | null;
  fetchPlans: () => Promise<void>;
  fetchPlanDetail: (planId: number) => Promise<void>;
  clearErrors: () => void;
}

export const useIngredientPlanStore = create<IngredientPlanStore>((set) => ({
  plans: [],
  selectedPlan: null,
  isLoading: false,
  isDetailLoading: false,
  error: null,
  detailError: null,

  fetchPlans: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getIngredientPlans();
      set({ plans: data, isLoading: false });
    } catch {
      set({ isLoading: false, error: "계획표 목록을 불러오지 못했습니다." });
    }
  },

  fetchPlanDetail: async (planId) => {
    set({ isDetailLoading: true, detailError: null, selectedPlan: null });
    try {
      const data = await getIngredientPlanById(planId);
      set({ selectedPlan: data, isDetailLoading: false });
    } catch {
      set({
        isDetailLoading: false,
        detailError: "계획표를 불러오지 못했습니다.",
      });
    }
  },

  clearErrors: () => set({ error: null, detailError: null }),
}));
