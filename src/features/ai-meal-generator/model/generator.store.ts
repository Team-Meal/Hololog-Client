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
  budgetPerPerson: 1600,
  preferenceWeight: 82,
  seasonalIngredients: [
    { id: "potato", label: "하지감자", selected: true },
    { id: "zucchini", label: "애호박", selected: true },
    { id: "melon", label: "참외", selected: false },
    { id: "cucumber", label: "오이", selected: false },
    { id: "pepper", label: "파리고추", selected: false },
    { id: "radish", label: "열무", selected: false },
  ],
  nutritionCriteria: [
    { id: "protein", label: "단백질 균형", checked: true },
    { id: "sodium", label: "나트륨 제한", checked: true },
    { id: "allergy", label: "알레르기 회피", checked: true },
    { id: "calorie", label: "칼로리 목표", checked: false },
  ],
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
  toggleIngredient: (id: string) => void;
  toggleNutrition: (id: string) => void;
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

  toggleIngredient: (id) =>
    set((s) => ({
      conditions: {
        ...s.conditions,
        seasonalIngredients: s.conditions.seasonalIngredients.map((ing) =>
          ing.id === id ? { ...ing, selected: !ing.selected } : ing,
        ),
      },
    })),

  toggleNutrition: (id) =>
    set((s) => ({
      conditions: {
        ...s.conditions,
        nutritionCriteria: s.conditions.nutritionCriteria.map((nc) =>
          nc.id === id ? { ...nc, checked: !nc.checked } : nc,
        ),
      },
    })),
}));
