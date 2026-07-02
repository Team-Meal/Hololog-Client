import { getStockBadge, type IngredientItem, type StockBadge } from "@/entities/ingredient";
import type { OrderPlanItem } from "@/entities/order-plan";

function matchPlanItem(
  item: IngredientItem,
  planItems: OrderPlanItem[],
): OrderPlanItem | undefined {
  return planItems.find(
    (p) =>
      p.ingredientName === item.name ||
      p.ingredientName.includes(item.name) ||
      item.name.includes(p.ingredientName),
  );
}

/** 현재 발주 계획표에 이 품목이 등장하는지 — "AI 반영여부" 신호. */
export function isReferencedInOrderPlan(item: IngredientItem, planItems: OrderPlanItem[]): boolean {
  return matchPlanItem(item, planItems) !== undefined;
}

/** 발주 계획표상 이 품목이 부족(발주 필요) 상태인지. */
export function needsReorder(item: IngredientItem, planItems: OrderPlanItem[]): boolean {
  const matched = matchPlanItem(item, planItems);
  return matched !== undefined && matched.shortageQuantity > 0;
}

/** 상태 컬럼 뱃지 — 우선순위: 발주 필요 > 부족 > 충분. */
export function getStatusLabel(item: IngredientItem, planItems: OrderPlanItem[]): StockBadge {
  if (needsReorder(item, planItems)) return { label: "발주 필요", tone: "red" };
  return getStockBadge(item) ?? { label: "충분", tone: "zinc" };
}
