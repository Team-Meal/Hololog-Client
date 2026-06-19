import { PageShell } from "@/shared/ui";
import { ConditionsPanel, ActionBar } from "@/features/ai-meal-generator";
import { GeneratedMealPanel, EvaluationPanel } from "@/widgets/ai-meal-result";

export function AiMealPage() {
  return (
    <PageShell
      eyebrow="AI 식단 생성"
      title="AI 식단 생성기"
      description="재고·예산·선호도·영양 기준을 입력하면 AI가 한 달 식단을 설계해요."
      actions={<ActionBar />}
    >
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[300px_1fr_270px]">
        <ConditionsPanel />
        <GeneratedMealPanel />
        <EvaluationPanel />
      </div>
    </PageShell>
  );
}
