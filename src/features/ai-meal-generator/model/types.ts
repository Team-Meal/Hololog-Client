export type GeneratorStatus = "idle" | "loading" | "done";

export interface SeasonalIngredient {
  id: string;
  label: string;
  selected: boolean;
}

export interface NutritionCriterion {
  id: string;
  label: string;
  checked: boolean;
}

export interface GeneratorConditions {
  useInventory: boolean;
  budgetPerPerson: number;
  preferenceWeight: number;
  seasonalIngredients: SeasonalIngredient[];
  nutritionCriteria: NutritionCriterion[];
}

export interface DayMeal {
  day: "월" | "화" | "수" | "목" | "금";
  main: string;
  sides: string[];
}

export interface WeekPlan {
  week: number;
  days: DayMeal[];
}

export interface EvaluationResult {
  satisfactionRate: number;
  costEfficiency: number;
  nutritionScore: number;
  wasteReduction: number;
  aiConfidence: number;
  reasons: string[];
}

export interface GeneratorResult {
  weeks: WeekPlan[];
  evaluation: EvaluationResult;
}
