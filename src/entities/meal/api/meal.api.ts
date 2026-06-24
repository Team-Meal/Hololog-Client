import { instance } from "@/shared/api";
import type {
  AiMealPlanResult,
  CreateAiMealRequest,
  CreateMealSuggestionRequest,
  GenerateAiMealPlanRequest,
  MealSuggestion,
  ServerMealType,
  TodayMeal,
  UpdateMealSuggestionStatusRequest,
} from "../model/types";

// GET /meals/today — 오늘 급식 메뉴 조회.
export async function getTodayMeal(mealType: ServerMealType): Promise<TodayMeal> {
  const response = await instance.get<TodayMeal>("/meals/today", {
    params: { mealType },
    requiresAuth: true,
  });
  return response.data;
}

// GET /meals/suggestions — 먹고 싶은 급식 목록 조회.
export async function getMealSuggestions(): Promise<MealSuggestion[]> {
  const response = await instance.get<MealSuggestion[]>("/meals/suggestions", {
    requiresAuth: true,
  });
  return Array.isArray(response.data) ? response.data : [];
}

// POST /meals/suggestions — 먹고 싶은 급식 추천. Returns 204; refetch the list after.
export async function createMealSuggestion(payload: CreateMealSuggestionRequest): Promise<void> {
  await instance.post("/meals/suggestions", payload, { requiresAuth: true });
}

// PATCH /meals/suggestions/{suggestionId} — 제안 처리 상태 변경. Returns 204.
export async function updateMealSuggestionStatus(
  suggestionId: number,
  payload: UpdateMealSuggestionStatusRequest,
): Promise<void> {
  await instance.patch(`/meals/suggestions/${suggestionId}`, payload, {
    requiresAuth: true,
  });
}

// POST /meals/ai-generations — AI 월간 식단 자동 생성.
export async function generateAiMealPlan(
  payload: GenerateAiMealPlanRequest,
): Promise<AiMealPlanResult> {
  const response = await instance.post<AiMealPlanResult>("/meals/ai-generations", payload, {
    requiresAuth: true,
  });
  return response.data;
}

// POST /meals — AI 콜백: 급식 메뉴/영양정보 채우기.
export async function createAiMeal(payload: CreateAiMealRequest): Promise<void> {
  await instance.post("/meals", payload, { requiresAuth: true });
}
