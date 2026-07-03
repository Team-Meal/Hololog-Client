import { daysUntilExpiry, isInSeason, type IngredientItem } from "@/entities/ingredient";
import type { PriceQuote } from "@/entities/price";
import type { RecipeIngredient } from "@/entities/recipe";
import type { GeneratorConditions, ReasonLine, ScoredMenu } from "../model/types";

const EXPIRY_URGENT_DAYS = 5;

function findIngredient(ingredients: IngredientItem[], name: string): IngredientItem | undefined {
  return (
    ingredients.find((i) => i.name === name) ??
    ingredients.find((i) => i.name.includes(name) || name.includes(i.name))
  );
}

interface ScoreMenusParams {
  recipes: RecipeIngredient[];
  conditions: GeneratorConditions;
  ingredients: IngredientItem[];
  priceItems: PriceQuote[];
  month: number;
}

/**
 * 후보 메뉴 풀(레시피)을 실제 조건·재고·가격으로 룰 기반 스코어링한다.
 * preferenceWeight가 "학생 선호" 축의 가중치, 나머지를 4개 축에 균등 배분한다
 * — UI의 선호도 슬라이더가 실제로 점수에 반영되는 것이 시연 포인트다.
 */
export function scoreMenus({
  recipes,
  conditions,
  ingredients,
  priceItems,
  month,
}: ScoreMenusParams): ScoredMenu[] {
  const prefWeight = conditions.preferenceWeight;
  const otherWeight = (100 - prefWeight) / 4;

  return recipes.map((recipe) => {
    const matched = findIngredient(ingredients, recipe.ingredientName);
    const quote = priceItems.find((q) => q.itemName === recipe.ingredientName);
    const reasons: ReasonLine[] = [];

    // 재고활용: 유통기한이 가까울수록 높은 점수 (없으면 0)
    let stockScore = 0;
    if (matched) {
      const days = daysUntilExpiry(matched.expirationDate, new Date());
      if (days !== null) {
        stockScore = Math.max(0, 100 - Math.max(days, 0) * 10);
        if (days <= EXPIRY_URGENT_DAYS) {
          reasons.push({
            source: "학교 재고",
            text: `${recipe.ingredientName} ${matched.quantity}${matched.unit} 유통기한 ${days}일 → ${recipe.menuName}에 우선 반영`,
          });
        }
      }
    }

    // 제철: 제철이면 100, 아니면 0
    const inSeason = isInSeason(recipe.ingredientName, month);
    const seasonalScore = inSeason ? 100 : 0;
    reasons.push({
      source: "농사로 제철",
      text: inSeason
        ? `${recipe.ingredientName}는 ${month}월 제철`
        : `${recipe.ingredientName}는 ${month}월 비제철`,
    });

    // 가격안정: 급등폭이 클수록 낮은 점수
    const priceScore = quote ? Math.max(0, 100 - Math.min(quote.changeRatePercent, 100)) : 50;
    reasons.push({
      source: "KAMIS 가격",
      text: quote
        ? quote.isSpiking
          ? `${recipe.ingredientName} 현재 단가 급등 +${quote.changeRatePercent.toFixed(1)}%`
          : `${recipe.ingredientName} 현재 단가 안정`
        : `${recipe.ingredientName} 가격 정보 없음`,
    });

    // 학생 선호: 사용자가 실제로 입력한 제철 식자재 목록에 매칭될 때만 인정(날조 금지)
    const preferred = conditions.seasonalIngredients.some(
      (ing) => ing.label === recipe.ingredientName,
    );
    const prefScore = preferred ? 100 : 50;
    if (preferred) {
      reasons.push({
        source: "학생 선호",
        text: `${recipe.ingredientName}가 선택한 식자재 목록에 포함됨`,
      });
    }

    // 예산적합: 1인분 비용이 예산 이내면 100, 초과하면 선형 감소
    const perPersonIngredientCost = recipe.perPersonUsage * (quote?.price ?? 0);
    const budgetOk = perPersonIngredientCost <= conditions.budgetPerPerson;
    const budgetScore = budgetOk
      ? 100
      : Math.max(
          0,
          100 -
            ((perPersonIngredientCost - conditions.budgetPerPerson) / conditions.budgetPerPerson) *
              100,
        );
    reasons.push({
      source: "예산 검증",
      text: `1인당 ₩${Math.round(perPersonIngredientCost).toLocaleString("ko-KR")} / 설정 ₩${conditions.budgetPerPerson.toLocaleString("ko-KR")} ${budgetOk ? "이내" : "초과"}`,
    });

    const score =
      (prefWeight * prefScore +
        otherWeight * seasonalScore +
        otherWeight * priceScore +
        otherWeight * stockScore +
        otherWeight * budgetScore) /
      100;

    return { menuName: recipe.menuName, ingredientName: recipe.ingredientName, score, reasons };
  });
}
