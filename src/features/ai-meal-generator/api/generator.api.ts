import { instance } from "@/shared/api";
import type { AiGenerationResponse } from "../model/types";

interface AiGenerationPayload {
  month: string;
  holidays?: string[];
}

// Kicks off async generation on the AI server and returns the job id immediately.
export async function generateAiMealPlanApi(
  payload: AiGenerationPayload,
): Promise<AiGenerationResponse> {
  const response = await instance.post<AiGenerationResponse>("/meals/ai-generations", payload, {
    requiresAuth: true,
    timeout: 10_000,
  });
  return response.data;
}

// Polls the job status until it reaches SUCCEEDED or FAILED.
export async function getAiGenerationApi(id: number): Promise<AiGenerationResponse> {
  const response = await instance.get<AiGenerationResponse>(`/meals/ai-generations/${id}`, {
    requiresAuth: true,
  });
  return response.data;
}
