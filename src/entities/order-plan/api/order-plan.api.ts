import { instance } from "@/shared/api";
import type { OrderPlanSummary, OrderPlanDetail, OrderPlanItem } from "../model/types";

function num(value: unknown): number {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) ? n : 0;
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function pick(raw: Record<string, unknown>, ...keys: string[]): unknown {
  return keys.map((key) => raw[key]).find((value) => value !== undefined);
}

function toSummary(raw: Record<string, unknown>): OrderPlanSummary {
  return {
    id: num(pick(raw, "id", "orderPlanId")),
    title: str(pick(raw, "title")),
    planDate: str(pick(raw, "planDate", "date")),
    studentCount: num(pick(raw, "studentCount", "personCount")),
    createdAt: str(pick(raw, "createdAt", "createdDate")),
  };
}

function toItem(raw: Record<string, unknown>): OrderPlanItem {
  return {
    id: num(pick(raw, "id", "itemId")),
    menuName: str(pick(raw, "menuName", "menu")),
    ingredientName: str(pick(raw, "ingredientName", "ingredient")),
    unit: str(pick(raw, "unit")),
    requiredQuantity: num(pick(raw, "requiredQuantity")),
    currentStock: num(pick(raw, "currentStock", "stock")),
    shortageQuantity: num(pick(raw, "shortageQuantity", "shortage")),
    orderQuantity: num(pick(raw, "orderQuantity")),
    supplierName: str(pick(raw, "supplierName", "supplier")),
    unitPrice: num(pick(raw, "unitPrice", "price")),
    estimatedCost: num(pick(raw, "estimatedCost", "cost")),
    basis: str(pick(raw, "basis")),
  };
}

function toDetail(raw: Record<string, unknown>): OrderPlanDetail {
  const rawItems = raw.items;
  const items = Array.isArray(rawItems) ? rawItems.filter(isRecord).map(toItem) : [];
  // totalEstimatedCost가 응답에 없으면 항목 예상비용 합으로 대체
  const totalFromServer = pick(raw, "totalEstimatedCost", "totalCost");
  const total =
    totalFromServer !== undefined
      ? num(totalFromServer)
      : items.reduce((sum, item) => sum + item.estimatedCost, 0);

  return {
    id: num(pick(raw, "id", "orderPlanId")),
    title: str(pick(raw, "title")),
    planDate: str(pick(raw, "planDate", "date")),
    studentCount: num(pick(raw, "studentCount", "personCount")),
    memo: str(pick(raw, "memo")),
    totalEstimatedCost: total,
    items,
    createdAt: str(pick(raw, "createdAt", "createdDate")),
    updatedAt: str(pick(raw, "updatedAt", "updatedDate")),
  };
}

export async function getOrderPlans(): Promise<OrderPlanSummary[]> {
  const response = await instance.get("/order-plans", { requiresAuth: true });
  const data = response.data;
  const list: unknown[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.orderPlans)
      ? data.orderPlans
      : Array.isArray(data?.content)
        ? data.content
        : [];
  return list.filter(isRecord).map(toSummary);
}

export async function getOrderPlanById(orderPlanId: number): Promise<OrderPlanDetail> {
  const response = await instance.get(`/order-plans/${orderPlanId}`, { requiresAuth: true });
  if (!isRecord(response.data)) {
    throw new Error("발주 계획 응답 형식이 올바르지 않습니다.");
  }
  return toDetail(response.data);
}
