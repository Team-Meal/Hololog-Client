import { SectionTitle, StatusBadge, SurfaceCard } from "@/shared/ui";

type Status = "done" | "serving" | "preparing" | "scheduled";

interface MealRow {
  time: string;
  name: string;
  status: Status;
  items: string;
  count: string | null;
}

const MEALS: MealRow[] = [
  { time: "08:00", name: "조식", status: "done", items: "현미밥 · 계란찜 · 무국", count: "214" },
  { time: "12:10", name: "중식 A", status: "serving", items: "제육볶음 · 김치 · 미역국", count: "612" },
  { time: "12:40", name: "중식 B", status: "preparing", items: "치킨마요덮밥 · 어묵국", count: "370" },
  { time: "16:30", name: "석식", status: "scheduled", items: "곤드레밥 · 두부찌개 · 진미채", count: null },
];

const statusMeta: Record<Status, { label: string; dot: string; tone: "blue" | "amber" | "zinc" }> = {
  done: { label: "배식 완료", dot: "bg-zinc-300", tone: "zinc" },
  serving: { label: "배식 중", dot: "bg-blue-500", tone: "blue" },
  preparing: { label: "준비 중", dot: "bg-amber-500", tone: "amber" },
  scheduled: { label: "예정", dot: "bg-zinc-300", tone: "zinc" },
};

export function TodayMeals() {
  return (
    <SurfaceCard className="h-full">
      <SectionTitle
        title="오늘의 배식"
        description="6월 17일 수요일 · 4회 배식"
        action={
          <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-500">
            식단표 보기
          </button>
        }
      />

      <ul className="mt-4 divide-y divide-zinc-100">
        {MEALS.map((meal) => {
          const meta = statusMeta[meal.status];

          return (
            <li key={meal.time} className="flex items-center gap-4 py-3.5">
              <span className="w-12 shrink-0 text-sm font-medium text-zinc-400">{meal.time}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`size-2 shrink-0 rounded-full ${meta.dot}`} />
                  <span className="text-sm font-semibold text-zinc-950">{meal.name}</span>
                  <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                </div>
                <p className="mt-1 truncate pl-4 text-xs text-zinc-500">{meal.items}</p>
              </div>
              <span className="shrink-0 text-sm text-zinc-500">
                {meal.count ? (
                  <>
                    <span className="font-semibold text-zinc-950">{meal.count}</span>명 배식
                  </>
                ) : (
                  <>예정</>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </SurfaceCard>
  );
}
