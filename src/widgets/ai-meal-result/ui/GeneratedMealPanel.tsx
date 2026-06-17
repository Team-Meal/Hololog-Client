"use client";

import { useState } from "react";
import { CalendarDays, Sparkles } from "lucide-react";
import { useGeneratorStore } from "@/features/ai-meal-generator";
import type { WeekPlan } from "@/features/ai-meal-generator";

const DAY_LABELS: Record<string, string> = {
  월: "월요일",
  화: "화요일",
  수: "수요일",
  목: "목요일",
  금: "금요일",
};

function WeekView({ plan }: { plan: WeekPlan }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-gray-400">{plan.week}주차</p>
      <div className="grid grid-cols-5 gap-2">
        {plan.days.map((day) => (
          <div key={day.day} className="rounded-lg border border-gray-100 bg-gray-50 p-2.5">
            <p className="mb-1 text-xs font-medium text-gray-400">{DAY_LABELS[day.day]}</p>
            <p className="text-sm font-semibold text-gray-900">{day.main}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-gray-400">
              {day.sides.join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GeneratedMealPanel() {
  const { status, result } = useGeneratorStore();
  const [showAllWeeks, setShowAllWeeks] = useState(false);

  const weeks = result?.weeks ?? [];
  const displayedWeeks = showAllWeeks ? weeks : weeks.slice(0, 1);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays size={15} className="text-blue-600" />
          <p className="text-sm font-semibold text-gray-800">생성된 한 달 식단</p>
        </div>
        {status === "done" && (
          <button
            type="button"
            onClick={() => setShowAllWeeks((v) => !v)}
            className="text-xs text-gray-400 transition-colors hover:text-gray-600"
          >
            {showAllWeeks ? "1주차만 보기" : "전체 4주 보기"}
          </button>
        )}
      </div>

      {status === "idle" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <Sparkles size={22} className="text-blue-400" />
          </div>
          <div>
            <p className="font-semibold text-gray-700">조건을 설정하고 식단을 생성하세요</p>
            <p className="mt-1 text-sm text-gray-400">
              왼쪽에서 예산·선호도·영양 기준을 조정한 뒤 생성 버튼을 누르세요.
            </p>
          </div>
        </div>
      )}

      {status === "loading" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
            <Sparkles size={22} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-700">식단을 생성하고 있어요</p>
            <p className="mt-1 text-sm text-gray-400">
              재고 · 예산 · 선호도 · 영양 기준을 분석 중...
            </p>
          </div>
          <div className="h-1.5 w-64 overflow-hidden rounded-full bg-blue-100">
            <div className="h-full animate-[progress-slide_1.5s_linear_infinite] rounded-full bg-blue-600" />
          </div>
        </div>
      )}

      {status === "done" && result && (
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          {displayedWeeks.map((week) => (
            <WeekView key={week.week} plan={week} />
          ))}
        </div>
      )}
    </div>
  );
}
