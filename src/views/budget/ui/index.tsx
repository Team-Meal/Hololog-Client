import {
  AI_TIPS,
  AiBudgetTips,
  BUDGET_CATEGORIES,
  BUDGET_SPENT,
  BUDGET_TOTAL,
  BudgetKpiCards,
  CategoryBudgetBars,
  ExecutionDonut,
  MONTHLY_TREND,
  MonthlyTrendCard,
} from "@/entities/budget";
import { Button, DownloadIcon, PageShell } from "@/shared/ui";

export function BudgetPage() {
  return (
    <PageShell
      eyebrow="예산 관리"
      title="예산 현황 · 2026년 6월"
      description="월 식자재 예산의 집행 현황과 카테고리별 배분을 한눈에 확인하세요."
      actions={
        <Button variant="secondary" size="md">
          <DownloadIcon size={16} />
          리포트 내보내기
        </Button>
      }
    >
      <BudgetKpiCards total={BUDGET_TOTAL} spent={BUDGET_SPENT} period="2026년 6월" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <CategoryBudgetBars categories={BUDGET_CATEGORIES} />
          <MonthlyTrendCard trend={MONTHLY_TREND} />
        </div>

        <div className="flex flex-col gap-6">
          <ExecutionDonut categories={BUDGET_CATEGORIES} total={BUDGET_TOTAL} />
          <AiBudgetTips tips={AI_TIPS} />
        </div>
      </div>
    </PageShell>
  );
}
