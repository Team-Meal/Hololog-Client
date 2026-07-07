import { create } from "zustand";
import { getDietsApi } from "@/entities/diet";
import { generateAiMealPlanApi, getAiGenerationApi } from "../api/generator.api";
import type { GeneratorStatus, GeneratorConditions, GeneratorResult } from "./types";

function currentYearMonth(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${mm}`;
}

const POLL_INTERVAL_MS = 2_000;
const POLL_MAX_ATTEMPTS = 45; // ~90s

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// The generation job never returns a summary — count the diets that landed in
// the generated month instead.
async function countDietsInMonth(month: string): Promise<number> {
  const diets = await getDietsApi();
  return diets.filter((diet) => diet.dietDate.startsWith(month)).length;
}

function errorStatus(err: unknown): number | undefined {
  return err instanceof Error && "response" in err
    ? (err as { response?: { status?: number } }).response?.status
    : undefined;
}

function extractErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && "response" in err
    ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ?? fallback)
    : fallback;
}

// Bumped on every generate()/reset() so a stale polling loop stops writing state.
let generationSeq = 0;

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
    const seq = ++generationSeq;
    const month = get().conditions.month;
    set({ status: "loading", result: null });

    const finish = (result: GeneratorResult) => {
      if (seq === generationSeq) set({ status: "done", result });
    };

    // Snapshot the month's diet count so the summary reports only what the
    // job newly created — pre-existing (e.g. manual) diets must not count.
    const beforeCount = await countDietsInMonth(month).catch(() => 0);

    try {
      // POST returns the job id right away; poll until the job settles.
      const job = await generateAiMealPlanApi({ month });

      for (let attempt = 0; attempt < POLL_MAX_ATTEMPTS; attempt++) {
        await sleep(POLL_INTERVAL_MS);
        if (seq !== generationSeq) return; // reset or regenerated meanwhile

        const { status } = await getAiGenerationApi(job.id);
        if (status === "SUCCEEDED") {
          const created = Math.max(0, (await countDietsInMonth(month)) - beforeCount);
          if (created === 0) {
            finish({
              month,
              totalMeals: 0,
              error:
                "생성 작업은 완료됐지만 새로 저장된 식단이 없어요. 서버(백엔드) 생성 작업 확인이 필요해요.",
            });
            return;
          }
          finish({ month, totalMeals: created });
          return;
        }
        if (status === "FAILED") {
          finish({ month, totalMeals: 0, error: "AI 식단 생성에 실패했어요. 다시 시도해 주세요." });
          return;
        }
      }

      finish({
        month,
        totalMeals: 0,
        error: "식단 생성이 예상보다 오래 걸리고 있어요. 잠시 후 '식단 관리'에서 확인해 주세요.",
      });
    } catch (err: unknown) {
      // 409 = this month is already generating or generated. If the diets are
      // already in, show their summary instead of a dead-end error.
      if (errorStatus(err) === 409) {
        const totalMeals = await countDietsInMonth(month).catch(() => 0);
        if (totalMeals > 0) {
          finish({
            month,
            totalMeals,
            notice:
              "이번 달 식단은 이미 생성되어 있어요. 아래 요약은 이전에 생성된 식단 기준이에요. '식단 관리'에서 확인·수정할 수 있어요.",
          });
          return;
        }
        finish({
          month,
          totalMeals: 0,
          error: "이번 달 식단은 이미 생성 중이에요. 잠시 후 '식단 관리'에서 확인해 주세요.",
        });
        return;
      }

      finish({
        month,
        totalMeals: 0,
        error: extractErrorMessage(err, "식단 생성 요청에 실패했어요. 잠시 후 다시 시도해 주세요."),
      });
    }
  },

  reset: () => {
    generationSeq++;
    set({ status: "idle", result: null });
  },

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
        nutritionCriteria: [...s.conditions.nutritionCriteria, { id: crypto.randomUUID(), label }],
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
