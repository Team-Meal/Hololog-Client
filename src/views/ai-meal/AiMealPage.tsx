import { ConditionsPanel, ActionBar } from "@/features/ai-meal-generator";
import { GeneratedMealPanel, EvaluationPanel } from "@/widgets/ai-meal-result";

export function AiMealPage() {
  return (
    <div className="flex h-full flex-col gap-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-medium text-blue-600">AI 식단 생성</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">AI 식단 생성기</h1>
          <p className="mt-1 text-sm text-gray-500">
            재고·예산·선호도·영양 기준을 입력하면 호로록 AI가 한 달 식단을 설계해요.
          </p>
        </div>
        <ActionBar />
      </div>

      {/* Three-panel grid */}
      <div className="grid min-h-0 flex-1 grid-cols-[300px_1fr_270px] gap-4 overflow-hidden">
        <ConditionsPanel />
        <GeneratedMealPanel />
        <EvaluationPanel />
      </div>
    </div>
  );
}
