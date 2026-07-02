import {
  computeOrderPlanItems,
  type OrderPlanDetail,
  type OrderPlanBasisContext,
} from "@/entities/order-plan";
import { DEMO_RECIPES } from "@/entities/recipe";
import {
  isInSeason,
  daysUntilExpiry,
  EXPIRY_SOON_DAYS,
  type IngredientItem,
} from "@/entities/ingredient";
import { getSubstitutes, type PriceQuote } from "@/entities/price";

// report-export는 features/order-plan-calc(형제 feature)를 import할 수 없으므로,
// 같은 entities/order-plan의 computeOrderPlanItems만 재사용하고 "어디서 재고/가격을
// 가져올지" 연결 코드는 여기서 독립적으로 다시 구성한다(계산식 자체는 중복되지 않음).
export function buildOrderPlanDetail(
  studentCount: number,
  ingredients: IngredientItem[],
  priceItems: PriceQuote[],
): OrderPlanDetail {
  const month = new Date().getMonth() + 1;

  const getStock = (ingredientName: string): number => {
    const matched =
      ingredients.find((i) => i.name === ingredientName) ??
      ingredients.find((i) => i.name.includes(ingredientName) || ingredientName.includes(i.name));
    return matched?.quantity ?? 0;
  };

  const getPrice = (ingredientName: string) => {
    const quote = priceItems.find((q) => q.itemName === ingredientName);
    return quote ? { unitPrice: quote.price } : undefined;
  };

  const getBasis = (ctx: OrderPlanBasisContext): string => {
    const matched =
      ingredients.find((i) => i.name === ctx.recipe.ingredientName) ??
      ingredients.find(
        (i) =>
          i.name.includes(ctx.recipe.ingredientName) || ctx.recipe.ingredientName.includes(i.name),
      );
    const days = matched ? daysUntilExpiry(matched.expirationDate, new Date()) : null;
    if (days !== null && days <= EXPIRY_SOON_DAYS) return "유통기한 임박 재고 우선";

    if (isInSeason(ctx.recipe.ingredientName, month)) return `${month}월 제철`;

    const quote = priceItems.find((q) => q.itemName === ctx.recipe.ingredientName);
    if (quote?.isSpiking) {
      const substitutes = getSubstitutes(ctx.recipe.ingredientName);
      return substitutes.length > 0
        ? `KAMIS 가격 급등 — ${substitutes.join("·")} 대체 검토`
        : "KAMIS 가격 급등";
    }

    return ctx.orderQuantity === 0 ? "재고 충분" : "발주 필요";
  };

  const calcRecipes = DEMO_RECIPES.map((r) => ({ ...r, supplierName: r.defaultSupplierName }));
  const items = computeOrderPlanItems({
    recipes: calcRecipes,
    studentCount,
    getStock,
    getPrice,
    getBasis,
  });

  const now = new Date().toISOString();
  return {
    id: 0,
    title: "농산물 발주 계획표",
    planDate: now.slice(0, 10),
    studentCount,
    memo: "",
    totalEstimatedCost: items.reduce((sum, i) => sum + i.estimatedCost, 0),
    items,
    createdAt: now,
    updatedAt: now,
  };
}
