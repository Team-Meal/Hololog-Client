"use client";

import { CalendarIcon, SparklesIcon, SurfaceCard } from "@/shared/ui";
import { useGeneratorStore } from "@/features/ai-meal-generator";

export function GeneratedMealPanel() {
  const { status, result } = useGeneratorStore();

  return (
    <SurfaceCard className="flex flex-col overflow-hidden">
      <div className="mb-4 flex items-center gap-2">
        <CalendarIcon size={15} className="text-blue-600" />
        <p className="text-sm font-semibold text-zinc-800">생성 결과</p>
      </div>

      {status === "idle" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <SparklesIcon size={22} className="text-blue-400" />
          </div>
          <div>
            <p className="font-semibold text-zinc-700">조건을 설정하고 식단을 생성하세요</p>
            <p className="mt-1 text-sm text-zinc-400">
              왼쪽에서 예산·선호도·영양 기준을 조정한 뒤 생성 버튼을 누르세요.
            </p>
          </div>
        </div>
      )}

      {status === "loading" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
            <SparklesIcon size={22} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-zinc-700">식단을 생성하고 있어요</p>
            <p className="mt-1 text-sm text-zinc-400">
              재고 · 예산 · 선호도 · 영양 기준을 분석 중...
            </p>
          </div>
          <div className="h-1.5 w-64 overflow-hidden rounded-full bg-blue-100">
            <div className="h-full rounded-full bg-blue-600" />
          </div>
        </div>
      )}

      {status === "done" && result && (
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          {result.error ? (
            <div className="rounded-lg bg-red-50 p-4 text-sm leading-relaxed text-red-600">
              {result.error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Stat label="생성 월" value={result.month || "-"} />
                <Stat label="생성된 식단 수" value={`${result.totalMeals}건`} />
              </div>
              <div className="rounded-lg bg-blue-50 p-3 text-sm leading-relaxed text-blue-700">
                AI가 식단을 생성했어요. 생성된 식단은 ‘식단 관리’에서 확인·수정할 수 있어요.
              </div>
            </>
          )}
        </div>
      )}
    </SurfaceCard>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-50 p-3">
      <p className="text-[11px] text-zinc-500">{label}</p>
      <p className="text-lg font-bold text-zinc-900">{value}</p>
    </div>
  );
}
