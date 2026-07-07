import { perPersonCost, localUsageRatio } from "@/entities/budget";
import { isLocalOrigin, type IngredientItem } from "@/entities/ingredient";
import type { OrderPlanItem } from "@/entities/order-plan";

export interface BudgetKpis {
  perPersonCost: number;
  localUsageRatioPercent: number;
}

/** 발주표 항목 + 실제 재고의 원산지 정보를 결합해 TASK.md 4.2 KPI를 계산한다. */
export function buildBudgetKpis(
  items: OrderPlanItem[],
  studentCount: number,
  ingredients: IngredientItem[],
): BudgetKpis {
  const totalCost = items.reduce((sum, i) => sum + i.estimatedCost, 0);

  const entries = items.map((item) => {
    const matched = ingredients.find(
      (ing) => ing.name === item.ingredientName || ing.name.includes(item.ingredientName),
    );
    return { estimatedCost: item.estimatedCost, isLocal: isLocalOrigin(matched?.origin) };
  });

  return {
    perPersonCost: perPersonCost(totalCost, studentCount),
    localUsageRatioPercent: localUsageRatio(entries),
  };
}
