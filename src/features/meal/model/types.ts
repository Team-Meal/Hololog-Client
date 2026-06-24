export type ServerMealType = "BREAKFAST" | "LUNCH" | "DINNER";

// GET /meals/today
export interface TodayMealResponse {
  mealDate: string;
  mealType: ServerMealType;
  menuNames: string[];
  calorie: string;
  nutritionInfo: string;
  originInfo: string;
}

// GET & POST /meals/suggestions
export type MealSuggestionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface MealSuggestion {
  id: number;
  title: string;
  content: string;
  mealSuggestionStatus: MealSuggestionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSuggestionPayload {
  title: string;
  content?: string;
}

// PATCH /meals/suggestions/{suggestionId}
export interface UpdateSuggestionStatusPayload {
  mealSuggestionStatus: MealSuggestionStatus;
}

// POST /meals/ai-generations
export interface AiGenerationPayload {
  month: string; // YYYY-MM
  holidays?: string[];
}

export interface AiGenerationResponse {
  month: string;
  totalMeals: number;
  validationErrors: unknown[];
  budgetInfo: Record<string, unknown>;
  error?: string;
}

// POST /meals — AI callback
export interface MealCallbackPayload {
  diet_id: number;
  menu_name: string;
  kcal: number;
  protein: number;
  fat: number;
  sodium: number;
}
