type Status = "done" | "serving" | "preparing" | "scheduled";

interface MealRow {
  time: string;
  name: string;
  status: Status;
  items: string;
  count: string | null;
}

// 퍼블리싱용 mock 데이터
const MEALS: MealRow[] = [
  {
    time: "08:00",
    name: "조식",
    status: "done",
    items: "전체식 · 누룽지 · 무우",
    count: "214",
  },
  {
    time: "12:10",
    name: "중식 A동",
    status: "serving",
    items: "제육볶음 · 김치 · 미역국",
    count: "612",
  },
  {
    time: "12:40",
    name: "중식 B동",
    status: "preparing",
    items: "치킨마요 덮밥 · 어묵국",
    count: "370",
  },
  {
    time: "16:30",
    name: "석식",
    status: "scheduled",
    items: "잡곡밥 · 순두부찌개 · 진미채",
    count: null,
  },
];

const statusMeta: Record<Status, { label: string; dot: string; badge: string }> = {
  done: { label: "배식 완료", dot: "bg-gray-300", badge: "bg-gray-100 text-gray-500" },
  serving: { label: "배식 중", dot: "bg-blue-500", badge: "bg-blue-50 text-blue-600" },
  preparing: { label: "준비 중", dot: "bg-amber-500", badge: "bg-amber-50 text-amber-600" },
  scheduled: { label: "예정", dot: "bg-gray-300", badge: "bg-gray-100 text-gray-400" },
};

export function TodayMeals() {
  return (
    <div className="flex h-full flex-col rounded-xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">오늘의 배식</p>
          <p className="text-xs text-gray-400">6월 12일 금요일 · 4회 배식</p>
        </div>
        <button
          type="button"
          className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
        >
          식단표 보기
        </button>
      </div>

      {/* Rows */}
      <ul className="mt-4 divide-y divide-gray-100">
        {MEALS.map((meal) => {
          const meta = statusMeta[meal.status];
          return (
            <li key={meal.time} className="flex items-center gap-4 py-3.5">
              <span className="w-12 shrink-0 text-sm font-medium text-gray-400">{meal.time}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
                  <span className="text-sm font-medium text-gray-900">{meal.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.badge}`}
                  >
                    {meta.label}
                  </span>
                </div>
                <p className="mt-1 truncate pl-4 text-xs text-gray-500">{meal.items}</p>
              </div>
              <span className="shrink-0 text-sm text-gray-500">
                {meal.count ? (
                  <>
                    <span className="font-semibold text-gray-900">{meal.count}</span> 명 배식
                  </>
                ) : (
                  <>— 명 배식</>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
