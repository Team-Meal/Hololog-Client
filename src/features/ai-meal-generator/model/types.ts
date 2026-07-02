export type GeneratorStatus = "idle" | "loading" | "done";

export interface SeasonalIngredient {
  id: string;
  label: string;
}

export interface NutritionCriterion {
  id: string;
  label: string;
}

export interface GeneratorConditions {
  month: string; // YYYY-MM
  useInventory: boolean;
  budgetPerPerson: number;
  preferenceWeight: number;
  seasonalIngredients: SeasonalIngredient[];
  nutritionCriteria: NutritionCriterion[];
}

export interface ReasonLine {
  source: "학교 재고" | "농사로 제철" | "KAMIS 가격" | "학생 선호" | "예산 검증";
  text: string;
}

export interface ScoredMenu {
  menuName: string;
  ingredientName: string;
  score: number; // 0~100
  reasons: ReasonLine[];
}

export interface MealResultMetrics {
  localUsageRatePercent: number;
  seasonalRatePercent: number;
  perPersonCost: number;
  estimatedOrderCost: number;
  estimatedWasteReductionKg: number;
  nutritionMatchRatio: number; // 0~100
}

// Result of POST /meals/ai-generations. The backend returns a summary only —
// the generated diets themselves are retrievable from the 식단 관리 화면.
export interface GeneratorResult {
  month: string;
  totalMeals: number;
  validationErrors: unknown[];
  budgetInfo: Record<string, unknown>;
  error?: string;
}
