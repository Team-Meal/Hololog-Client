import { isAxiosError } from "axios";
import { instance } from "@/shared/api";
import type {
  CreateDietLeftoverRequest,
  CreateDietRequest,
  Diet,
  DietExport,
  DietExportFormat,
  DietLeftover,
  DietListItem,
  UpdateDietRequest,
} from "../model/types";

// GET /diets — 식단 목록 조회.
export async function getDiets(): Promise<DietListItem[]> {
  const response = await instance.get<DietListItem[]>("/diets", { requiresAuth: true });
  return Array.isArray(response.data) ? response.data : [];
}

// GET /diets/{dietId} — 식단 단건 조회.
export async function getDiet(dietId: number): Promise<Diet> {
  const response = await instance.get<Diet>(`/diets/${dietId}`, { requiresAuth: true });
  return response.data;
}

// POST /diets — 식단 작성. Returns 204 (or 201 on the AI-callback path); refetch after.
export async function createDiet(payload: CreateDietRequest): Promise<void> {
  await instance.post("/diets", payload, { requiresAuth: true });
}

// PATCH /diets/{dietId} — 식단 수정.
export async function updateDiet(dietId: number, payload: UpdateDietRequest): Promise<Diet> {
  const response = await instance.patch<Diet>(`/diets/${dietId}`, payload, {
    requiresAuth: true,
  });
  return response.data;
}

// DELETE /diets/{dietId} — 식단 삭제. Returns 204.
export async function deleteDiet(dietId: number): Promise<void> {
  await instance.delete(`/diets/${dietId}`, { requiresAuth: true });
}

// GET /diets/{dietId}/leftovers — 식단별 잔반량 조회.
// Returns null when no leftover has been recorded yet (404). Errors are not
// logged here since callers treat "couldn't load" as an empty starting point.
export async function getDietLeftover(dietId: number): Promise<DietLeftover | null> {
  try {
    const response = await instance.get<DietLeftover>(`/diets/${dietId}/leftovers`, {
      requiresAuth: true,
      _skipErrorLog: true,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

// POST /diets/{dietId}/leftovers — 식단별 잔반량 입력. Returns 204.
export async function createDietLeftover(
  dietId: number,
  payload: CreateDietLeftoverRequest,
): Promise<void> {
  await instance.post(`/diets/${dietId}/leftovers`, payload, { requiresAuth: true });
}

// POST /diets/{dietId}/exports — 식단 출력 (PDF/EXCEL/IMAGE).
export async function exportDiet(
  dietId: number,
  dietExportFormat: DietExportFormat,
): Promise<DietExport> {
  const response = await instance.post<DietExport>(
    `/diets/${dietId}/exports`,
    { dietExportFormat },
    { requiresAuth: true },
  );
  return response.data;
}
