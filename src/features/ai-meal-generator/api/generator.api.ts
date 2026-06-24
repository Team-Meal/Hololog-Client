import { instance } from "@/shared/api";
import type { GeneratorResult } from "../model/types";

interface AiGenerationPayload {
  month: string;
  holidays?: string[];
}

export async function generateAiMealPlanApi(
  payload: AiGenerationPayload,
): Promise<GeneratorResult> {
  const response = await instance.post<GeneratorResult>("/meals/ai-generations", payload, {
    requiresAuth: true,
  });
  return response.data;
}
