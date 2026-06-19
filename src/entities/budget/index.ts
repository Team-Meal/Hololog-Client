export type { AiTip, BudgetCategory, MonthlyPoint } from "./model/types";
export {
  AI_TIPS,
  BUDGET_CATEGORIES,
  BUDGET_SPENT,
  BUDGET_TOTAL,
  MONTHLY_TREND,
} from "./model/mock";
export { buildDonutArcs, executionPercent } from "./lib/calc";
export { BudgetKpiCards } from "./ui/BudgetKpiCards";
export { CategoryBudgetBars } from "./ui/CategoryBudgetBars";
export { MonthlyTrendCard } from "./ui/MonthlyTrendCard";
export { ExecutionDonut } from "./ui/ExecutionDonut";
export { AiBudgetTips } from "./ui/AiBudgetTips";
