import { shortDate, weekdayLabel } from "@/entities/meal";
import type { DietDateGroup, ServerMealType } from "@/entities/meal";

interface Props {
  group: DietDateGroup;
  selectedDietId: number | null;
  onSelect: (id: number) => void;
}

const MEAL_LABEL: Record<ServerMealType, string> = {
  BREAKFAST: "아침",
  LUNCH: "점심",
  DINNER: "저녁",
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

export function MealDayCard({ group, selectedDietId, onSelect }: Props) {
  const isWeekend = ["일", "토"].includes(weekdayLabel(group.date));

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-(--shadow-card)">
      <div
        className={`flex items-center justify-between px-3 py-2 ${isWeekend ? "bg-red-50" : "bg-zinc-50"}`}
      >
        <span
          className={`text-xs font-bold ${isWeekend ? "text-red-500" : "text-zinc-600"}`}
        >
          {weekdayLabel(group.date)}
        </span>
        <span className="text-[11px] text-zinc-400">{shortDate(group.date)}</span>
      </div>

      <div className="flex flex-col gap-1 p-1.5">
        {group.diets.map((diet) => {
          const selected = diet.id === selectedDietId;
          const type = diet.mealType;
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
              className={`w-full rounded-lg px-2 py-1.5 text-left transition-colors ${baseClass}`}
            >
              <span className="block text-[10px] font-semibold leading-none opacity-70">
                {type ? MEAL_LABEL[type] : diet.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
