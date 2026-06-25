"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  CalendarIcon,
  PackageIcon,
  PageShell,
  ShoppingCartIcon,
  SparklesIcon,
} from "@/shared/ui";
import { roleLabel, useMemberProfile } from "@/entities/member";
import { BudgetSummary } from "@/widgets/budget-summary";
import { StudentSuggestions } from "@/widgets/student-suggestions";
import { TodayMeals } from "@/widgets/today-meals";

export function DashboardPage() {
  const router = useRouter();
  const { profile } = useMemberProfile();
  const greeting = profile
    ? `좋은 아침이에요, ${profile.name} ${roleLabel(profile.role)}님`
    : "좋은 아침이에요";

  return (
    <PageShell
      eyebrow="대시보드"
      title={greeting}
      description="오늘의 배식 현황과 예산을 확인하세요."
      actions={
        <>
          <Button variant="primary" onClick={() => router.push("/meal")}>
            <CalendarIcon size={16} />
            식단 생성
          </Button>
          <Button onClick={() => router.push("/ingredient-plans")}>
            <ShoppingCartIcon size={16} />
            발주 작성
          </Button>
          <Button onClick={() => router.push("/inventory")}>
            <PackageIcon size={16} />
            재고 추가
          </Button>
          <Button onClick={() => router.push("/ai-meal")}>
            <SparklesIcon size={16} />
            AI에게 묻기
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TodayMeals />
        </div>
        <div className="flex flex-col gap-6">
          <BudgetSummary />
          <StudentSuggestions />
        </div>
      </div>
    </PageShell>
  );
}
