import { instance } from "@/shared/api";
import type { Budget, CreateBudgetRequest } from "../model/types";

function toNumber(value: unknown): number {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) ? n : 0;
}

function toText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// Coerce a raw API item into a safe Budget so missing/renamed fields never crash
// the UI (amounts default to 0). The aliases cover likely server field names.
function toBudget(raw: Record<string, unknown>): Budget {
  const pick = (...keys: string[]): unknown =>
    keys.map((key) => raw[key]).find((value) => value !== undefined);

  return {
    id: toNumber(pick("id", "budgetId")),
    title: toText(pick("title", "name")),
    totalAmount: toNumber(pick("totalAmount", "total", "budgetAmount", "amount")),
    usedAmount: toNumber(pick("usedAmount", "used", "spentAmount", "executedAmount")),
    startDate: toText(pick("startDate", "start")),
    endDate: toText(pick("endDate", "end")),
    createdAt: toText(pick("createdAt", "createdDate")),
    updatedAt: toText(pick("updatedAt", "updatedDate")),
  };
}

async function getBudget(id: number): Promise<Budget | null> {
  try {
    const response = await instance.get(`/budgets/${id}`, { requiresAuth: true });
    return isRecord(response.data) ? toBudget(response.data) : null;
  } catch {
    return null;
  }
}

export async function getBudgets(): Promise<Budget[]> {
  const response = await instance.get("/budgets", { requiresAuth: true });
  const data = response.data;

  // Tolerate either a raw array or a wrapped list shape.
  const list: unknown[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.budgets)
      ? data.budgets
      : Array.isArray(data?.content)
        ? data.content
        : [];

  const items = list.filter(isRecord).map(toBudget);

  // GET /budgets omits amount fields (only id/title/dates). Fetch each budget's
  // detail (GET /budgets/{id} returns totalAmount/usedAmount) and merge them in.
  return Promise.all(
    items.map(async (item) => (item.id ? ((await getBudget(item.id)) ?? item) : item)),
  );
}

// Creates a budget. Returns 204 No Content — the caller should refetch the list.
export async function createBudget(payload: CreateBudgetRequest): Promise<void> {
  await instance.post("/budgets", payload, { requiresAuth: true });
}
