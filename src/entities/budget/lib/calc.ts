import type { BudgetCategory } from "../model/types";

/** 집행률(%)을 정수로 반올림해 반환한다. */
export function executionPercent(spent: number, total: number): number {
  return Math.round((spent / total) * 100);
}

export interface DonutArc extends BudgetCategory {
  /** 호의 길이 */
  len: number;
  /** 시작 오프셋 */
  offset: number;
}

/**
 * 카테고리별 집행액을 도넛 차트의 호(arc) 정보로 변환한다.
 * @returns 각 카테고리 호 정보와 원주 길이
 */
export function buildDonutArcs(categories: BudgetCategory[], total: number, radius: number) {
  const circumference = 2 * Math.PI * radius;
  const arcs: DonutArc[] = categories.map((cat, i) => {
    const len = (cat.spent / total) * circumference;
    const offset = categories
      .slice(0, i)
      .reduce((sum, prev) => sum + (prev.spent / total) * circumference, 0);
    return { ...cat, len, offset };
  });

  return { arcs, circumference };
}
