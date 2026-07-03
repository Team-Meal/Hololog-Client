import { isInSeason, isLocalOrigin, type IngredientItem } from "@/entities/ingredient";
import type { PriceQuote } from "@/entities/price";
import type { RecipeIngredient } from "@/entities/recipe";
import type { GeneratorConditions, MealResultMetrics, ScoredMenu } from "../model/types";

// 실제 폐기 이력 데이터가 아직 없어 사용하는 가정값 — 이력 데이터가 쌓이면 교체한다.
const ASSUMED_BASELINE_WASTE_RATE = 0.12;
const ASSUMED_SERVING_KG_PER_PERSON = 0.5;
const DEFAULT_TOP_N = 5;

function findIngredient(ingredients: IngredientItem[], name: string): IngredientItem | undefined {
  return (
    ingredients.find((i) => i.name === name) ??
    ingredients.find((i) => i.name.includes(name) || name.includes(i.name))
  );
}

function findRecipe(
  recipes: RecipeIngredient[],
  menuName: string,
  ingredientName: string,
): RecipeIngredient | undefined {
  return recipes.find((r) => r.menuName === menuName && r.ingredientName === ingredientName);
}

interface ComputeMetricsParams {
  scoredMenus: ScoredMenu[];
  recipes: RecipeIngredient[];
  conditions: GeneratorConditions;
  ingredients: IngredientItem[];
  priceItems: PriceQuote[];
  month: number;
  studentCount: number;
  topN?: number;
}

/** 상위 N개 후보 메뉴를 기준으로 TASK.md 3.2 결과 지표를 계산(예상 발주비 제외 — widget에서 채운다). */
export function computeMealResultMetrics({
  scoredMenus,
  recipes,
  conditions,
  ingredients,
  priceItems,
  month,
  studentCount,
  topN = DEFAULT_TOP_N,
}: ComputeMetricsParams): Omit<MealResultMetrics, "estimatedOrderCost"> {
  const top = [...scoredMenus].sort((a, b) => b.score - a.score).slice(0, topN);

  if (top.length === 0) {
    return {
      localUsageRatePercent: 0,
      seasonalRatePercent: 0,
      perPersonCost: 0,
      estimatedWasteReductionKg: 0,
      nutritionMatchRatio: 0,
    };
  }

  const localCount = top.filter((m) =>
    isLocalOrigin(findIngredient(ingredients, m.ingredientName)?.origin),
  ).length;
  const seasonalCount = top.filter((m) => isInSeason(m.ingredientName, month)).length;

  const perPersonCost = top.reduce((sum, m) => {
    const recipe = findRecipe(recipes, m.menuName, m.ingredientName);
    const quote = priceItems.find((q) => q.itemName === m.ingredientName);
    return sum + (recipe?.perPersonUsage ?? 0) * (quote?.price ?? 0);
  }, 0);

  const avgScore = top.reduce((sum, m) => sum + m.score, 0) / top.length;
  const wasteReductionFactor = (avgScore / 100) * 0.5; // 점수가 높을수록 최대 50%까지 폐기율 감소
  const estimatedWasteReductionKg =
    ASSUMED_BASELINE_WASTE_RATE *
    wasteReductionFactor *
    ASSUMED_SERVING_KG_PER_PERSON *
    studentCount;

  const nutritionCriteriaLabels = conditions.nutritionCriteria.map((c) => c.label);
  const nutritionMatchRatio =
    nutritionCriteriaLabels.length === 0
      ? 100
      : (top.filter((m) => {
          const recipe = findRecipe(recipes, m.menuName, m.ingredientName);
          return recipe?.nutritionTags?.some((tag) => nutritionCriteriaLabels.includes(tag));
        }).length /
          top.length) *
        100;

  return {
    localUsageRatePercent: (localCount / top.length) * 100,
    seasonalRatePercent: (seasonalCount / top.length) * 100,
    perPersonCost,
    estimatedWasteReductionKg,
    nutritionMatchRatio,
  };
}
