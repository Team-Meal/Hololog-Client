import { instance } from "@/shared/api";
import type { Budget } from "../model/types";

export async function getBudgets(): Promise<Budget[]> {
  const response = await instance.get("/budgets", { requiresAuth: true });
  const data = response.data;

  // Tolerate either a raw array or a wrapped list shape.
  if (Array.isArray(data)) return data as Budget[];
  if (Array.isArray(data?.budgets)) return data.budgets as Budget[];
  if (Array.isArray(data?.content)) return data.content as Budget[];
  return [];
}
