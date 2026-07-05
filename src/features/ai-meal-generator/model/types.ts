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

export type AiGenerationStatus = "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED";

// Response of POST /meals/ai-generations and GET /meals/ai-generations/{id}.
// The backend runs generation asynchronously and only ever returns the job
// id/status — the generated diets land in /diets.
export interface AiGenerationResponse {
  id: number;
  status: AiGenerationStatus;
}

// Summary assembled on the client once polling finishes: month comes from the
// request conditions, totalMeals from counting /diets entries in that month.
export interface GeneratorResult {
  month: string;
  totalMeals: number;
  validationErrors?: unknown[];
  budgetInfo?: Record<string, unknown>;
  error?: string;
}
