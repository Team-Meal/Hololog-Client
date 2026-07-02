import type { OrderPlanItem } from "../model/types";

// 발주 자동계산 — TASK.md 3.3 / 6.3의 공식을 그대로 구현한 순수 함수.
// 다른 엔티티를 전혀 import하지 않고, 필요한 값은 전부 콜백으로 주입받는다
// (재고/가격/근거를 어디서 가져오는지는 이 파일의 관심사가 아니다).
//
//   필요량   = 1인 사용량 × 급식 인원
//   부족량   = max(필요량 − 현재 재고, 0)
//   발주량   = 부족량 × 1.05            (safetyFactor, 기본 5% 안전계수)
//   예상비용 = 발주량 × 단가

export const DEFAULT_SAFETY_FACTOR = 1.05;

export interface OrderPlanCalcRecipe {
  menuName: string;
  ingredientName: string;
  unit: string;
  perPersonUsage: number;
  supplierName: string;
}

export interface OrderPlanCalcPrice {
  unitPrice: number;
}

export interface OrderPlanBasisContext {
  recipe: OrderPlanCalcRecipe;
  requiredQuantity: number;
  currentStock: number;
  shortageQuantity: number;
  orderQuantity: number;
}

export interface ComputeOrderPlanItemsParams {
  recipes: OrderPlanCalcRecipe[];
  studentCount: number;
  getStock: (ingredientName: string) => number;
  getPrice: (ingredientName: string) => OrderPlanCalcPrice | undefined;
  getBasis: (ctx: OrderPlanBasisContext) => string;
  safetyFactor?: number;
}

export function computeOrderPlanItems(params: ComputeOrderPlanItemsParams): OrderPlanItem[] {
  const {
    recipes,
    studentCount,
    getStock,
    getPrice,
    getBasis,
    safetyFactor = DEFAULT_SAFETY_FACTOR,
  } = params;

  return recipes.map((recipe, index) => {
    const requiredQuantity = recipe.perPersonUsage * studentCount;
    const currentStock = getStock(recipe.ingredientName);
    const shortageQuantity = Math.max(requiredQuantity - currentStock, 0);
    const orderQuantity = shortageQuantity * safetyFactor;
    const unitPrice = getPrice(recipe.ingredientName)?.unitPrice ?? 0;
    const estimatedCost = orderQuantity * unitPrice;
    const basis = getBasis({
      recipe,
      requiredQuantity,
      currentStock,
      shortageQuantity,
      orderQuantity,
    });

    return {
      id: index + 1,
      menuName: recipe.menuName,
      ingredientName: recipe.ingredientName,
      unit: recipe.unit,
      requiredQuantity,
      currentStock,
      shortageQuantity,
      orderQuantity,
      supplierName: recipe.supplierName,
      unitPrice,
      estimatedCost,
      basis,
    };
  });
}
