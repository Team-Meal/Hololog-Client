import { MoonIcon, SunIcon, UtensilsIcon } from "@/shared/ui";
import type { DayMenu, MealItem } from "@/entities/meal";

interface Props {
  day: DayMenu;
  selected?: boolean;
  onClick?: () => void;
}

const MEAL_CONFIG: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  조식: { bg: "bg-amber-50", text: "text-amber-700", icon: <SunIcon size={12} /> },
  중식: { bg: "bg-sky-50", text: "text-sky-700", icon: <UtensilsIcon size={12} /> },
  석식: { bg: "bg-violet-50", text: "text-violet-700", icon: <MoonIcon size={12} /> },
};

function MealCard({ meal }: { meal: MealItem }) {
  const config = MEAL_CONFIG[meal.type];
  return (
    <div className={`rounded-xl p-3 ${config.bg}`}>
      <div className={`mb-1.5 flex items-center gap-1 text-xs font-semibold ${config.text}`}>
        {config.icon}
        <span>{meal.type}</span>
      </div>
      <p className="mb-1 text-sm font-bold text-zinc-800">{meal.name}</p>
      <p className="text-xs leading-relaxed text-zinc-400">{meal.sides.join(" · ")}</p>
    </div>
  );
}

export function MealDayCard({ day, selected = false, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-(--shadow-card)"
    >
      <div
        className={`flex w-full items-center justify-between px-4 py-3 ${
          selected ? "bg-blue-50" : "bg-zinc-50"
        }`}
      >
        <span className={`text-sm font-bold ${selected ? "text-blue-700" : "text-zinc-700"}`}>
          {day.dayOfWeek}요일
        </span>
        <span className={`text-xs ${selected ? "text-blue-500" : "text-zinc-400"}`}>
          {day.date}
        </span>
      </div>
      <div className="flex w-full flex-col gap-2 p-3">
        {day.meals.map((meal) => (
          <MealCard key={meal.type} meal={meal} />
        ))}
      </div>
    </button>
  );
}
