import type { IngredientItem } from "../model/types";
import type { BadgeTone } from "./badges";

export interface StockBadge {
  label: string;
  tone: BadgeTone;
}

// 품목별 최소 재고 기준(kg 단위 가정) — SEASON_TABLE과 동일한 키워드 매칭 스타일.
// 단위 정규화는 하지 않는다(예: L·개 단위 품목도 동일 수치 기준 적용) — MVP 한계.
const SAFETY_STOCK_OVERRIDES: Array<{ keywords: string[]; threshold: number }> = [
  { keywords: ["감자", "당근", "양파", "배추", "무"], threshold: 10 },
  { keywords: ["오이", "토마토", "대파", "수박"], threshold: 6 },
];

const CATEGORY_DEFAULT_THRESHOLD: Record<string, number> = {
  곡물: 10,
  농산물: 8,
  축산: 5,
  수산: 5,
  가공: 6,
};
const DEFAULT_THRESHOLD = 5;

/** 카테고리/품목별 최소 재고 기준(kg) — 질의응답 방어용 단순 규칙. */
export function getSafetyStock(item: IngredientItem): number {
  const override = SAFETY_STOCK_OVERRIDES.find((entry) =>
    entry.keywords.some((k) => item.name.includes(k)),
  );
  if (override) return override.threshold;
  return CATEGORY_DEFAULT_THRESHOLD[item.category] ?? DEFAULT_THRESHOLD;
}

/** 재고 수량과 최소 재고 기준을 비교해 부족/충분 뱃지를 산출(0 이하는 발주 필요로 별도 처리). */
export function getStockBadge(item: IngredientItem): StockBadge | null {
  if (item.quantity <= 0) return null;
  const threshold = getSafetyStock(item);
  return item.quantity < threshold
    ? { label: "부족", tone: "amber" }
    : { label: "충분", tone: "zinc" };
}
