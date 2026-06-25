"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SectionTitle, StatusBadge, SurfaceCard } from "@/shared/ui";
import { useMealStore } from "@/features/meal";
import type { ServerMealType, TodayMealResponse } from "@/features/meal";

type Status = "done" | "serving" | "scheduled";

const MEAL_CONFIG: {
  type: ServerMealType;
  name: string;
  time: string;
  startHour: number;
  endHour: number;
}[] = [
  { type: "BREAKFAST", name: "조식", time: "08:00", startHour: 8, endHour: 9 },
  { type: "LUNCH", name: "중식", time: "12:00", startHour: 12, endHour: 13 },
  { type: "DINNER", name: "석식", time: "17:00", startHour: 17, endHour: 18 },
];

const STATUS_META: Record<Status, { label: string; dot: string; tone: "blue" | "zinc" }> = {
  done: { label: "배식 완료", dot: "bg-zinc-300", tone: "zinc" },
  serving: { label: "배식 중", dot: "bg-blue-500", tone: "blue" },
  scheduled: { label: "예정", dot: "bg-zinc-300", tone: "zinc" },
};

function getStatus(startHour: number, endHour: number): Status {
  const now = new Date().getHours();
  if (now >= endHour) return "done";
  if (now >= startHour) return "serving";
  return "scheduled";
}

function formatMenuItems(meal: TodayMealResponse): string {
  return meal.menuNames.join(" · ") || "메뉴 정보 없음";
}

export function TodayMeals() {
  const router = useRouter();
  const { todayMeals, isTodayLoading, fetchTodayMeals } = useMealStore();

  useEffect(() => {
    fetchTodayMeals();
  }, [fetchTodayMeals]);

  const today = new Date();
  const dateLabel = today.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const availableCount = MEAL_CONFIG.filter((c) => todayMeals[c.type]).length;

  return (
    <SurfaceCard className="h-full">
      <SectionTitle
        title="오늘의 배식"
        description={`${dateLabel} · ${availableCount}회 배식`}
        action={
          <button
            type="button"
            className="text-sm font-semibold text-blue-600 hover:text-blue-500"
            onClick={() => router.push("/meal")}
          >
            식단표 보기
          </button>
        }
      />

      <ul className="mt-4 divide-y divide-zinc-100">
        {isTodayLoading ? (
          <li className="flex items-center justify-center py-8 text-sm text-zinc-400">
            불러오는 중…
          </li>
        ) : availableCount === 0 ? (
          <li className="flex items-center justify-center py-8 text-sm text-zinc-400">
            오늘 등록된 급식 정보가 없습니다.
          </li>
        ) : (
          MEAL_CONFIG.map(({ type, name, time, startHour, endHour }) => {
            const meal = todayMeals[type];
            if (!meal) return null;

            const status = getStatus(startHour, endHour);
            const meta = STATUS_META[status];

            return (
              <li key={type} className="flex items-center gap-4 py-3.5">
                <span className="w-12 shrink-0 text-sm font-medium text-zinc-400">{time}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`size-2 shrink-0 rounded-full ${meta.dot}`} />
                    <span className="text-sm font-semibold text-zinc-950">{name}</span>
                    <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                  </div>
                  <p className="mt-1 truncate pl-4 text-xs text-zinc-500">
                    {formatMenuItems(meal)}
                  </p>
                </div>
                {meal.calorie && (
                  <span className="shrink-0 text-xs text-zinc-400">{meal.calorie}</span>
                )}
              </li>
            );
          })
        )}
      </ul>
    </SurfaceCard>
  );
}
