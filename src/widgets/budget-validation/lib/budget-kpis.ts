import { perPersonCost, localUsageRatio } from "@/entities/budget";
import { isLocalOrigin, type IngredientItem } from "@/entities/ingredient";
import type { OrderPlanItem } from "@/entities/order-plan";
import {
  computeSubstitutionSavings,
  totalSubstitutionSavings,
  type PriceQuote,
  type SubstitutionSaving,
} from "@/entities/price";

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

export interface SpikeSubstitutionSummary {
  substitutions: SubstitutionSaving[];
  totalSavings: number;
}

/** 발주표 항목 중 가격 급등 품목에 대한 대체 추천/절감액 — entities/price의 순수함수 재사용. */
export function buildSpikeSubstitutions(
  priceQuotes: PriceQuote[],
  items: OrderPlanItem[],
): SpikeSubstitutionSummary {
  const lines = items.map((item) => ({
    ingredientName: item.ingredientName,
    quantity: item.orderQuantity,
    unitPrice: item.unitPrice,
  }));

  return {
    substitutions: computeSubstitutionSavings(lines, priceQuotes),
    totalSavings: totalSubstitutionSavings(lines, priceQuotes),
  };
}
