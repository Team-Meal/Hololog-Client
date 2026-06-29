import { create } from "zustand";
import { generateAiMealPlanApi } from "../api/generator.api";
import type { GeneratorStatus, GeneratorConditions, GeneratorResult } from "./types";

function currentYearMonth(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${mm}`;
}

const INITIAL_CONDITIONS: GeneratorConditions = {
  month: currentYearMonth(),
  useInventory: true,
  budgetPerPerson: 1900,
  preferenceWeight: 50,
  seasonalIngredients: [],
  nutritionCriteria: [],
};

interface GeneratorState {
  status: GeneratorStatus;
  conditions: GeneratorConditions;
  result: GeneratorResult | null;
  generate: () => Promise<void>;
  reset: () => void;
  setMonth: (value: string) => void;
  setUseInventory: (value: boolean) => void;
  setBudgetPerPerson: (value: number) => void;
  setPreferenceWeight: (value: number) => void;
  addIngredient: (label: string) => void;
  removeIngredient: (id: string) => void;
  addNutrition: (label: string) => void;
  removeNutrition: (id: string) => void;
}

export const useGeneratorStore = create<GeneratorState>((set, get) => ({
  status: "idle",
  conditions: INITIAL_CONDITIONS,
  result: null,

  generate: async () => {
    set({ status: "loading", result: null });
    try {
      const result = await generateAiMealPlanApi({ month: get().conditions.month });
      set({ status: "done", result });
    } catch {
      set({ status: "idle" });
    }
  },

  reset: () => set({ status: "idle", result: null }),

  setMonth: (value) => set((s) => ({ conditions: { ...s.conditions, month: value } })),

  setUseInventory: (value) =>
    set((s) => ({ conditions: { ...s.conditions, useInventory: value } })),

  setBudgetPerPerson: (value) =>
    set((s) => ({ conditions: { ...s.conditions, budgetPerPerson: value } })),

  setPreferenceWeight: (value) =>
    set((s) => ({ conditions: { ...s.conditions, preferenceWeight: value } })),

  addIngredient: (label) =>
    set((s) => ({
      conditions: {
        ...s.conditions,
        seasonalIngredients: [
          ...s.conditions.seasonalIngredients,
          { id: crypto.randomUUID(), label },
        ],
      },
    })),

  removeIngredient: (id) =>
    set((s) => ({
      conditions: {
        ...s.conditions,
        seasonalIngredients: s.conditions.seasonalIngredients.filter((ing) => ing.id !== id),
      },
    })),

  addNutrition: (label) =>
    set((s) => ({
      conditions: {
        ...s.conditions,
        nutritionCriteria: [
          ...s.conditions.nutritionCriteria,
          { id: crypto.randomUUID(), label },
        ],
      },
    })),

  removeNutrition: (id) =>
    set((s) => ({
      conditions: {
        ...s.conditions,
        nutritionCriteria: s.conditions.nutritionCriteria.filter((nc) => nc.id !== id),
      },
    })),
}));
