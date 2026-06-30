import type { Ref } from "react";
import { WEEKDAY_HEADERS } from "@/entities/meal";
import type { Diet, DietListItem, MonthGridDay, ServerMealType } from "@/entities/meal";
import { PlusIcon } from "@/shared/ui";

interface Props {
  weeks: MonthGridDay[][];
  dietsByDate: Map<string, DietListItem[]>;
  detailById: Map<number, Diet>;
  selectedDietId: number | null;
  today: string; // YYYY-MM-DD — highlighted in the grid
  todayCellRef?: Ref<HTMLDivElement>; // attached to today's cell so it can be scrolled into view
  onSelect: (id: number) => void;
  onAddDate: (date: string) => void;
}

const MEAL_ORDER: Record<ServerMealType, number> = { BREAKFAST: 0, LUNCH: 1, DINNER: 2 };

const MEAL_LABEL: Record<ServerMealType, string> = {
  BREAKFAST: "조식",
  LUNCH: "중식",
  DINNER: "석식",
};

const MEAL_BADGE: Record<ServerMealType, string> = {
  BREAKFAST: "bg-amber-50 text-amber-700",
  LUNCH: "bg-sky-50 text-sky-700",
  DINNER: "bg-violet-50 text-violet-700",
};

const MEAL_SELECTED: Record<ServerMealType, string> = {
  BREAKFAST: "bg-amber-100 ring-1 ring-amber-300",
  LUNCH: "bg-sky-100 ring-1 ring-sky-300",
  DINNER: "bg-violet-100 ring-1 ring-violet-300",
};

function formatDescription(description?: string): string[] {
  return description
    ? description
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
    : [];
}

// Rank for 조식 → 중식 → 석식 ordering. The list API may omit mealType, so fall
// back to the name (식단 작성 시 항상 "조식"/"중식"/"석식" 으로 저장됨).
const NAME_ORDER: Record<string, number> = { 조식: 0, 중식: 1, 석식: 2 };

function mealRank(diet: DietListItem): number {
  if (diet.mealType) return MEAL_ORDER[diet.mealType];
  return NAME_ORDER[diet.name] ?? 9;
}

function sortByMeal(diets: DietListItem[]): DietListItem[] {
  return [...diets].sort((a, b) => mealRank(a) - mealRank(b));
}

export function MealMonthGrid({
  weeks,
  dietsByDate,
  detailById,
  selectedDietId,
  today,
  todayCellRef,
  onSelect,
  onAddDate,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-176">
        {/* 월 화 수 목 금 토 일 — one header row */}
        <div className="grid grid-cols-7 border-b border-zinc-100">
          {WEEKDAY_HEADERS.map((label) => {
            return (
              <div
                key={label}
                className={`px-2 py-2 text-center text-xs font-bold ${
                  label === "일" ? "text-red-500" : label === "토" ? "text-blue-500" : "text-zinc-500"
                }`}
              >
                {label}
              </div>
            );
          })}
        </div>

        {/* Weeks — each week is one row of 7 day cells. */}
        <div className="grid grid-cols-7">
          {weeks.flat().map((cell) => {
            const diets = sortByMeal(dietsByDate.get(cell.date) ?? []);
            const isSunday = cell.weekday === 0;
            const isSaturday = cell.weekday === 6;
            const isToday = cell.date === today;

            return (
              <div
                key={cell.date}
                ref={isToday ? todayCellRef : undefined}
                className={`group/cell flex min-h-28 flex-col gap-1 border-b border-r border-zinc-100 p-1.5 ${
                  isToday ? "bg-blue-50/60 ring-1 ring-inset ring-blue-300" : cell.inMonth ? "bg-white" : "bg-zinc-50/60"
                }`}
              >
                <div className="flex items-center justify-between px-0.5">
                  <span
                    className={`text-[11px] font-semibold ${
                      isToday
                        ? "flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-white"
                        : !cell.inMonth
                          ? "text-zinc-300"
                          : isSunday
                            ? "text-red-500"
                            : isSaturday
                              ? "text-blue-500"
                              : "text-zinc-600"
                    }`}
                  >
                    {cell.day}
                  </span>
                  {cell.inMonth && (
                    <button
                      type="button"
                      aria-label={`${cell.date} 식단 추가`}
                      onClick={() => onAddDate(cell.date)}
                      className="rounded-md bg-zinc-100 p-0.5 text-zinc-400 transition-colors hover:bg-blue-100 hover:text-blue-600 group-hover/cell:bg-blue-50 group-hover/cell:text-blue-500"
                    >
                      <PlusIcon size={13} />
                    </button>
                  )}
                </div>

                <div className="flex max-h-32 flex-col gap-1 overflow-y-auto">
                  {diets.map((diet) => {
                    const selected = diet.id === selectedDietId;
                    const type = diet.mealType;
                    const menuLines = formatDescription(detailById.get(diet.id)?.description);
                    const baseClass = type
                      ? selected
                        ? MEAL_SELECTED[type]
                        : `hover:opacity-80 ${MEAL_BADGE[type]}`
                      : selected
                        ? "bg-blue-50 ring-1 ring-blue-200"
                        : "bg-zinc-50 hover:bg-zinc-100";

                    return (
                      <button
                        key={diet.id}
                        type="button"
                        onClick={() => onSelect(diet.id)}
                        className={`w-full rounded-md px-1.5 py-1 text-left transition-colors ${baseClass}`}
                      >
                        <span className="block text-[9px] font-semibold leading-none opacity-70">
                          {type ? MEAL_LABEL[type] : diet.name}
                        </span>
                        <div className="mt-0.5 flex flex-col gap-px">
                          {(menuLines.length > 0 ? menuLines : [diet.name]).map((line) => (
                            <span
                              key={line}
                              className="block truncate text-[10px] font-medium leading-3.5 text-zinc-800"
                            >
                              {line}
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
