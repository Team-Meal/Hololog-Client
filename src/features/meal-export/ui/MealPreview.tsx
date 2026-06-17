"use client";

import { MOCK_MEAL_SCHEDULE } from "@/entities/meal";
import { EyeIcon } from "@/shared/ui";
import { useExportStore } from "../model/export.store";

export function MealPreview() {
  const { previewMode, setPreviewMode } = useExportStore();
  const schedule = MOCK_MEAL_SCHEDULE;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EyeIcon size={15} className="text-blue-500" />
          <span className="text-sm font-semibold text-gray-800">실시간 미리보기</span>
        </div>
        <div className="flex rounded-lg bg-gray-100 p-0.5">
          {(["screen", "print"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setPreviewMode(mode)}
              className={[
                "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                previewMode === mode
                  ? "bg-white text-gray-800"
                  : "text-gray-500 hover:text-gray-700",
              ].join(" ")}
            >
              {mode === "screen" ? "화면" : "인쇄 모드"}
            </button>
          ))}
        </div>
      </div>

      <div
        className={[
          "flex flex-1 items-start justify-center overflow-auto rounded-xl p-6",
          previewMode === "screen" ? "bg-gray-100" : "bg-gray-200",
        ].join(" ")}
      >
        <div className="w-full max-w-2xl rounded-lg bg-white">
          <OfficialMealDocument schedule={schedule} mode={previewMode} />
        </div>
      </div>
    </div>
  );
}

import type { WeeklyMealSchedule, PreviewMode } from "@/entities/meal";

function OfficialMealDocument({
  schedule,
  mode,
}: {
  schedule: WeeklyMealSchedule;
  mode: PreviewMode;
}) {
  return (
    <div className={["p-8 font-sans", mode === "print" ? "text-black" : "text-gray-900"].join(" ")}>
      <div className="mb-6 text-center">
        <h1 className="mb-1 text-2xl font-bold tracking-tight">{schedule.month}월 급식 식단표</h1>
        <p className="text-sm text-gray-500">
          {schedule.schoolName} · {schedule.districtName}
        </p>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {schedule.days.map((day) => (
              <th
                key={day.dayOfWeek}
                className="border-b border-gray-200 px-3 py-2.5 text-center text-xs font-semibold text-gray-600"
              >
                {day.dayOfWeek}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {schedule.days.map((day) => (
              <td
                key={day.date}
                className="border-r border-gray-100 px-3 py-4 align-top last:border-r-0"
              >
                <p className="mb-2 text-center text-sm font-bold text-gray-800">{day.date}</p>
                <ul className="space-y-1">
                  {(() => {
                    const lunch = day.meals.find((m) => m.type === "중식");
                    if (!lunch) return null;
                    return [lunch.name, ...lunch.sides].map((item, i) => (
                      <li key={i} className="text-center text-xs leading-relaxed text-gray-600">
                        {item}
                      </li>
                    ));
                  })()}
                </ul>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <div className="mt-6 flex items-center justify-end gap-8 text-xs text-gray-500">
        <span>
          영양교사 {schedule.nutritionistName} <span className="ml-1 text-gray-300">(인)</span>
        </span>
        <span>
          학교장 <span className="ml-1 text-gray-300">(인)</span>
        </span>
      </div>
    </div>
  );
}
