import { isInSeason, isLocalOrigin } from "./badges";
import type { IngredientItem } from "../model/types";

export interface CategoryCount {
  category: string;
  count: number;
}

export interface LocalProduceStats {
  month: number; // 기준 월 (1~12)
  total: number; // 전체 품목 수
  seasonalCount: number; // 제철 품목 수
  localCount: number; // 지역(국내산) 품목 수
  seasonalRate: number; // 제철 반영률 (%)
  localRate: number; // 지역농산물 활용률 (%)
  byCategory: CategoryCount[];
  seasonalItems: string[]; // 제철 품목명
  localItems: string[]; // 지역 품목명
}

function rate(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}

/** 현재 재고 목록으로 지역농산물 활용 통계를 계산한다. */
export function computeLocalProduceStats(items: IngredientItem[], now: Date): LocalProduceStats {
  const month = now.getMonth() + 1;
  const seasonalItems = items.filter((i) => isInSeason(i.name, month)).map((i) => i.name);
  const localItems = items.filter((i) => isLocalOrigin(i.origin)).map((i) => i.name);

  const categoryMap = new Map<string, number>();
  for (const item of items) {
    const key = item.category || "기타";
    categoryMap.set(key, (categoryMap.get(key) ?? 0) + 1);
  }
  const byCategory = [...categoryMap.entries()].map(([category, count]) => ({ category, count }));

  return {
    month,
    total: items.length,
    seasonalCount: seasonalItems.length,
    localCount: localItems.length,
    seasonalRate: rate(seasonalItems.length, items.length),
    localRate: rate(localItems.length, items.length),
    byCategory,
    seasonalItems,
    localItems,
  };
}
