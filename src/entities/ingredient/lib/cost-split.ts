import { isLocalOrigin, isInSeason } from "./badges";
import type { IngredientItem } from "../model/types";

export interface NamedCostLine {
  ingredientName: string;
  estimatedCost: number;
}

export interface LocalCostSplit {
  totalCost: number;
  localCost: number;
  localCostRate: number; // TASK.md 4.2 지역 농산물 사용률(%)
}

/** 발주 항목(품목명+예상비용)과 실제 재고의 원산지를 결합해 지역 농산물 사용률을 계산. */
export function splitLocalCost(
  lines: NamedCostLine[],
  ingredients: IngredientItem[],
): LocalCostSplit {
  const totalCost = lines.reduce((sum, l) => sum + l.estimatedCost, 0);
  const localCost = lines.reduce((sum, line) => {
    const matched =
      ingredients.find((i) => i.name === line.ingredientName) ??
      ingredients.find(
        (i) => i.name.includes(line.ingredientName) || line.ingredientName.includes(i.name),
      );
    return isLocalOrigin(matched?.origin) ? sum + line.estimatedCost : sum;
  }, 0);

  return {
    totalCost,
    localCost,
    localCostRate: totalCost > 0 ? (localCost / totalCost) * 100 : 0,
  };
}

export interface SeasonalUsageRate {
  usedCount: number;
  seasonalCount: number;
  seasonalRate: number; // TASK.md 4.2 제철 반영률(%)
}

/** 사용된 농산물명 목록 중 제철 품목의 비율 — TASK.md 4.2 제철 반영률 산식. */
export function computeSeasonalUsageRate(ingredientNames: string[], now: Date): SeasonalUsageRate {
  const month = now.getMonth() + 1;
  const uniqueNames = [...new Set(ingredientNames)];
  const seasonalCount = uniqueNames.filter((name) => isInSeason(name, month)).length;

  return {
    usedCount: uniqueNames.length,
    seasonalCount,
    seasonalRate: uniqueNames.length > 0 ? (seasonalCount / uniqueNames.length) * 100 : 0,
  };
}
