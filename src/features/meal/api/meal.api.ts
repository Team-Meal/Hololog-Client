import { instance } from "@/shared/api";
import type {
  ServerMealType,
  TodayMealResponse,
  MealSuggestion,
  CreateSuggestionPayload,
  UpdateSuggestionStatusPayload,
  AiGenerationPayload,
  AiGenerationResponse,
  MealCallbackPayload,
} from "../model/types";

// AI callback — fills menu name and nutrition info for a diet entry.
export async function mealCallbackApi(payload: MealCallbackPayload): Promise<unknown> {
  const response = await instance.post("/meals", payload, { requiresAuth: true });
  return response.data;
}

export async function getTodayMealApi(mealType: ServerMealType): Promise<TodayMealResponse> {
  const response = await instance.get<TodayMealResponse>("/meals/today", {
    params: { mealType },
    requiresAuth: true,
  });
  return response.data;
}

export async function getMealSuggestionsApi(): Promise<MealSuggestion[]> {
  const response = await instance.get<MealSuggestion[]>("/meals/suggestions", {
    requiresAuth: true,
  });
  return response.data;
}

// Returns 204 No Content.
export async function createMealSuggestionApi(payload: CreateSuggestionPayload): Promise<void> {
  await instance.post("/meals/suggestions", payload, { requiresAuth: true });
}

// Returns 204 No Content.
export async function updateSuggestionStatusApi(
  suggestionId: number,
  payload: UpdateSuggestionStatusPayload,
): Promise<void> {
  await instance.patch(`/meals/suggestions/${suggestionId}`, payload, { requiresAuth: true });
}

export async function generateAiMealPlanApi(
  payload: AiGenerationPayload,
): Promise<AiGenerationResponse> {
  const response = await instance.post<AiGenerationResponse>("/meals/ai-generations", payload, {
    requiresAuth: true,
  });
  return response.data;
}
