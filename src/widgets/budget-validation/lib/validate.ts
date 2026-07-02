import type { Budget } from "@/entities/budget";

export type BudgetVerdict = "within" | "warning" | "over";

export interface BudgetValidationResult {
  total: number; // 예산 총액
  used: number; // 기집행액
  orderCost: number; // 이번 발주 예상비용
  projectedUsed: number; // 발주 후 누계 (기집행 + 발주비)
  remaining: number; // 잔여 (총액 - 누계). 음수면 초과
  usageRatio: number; // 누계 / 총액
  verdict: BudgetVerdict;
}

/** 이 비율 이상이면 '임박' 경고 */
export const WARNING_THRESHOLD = 0.9;

/**
 * 발주 예상비용을 현재 예산에 반영했을 때의 검증 결과를 계산.
 * - over: 잔여가 음수 (예산 초과)
 * - warning: 초과는 아니나 누계가 총액의 WARNING_THRESHOLD 이상
 * - within: 여유 있음
 */
export function validateOrderAgainstBudget(
  budget: Budget,
  orderCost: number,
): BudgetValidationResult {
  const total = budget.totalAmount;
  const used = budget.usedAmount;
  const projectedUsed = used + orderCost;
  const remaining = total - projectedUsed;
  const usageRatio = total > 0 ? projectedUsed / total : projectedUsed > 0 ? Infinity : 0;

  let verdict: BudgetVerdict;
  if (remaining < 0) verdict = "over";
  else if (usageRatio >= WARNING_THRESHOLD) verdict = "warning";
  else verdict = "within";

  return { total, used, orderCost, projectedUsed, remaining, usageRatio, verdict };
}
