import { instance } from "@/shared/api";

interface AiGenerationPayload {
  month: string;
  holidays?: string[];
}

interface AiGenerationResponse {
  month: string;
  totalMeals: number;
  validationErrors: unknown[];
  budgetInfo: Record<string, unknown>;
  error?: string;
}

export async function generateAiMealPlanApi(
  payload: AiGenerationPayload,
): Promise<AiGenerationResponse> {
  const response = await instance.post<AiGenerationResponse>(
    "/meals/ai-generations",
    payload,
    { requiresAuth: true },
  );
  return response.data;
}
