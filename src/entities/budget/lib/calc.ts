import type { Budget } from "../model/types";

/** 집행률(%)을 정수로 반올림해 반환한다. 총액이 0 이하면 0을 반환한다. */
export function executionPercent(spent: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((spent / total) * 100);
}

/**
 * 오늘 날짜가 기간에 포함되는 예산을 고르고, 없으면 종료일이 가장 늦은 예산을 반환한다.
 */
export function selectActiveBudget(budgets: Budget[]): Budget | null {
  if (budgets.length === 0) return null;

  const now = Date.now();
  const current = budgets.find((budget) => {
    const start = new Date(budget.startDate).getTime();
    const end = new Date(budget.endDate).getTime();
    return start <= now && now <= end;
  });
  if (current) return current;

  return [...budgets].sort(
    (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
  )[0];
}
