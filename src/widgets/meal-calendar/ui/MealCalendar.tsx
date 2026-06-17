"use client";

import { ShieldCheck } from "lucide-react";
import { MOCK_WEEKLY_SCHEDULES } from "@/entities/meal";
import type { DayOfWeek, WeeklyMealSchedule } from "@/entities/meal";
import { useMealCalendarStore } from "../model/meal-calendar.store";
import { MealDayCard } from "./MealDayCard";

const WEEKS = [1, 2, 3, 4] as const;
const DAY_LABELS: DayOfWeek[] = ["월", "화", "수", "목", "금"];

function MonthlyView({ schedules }: { schedules: WeeklyMealSchedule[] }) {
  return (
    <div>
      {/* Column headers */}
      <div className="mb-1 grid grid-cols-5 border-b border-gray-100 pb-2">
        {DAY_LABELS.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Weeks */}
      <div className="divide-y divide-gray-100">
        {schedules.map((week) => (
          <div key={week.week} className="grid grid-cols-5 divide-x divide-gray-100">
            {week.days.map((day) => {
              const lunch = day.meals.find((m) => m.type === "중식");
              return (
                <div key={day.dayOfWeek} className="flex flex-col gap-3 p-5">
                  <span className="text-xl font-bold text-gray-900">
                    {day.date.split("/")[1]}
                  </span>
                  {lunch && (
                    <span className="w-fit rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-gray-600">
                      {lunch.name}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MealCalendar() {
  const { viewMode, selectedWeek, selectedDay, setViewMode, setSelectedWeek, setSelectedDay } =
    useMealCalendarStore();

  const schedule = MOCK_WEEKLY_SCHEDULES.find((s) => s.week === selectedWeek);
  const avgScore = Math.round(
    MOCK_WEEKLY_SCHEDULES.reduce((sum, s) => sum + s.nutritionScore, 0) /
      MOCK_WEEKLY_SCHEDULES.length,
  );
  const displayScore = viewMode === "월간" ? avgScore : (schedule?.nutritionScore ?? avgScore);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Controls */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
            {(["주간", "월간"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                  viewMode === mode
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Week selector — 주간 모드에서만 표시 */}
          {viewMode === "주간" && (
            <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
              {WEEKS.map((week) => (
                <button
                  key={week}
                  type="button"
                  onClick={() => setSelectedWeek(week)}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                    selectedWeek === week
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {week}주차
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nutrition score */}
        <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-600">
          <ShieldCheck size={14} />
          <span>영양 균형 {displayScore}점</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="p-6">
        {viewMode === "월간" ? (
          <MonthlyView schedules={MOCK_WEEKLY_SCHEDULES} />
        ) : schedule ? (
          <div className="grid grid-cols-5 gap-3">
            {schedule.days.map((day) => (
              <MealDayCard
                key={day.dayOfWeek}
                day={day}
                selected={day.dayOfWeek === selectedDay}
                onClick={() => setSelectedDay(day.dayOfWeek)}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-gray-400">
            식단 정보가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
