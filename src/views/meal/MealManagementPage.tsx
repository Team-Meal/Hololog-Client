"use client";

import { Button, CopyIcon, PageShell, SparklesIcon } from "@/shared/ui";
import { toast } from "sonner";
import { MealCalendar } from "@/widgets/meal-calendar";

export function MealManagementPage() {
  const handleCopyWeek = () => {
    toast.success("주 복사", {
      description: "1주차 식단을 다음 주로 복사했어요.",
    });
  };

  return (
    <PageShell
      eyebrow="식단 관리"
      title="월간 식단표"
      description="한 달 식단을 끌어다 놓아 손쉽게 조정하고, AI로 빈 칸을 채우세요."
      actions={
        <>
          <Button variant="secondary" onClick={handleCopyWeek}>
            <CopyIcon size={14} />
            주 복사
          </Button>
          <Button variant="primary">
            <SparklesIcon size={14} />
            AI 자동 채우기
          </Button>
        </>
      }
    >
      <MealCalendar />
    </PageShell>
  );
}
