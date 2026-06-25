import { instance } from "@/shared/api";
import type {
  IngredientItem,
  IngredientDetail,
  CreateIngredientPayload,
  PatchIngredientPayload,
  PatchIngredientResponse,
} from "../model/types";

export async function getIngredientsApi(): Promise<IngredientItem[]> {
  const response = await instance.get<IngredientItem[]>("/ingredients", { requiresAuth: true });
  return response.data;
}

// Returns 201 with no body.
export async function createIngredientApi(payload: CreateIngredientPayload): Promise<void> {
  await instance.post("/ingredients", payload, { requiresAuth: true });
}

export async function getIngredientApi(ingredientId: number): Promise<IngredientDetail> {
  const response = await instance.get<IngredientDetail>(`/ingredients/${ingredientId}`, {
    requiresAuth: true,
  });
  return response.data;
}

export async function patchIngredientApi(
  ingredientId: number,
  payload: PatchIngredientPayload,
): Promise<PatchIngredientResponse> {
  const response = await instance.patch<PatchIngredientResponse>(
    `/ingredients/${ingredientId}`,
    payload,
    { requiresAuth: true },
  );
  return response.data;
}

// Returns 204 with no body.
export async function deleteIngredientApi(ingredientId: number): Promise<void> {
  await instance.delete(`/ingredients/${ingredientId}`, { requiresAuth: true });
}
