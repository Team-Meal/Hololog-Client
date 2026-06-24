"use client";

import {
  Button,
  CalendarIcon,
  PackageIcon,
  PageShell,
  ShoppingCartIcon,
  SparklesIcon,
} from "@/shared/ui";
import { roleLabel, useMemberProfile } from "@/entities/member";
import { AiInsights } from "@/widgets/ai-insights";
import { BudgetSummary } from "@/widgets/budget-summary";
import { LowStock } from "@/widgets/low-stock";
import { StatCards } from "@/widgets/stat-cards";
import { TodayMeals } from "@/widgets/today-meals";

export function DashboardPage() {
  const { profile } = useMemberProfile();
  const greeting = profile
    ? `좋은 아침이에요, ${profile.name} ${roleLabel(profile.role)}님`
    : "좋은 아침이에요";

  return (
    <PageShell
      eyebrow="대시보드"
      title={greeting}
      description="오늘은 4회 배식이 예정되어 있고, AI가 재고와 예산 흐름에서 확인할 항목을 정리했습니다."
      actions={
        <>
          <Button variant="primary">
            <CalendarIcon size={16} />
            식단 생성
          </Button>
          <Button>
            <ShoppingCartIcon size={16} />
            발주 작성
          </Button>
          <Button>
            <PackageIcon size={16} />
            재고 추가
          </Button>
          <Button>
            <SparklesIcon size={16} />
            AI에게 묻기
          </Button>
        </>
      }
    >
      <StatCards />
      <AiInsights />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TodayMeals />
        </div>
        <div className="flex flex-col gap-6">
          <BudgetSummary />
          <LowStock />
        </div>
      </div>
    </PageShell>
  );
}
