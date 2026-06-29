// Export form/preview options for the 내보내기 UI.
export type ExportFormType = "official" | "newsletter" | "student";
export type PreviewMode = "screen" | "print";

// ---------------------------------------------------------------------------
// Server API types (meal.https.gsmsv.site /meals)
// ---------------------------------------------------------------------------

// Backend meal-type enum.
export type ServerMealType = "BREAKFAST" | "LUNCH" | "DINNER";

// Processing status of a "먹고 싶은 급식" suggestion.
export type MealSuggestionStatus = "PENDING" | "APPROVED" | "REJECTED";

// GET /meals/today — today's menu for one meal type.
export interface TodayMeal {
  mealDate: string; // YYYY-MM-DD
  mealType: ServerMealType;
  menuNames: string[];
  calorie: string;
  nutritionInfo: string;
  originInfo: string;
}

// An item from GET /meals/suggestions.
export interface MealSuggestion {
  id: number;
  title: string;
  content: string;
  mealSuggestionStatus: MealSuggestionStatus;
  createdAt: string;
  updatedAt: string;
}

// Body for POST /meals/suggestions (먹고 싶은 급식 추천).
export interface CreateMealSuggestionRequest {
  title: string; // max 100 chars
  content: string;
}

// Body for PATCH /meals/suggestions/{suggestionId} (제안 처리 상태 변경).
export interface UpdateMealSuggestionStatusRequest {
  mealSuggestionStatus: MealSuggestionStatus;
}

// Body for POST /meals/ai-generations (AI 월간 식단 자동 생성).
export interface GenerateAiMealPlanRequest {
  month: string; // YYYY-MM
  holidays?: string[]; // YYYY-MM-DD[]
}

// Result of POST /meals/ai-generations.
export interface AiMealPlanResult {
  month: string;
  totalMeals: number;
  validationErrors: Record<string, unknown>[];
  budgetInfo: Record<string, unknown>;
  error: string;
}

// Body for POST /meals (AI 콜백 — 급식 메뉴/영양정보 채우기).
export interface CreateAiMealRequest {
  diet_id: number;
  menu_name: string;
  kcal: number;
  protein: number;
  fat: number;
  sodium: number;
}

// ---------------------------------------------------------------------------
// Diet API types (/diets)
// ---------------------------------------------------------------------------

// Unit for leftover (잔반량) amounts.
export type LeftoverUnit = "KG" | "G" | "L" | "ML" | "EA" | "BOX";

// Output format for POST /diets/{dietId}/exports.
export type DietExportFormat = "PDF" | "EXCEL" | "IMAGE";

// An item from GET /diets (식단 목록 조회) — no description field.
export interface DietListItem {
  id: number;
  name: string;
  mealType?: ServerMealType;
  dietDate: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}

// GET /diets/{dietId} (식단 단건 조회) — includes description.
export interface Diet {
  id: number;
  name: string;
  description: string;
  mealType?: ServerMealType;
  dietDate: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}

// Body for POST /diets (식단 작성). The endpoint accepts a free-form JSON node;
// this is the normal (non AI-callback) shape.
export interface CreateDietRequest {
  name: string;
  description?: string;
  dietDate: string; // YYYY-MM-DD
  mealType?: ServerMealType;
}

// Body for PATCH /diets/{dietId} (식단 수정).
export interface UpdateDietRequest {
  name: string;
  description?: string;
  dietDate: string; // YYYY-MM-DD
  mealType?: ServerMealType;
}

// GET /diets/{dietId}/leftovers (식단별 잔반량 조회).
export interface DietLeftover {
  id: number;
  name: string;
  dietDate: string; // YYYY-MM-DD
  amount: number;
  unit: LeftoverUnit;
  memo: string;
  createdAt: string;
  updatedAt: string;
}

// Body for POST /diets/{dietId}/leftovers (식단별 잔반량 입력).
export interface CreateDietLeftoverRequest {
  amount: number;
  unit: LeftoverUnit;
  memo?: string;
}

// Result of POST /diets/{dietId}/exports (식단 출력).
export interface DietExport {
  id: number;
  dietExportFormat: DietExportFormat;
  fileUrl: string;
}
