import {
  daysUntilExpiry,
  EXPIRY_SOON_DAYS,
  splitLocalCost,
  computeSeasonalUsageRate,
  computeLocalProduceStats,
  type IngredientItem,
} from "@/entities/ingredient";
import type { OrderPlanItem } from "@/entities/order-plan";
import { totalSubstitutionSavings, type PriceQuote } from "@/entities/price";

export interface DashboardMetrics {
  localUsageRatePercent: number;
  localUsageBasis: "발주 기준" | "재고 기준";
  seasonalRatePercent: number;
  seasonalRateBasis: "발주 기준" | "재고 기준";
  expiringSoonCount: number;
  localOrderCost: number; // 지역 농가 발주 예정액
  substitutionSavings: number | null; // null이면 가격 데이터 미연동
}

export function computeDashboardMetrics(
  ingredients: IngredientItem[],
  orderPlanItems: OrderPlanItem[],
  priceItems: PriceQuote[],
  now: Date,
): DashboardMetrics {
  const costLines = orderPlanItems.map((i) => ({
    ingredientName: i.ingredientName,
    estimatedCost: i.estimatedCost,
  }));

  const hasOrderPlan = orderPlanItems.length > 0;
  const localSplit = splitLocalCost(costLines, ingredients);

  const seasonal = hasOrderPlan
    ? computeSeasonalUsageRate(
        orderPlanItems.map((i) => i.ingredientName),
        now,
      )
    : { seasonalRate: computeLocalProduceStats(ingredients, now).seasonalRate };

  const expiringSoonCount = ingredients.filter((item) => {
    const days = daysUntilExpiry(item.expirationDate, now);
    return days !== null && days <= EXPIRY_SOON_DAYS;
  }).length;

  const lines = orderPlanItems.map((i) => ({
    ingredientName: i.ingredientName,
    quantity: i.orderQuantity,
    unitPrice: i.unitPrice,
  }));

  return {
    localUsageRatePercent: localSplit.localCostRate,
    localUsageBasis: hasOrderPlan ? "발주 기준" : "재고 기준",
    seasonalRatePercent: seasonal.seasonalRate,
    seasonalRateBasis: hasOrderPlan ? "발주 기준" : "재고 기준",
    expiringSoonCount,
    localOrderCost: localSplit.localCost,
    substitutionSavings: priceItems.length > 0 ? totalSubstitutionSavings(lines, priceItems) : null,
  };
}
