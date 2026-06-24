import { instance } from "@/shared/api";
import type {
  DietItem,
  DietDetail,
  CreateDietPayload,
  PatchDietPayload,
  LeftoverItem,
  CreateLeftoverPayload,
  ExportPayload,
  ExportResponse,
} from "../model/types";

export async function getDietsApi(): Promise<DietItem[]> {
  const response = await instance.get<DietItem[]>("/diets", { requiresAuth: true });
  return response.data;
}

// Returns 204 or 201 depending on whether AI callback is triggered.
export async function createDietApi(payload: CreateDietPayload): Promise<void> {
  await instance.post("/diets", payload, { requiresAuth: true });
}

export async function getDietApi(dietId: number): Promise<DietDetail> {
  const response = await instance.get<DietDetail>(`/diets/${dietId}`, { requiresAuth: true });
  return response.data;
}

export async function patchDietApi(dietId: number, payload: PatchDietPayload): Promise<DietDetail> {
  const response = await instance.patch<DietDetail>(`/diets/${dietId}`, payload, {
    requiresAuth: true,
  });
  return response.data;
}

// Returns 204 No Content.
export async function deleteDietApi(dietId: number): Promise<void> {
  await instance.delete(`/diets/${dietId}`, { requiresAuth: true });
}

export async function getLeftoversApi(dietId: number): Promise<LeftoverItem[]> {
  const response = await instance.get<LeftoverItem[]>(`/diets/${dietId}/leftovers`, {
    requiresAuth: true,
  });
  return response.data;
}

// Returns 204 No Content.
export async function createLeftoversApi(
  dietId: number,
  payload: CreateLeftoverPayload,
): Promise<void> {
  await instance.post(`/diets/${dietId}/leftovers`, payload, { requiresAuth: true });
}

export async function exportDietApi(
  dietId: number,
  payload: ExportPayload,
): Promise<ExportResponse> {
  const response = await instance.post<ExportResponse>(`/diets/${dietId}/exports`, payload, {
    requiresAuth: true,
  });
  return response.data;
}
