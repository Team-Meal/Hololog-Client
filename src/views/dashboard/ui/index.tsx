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
import { DashboardMetricCards } from "@/widgets/dashboard-metrics";
import { AiMealBanner } from "./AiMealBanner";
import { WhatsNewSection } from "./WhatsNewSection";

export function DashboardPage() {
  const router = useRouter();
  const { profile } = useMemberProfile();
  const greeting = profile
    ? `안녕하세요, ${profile.name} ${roleLabel(profile.role)}님`
    : "안녕하세요";

  return (
    <PageShell
      eyebrow="대시보드"
      title={greeting}
      description="오늘의 배식 현황과 예산을 한눈에 확인하고, 자주 쓰는 작업을 바로 시작하세요."
      actions={
        <>
          <Button
            variant="primary"
            className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 active:from-violet-700 active:to-blue-700"
            onClick={() => router.push("/ai-meal")}
          >
            <SparklesIcon size={16} />
            AI 식단 생성
          </Button>
          <Button onClick={() => router.push("/meal")}>
            <CalendarIcon size={16} />
            식단 관리
          </Button>
          <Button onClick={() => router.push("/ingredient-plans")}>
            <ShoppingCartIcon size={16} />
            발주 작성
          </Button>
          <Button onClick={() => router.push("/inventory")}>
            <PackageIcon size={16} />
            재고 추가
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <AiMealBanner />

        <DashboardMetricCards />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TodayMeals />
          </div>
          <div className="flex flex-col gap-6">
            <BudgetSummary />
            <StudentSuggestions />
          </div>
        </div>

        <WhatsNewSection />
      </div>
    </PageShell>
  );
}
