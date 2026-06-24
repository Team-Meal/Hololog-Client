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

const MOCK_RESULT: GeneratorResult = {
  weeks: [
    {
      week: 1,
      days: [
        { day: "월", main: "백미밥", sides: ["소고기무국", "제육볶음", "콩나물무침"] },
        { day: "화", main: "차조밥", sides: ["아욱국", "닭갈비", "시금치나물"] },
        { day: "수", main: "카레라이스", sides: ["미소된장국", "동그랑땡", "오이무침"] },
        { day: "목", main: "흑미밥", sides: ["떡국", "고등어구이", "멸치볶음"] },
        { day: "금", main: "짜장밥", sides: ["계란국", "군만두", "단무지"] },
      ],
    },
    {
      week: 2,
      days: [
        { day: "월", main: "현미밥", sides: ["된장찌개", "돈까스", "깍두기"] },
        { day: "화", main: "백미밥", sides: ["미역국", "불고기", "시금치나물"] },
        { day: "수", main: "볶음밥", sides: ["콩나물국", "탕수육", "단무지"] },
        { day: "목", main: "차조밥", sides: ["감자국", "고등어조림", "무나물"] },
        { day: "금", main: "백미밥", sides: ["순두부찌개", "닭강정", "오이무침"] },
      ],
    },
    {
      week: 3,
      days: [
        { day: "월", main: "흑미밥", sides: ["소고기국", "제육볶음", "열무김치"] },
        { day: "화", main: "백미밥", sides: ["아욱된장국", "삼겹살구이", "콩나물"] },
        { day: "수", main: "카레라이스", sides: ["맑은국", "치킨까스", "단무지"] },
        { day: "목", main: "현미밥", sides: ["북어국", "장조림", "시금치나물"] },
        { day: "금", main: "잡곡밥", sides: ["김치찌개", "오징어볶음", "깍두기"] },
      ],
    },
    {
      week: 4,
      days: [
        { day: "월", main: "백미밥", sides: ["미소된장국", "닭볶음탕", "나물"] },
        { day: "화", main: "차조밥", sides: ["콩나물국", "돼지불고기", "오이무침"] },
        { day: "수", main: "볶음밥", sides: ["해물국", "너겟", "단무지"] },
        { day: "목", main: "흑미밥", sides: ["된장찌개", "고등어구이", "콩나물"] },
        { day: "금", main: "백미밥", sides: ["순두부국", "돈까스", "깍두기"] },
      ],
    },
  ],
  evaluation: {
    satisfactionRate: 91,
    costEfficiency: 88,
    nutritionScore: 94,
    wasteReduction: 12,
    aiConfidence: 93,
    reasons: [
      "재고가 많은 양파·감자·돼지고기를 우선 활용해 폐기 위험을 낮췄어요.",
      "지난 3개월 선호도 상위 메뉴(제육·돈까스·카레)를 주 1회씩 배치했어요.",
      "주간 단백질·채소 비율이 교육부 영양 기준을 충족해요.",
      "고가 품목인 소고기는 가격 안정기인 셋째 주에 집중 배치했어요.",
    ],
  },
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
      await generateAiMealPlanApi({ month: get().conditions.month });
      set({ status: "done", result: MOCK_RESULT });
    } catch {
      set({ status: "idle" });
    }
  },

  reset: () => set({ status: "idle", result: null }),

  setMonth: (value) =>
    set((s) => ({ conditions: { ...s.conditions, month: value } })),

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
