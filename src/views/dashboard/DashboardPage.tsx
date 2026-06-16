import { Button, CalendarIcon, ShoppingCartIcon, PackageIcon, SparklesIcon } from "@/shared/ui";
import { StatCards } from "@/widgets/stat-cards";
import { AiInsights } from "@/widgets/ai-insights";
import { TodayMeals } from "@/widgets/today-meals";
import { BudgetSummary } from "@/widgets/budget-summary";
import { LowStock } from "@/widgets/low-stock";

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            좋은 아침이에요, 박지윤 영양교사님
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            2026년 6월 12일 금요일 · 오늘은 4회 배식이 예정되어 있어요.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary">
            <CalendarIcon size={16} />
            식단 생성
          </Button>
          <Button variant="secondary">
            <ShoppingCartIcon size={16} />
            발주서 작성
          </Button>
          <Button variant="secondary">
            <PackageIcon size={16} />
            재고 추가
          </Button>
          <Button variant="secondary">
            <SparklesIcon size={16} />
            AI에게 묻기
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <StatCards />

      {/* AI insights */}
      <AiInsights />

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TodayMeals />
        </div>
        <div className="flex flex-col gap-6">
          <BudgetSummary />
          <LowStock />
        </div>
      </div>
    </div>
  );
}
