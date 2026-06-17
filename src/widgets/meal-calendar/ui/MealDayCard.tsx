import { Moon, Sunrise, UtensilsCrossed } from "lucide-react";
import type { DayMenu, MealItem } from "@/entities/meal";

interface Props {
  day: DayMenu;
  selected?: boolean;
  onClick?: () => void;
}

const MEAL_CONFIG: Record<
  string,
  { bg: string; border: string; text: string; icon: React.ReactNode }
> = {
  조식: {
    bg: "bg-amber-50",
    border: "border-amber-100",
    text: "text-amber-700",
    icon: <Sunrise size={12} />,
  },
  중식: {
    bg: "bg-sky-50",
    border: "border-sky-100",
    text: "text-sky-700",
    icon: <UtensilsCrossed size={12} />,
  },
  석식: {
    bg: "bg-violet-50",
    border: "border-violet-100",
    text: "text-violet-700",
    icon: <Moon size={12} />,
  },
};

function MealCard({ meal }: { meal: MealItem }) {
  const config = MEAL_CONFIG[meal.type];
  return (
    <div className={`rounded-xl border p-3 ${config.bg} ${config.border}`}>
      <div className={`mb-1.5 flex items-center gap-1 text-xs font-semibold ${config.text}`}>
        {config.icon}
        <span>{meal.type}</span>
      </div>
      <p className="mb-1 text-sm font-bold text-gray-800">{meal.name}</p>
      <p className="text-xs leading-relaxed text-gray-400">
        {meal.sides.join(" · ")}
      </p>
    </div>
  );
}

export function MealDayCard({ day, selected = false, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col overflow-hidden rounded-2xl border bg-white text-left transition-all hover:shadow-sm ${
        selected ? "border-blue-300 ring-1 ring-blue-200" : "border-gray-100 hover:border-gray-200"
      }`}
    >
      <div
        className={`flex w-full items-center justify-between px-4 py-3 ${
          selected ? "bg-blue-50" : "bg-gray-50"
        }`}
      >
        <span
          className={`text-sm font-bold ${selected ? "text-blue-700" : "text-gray-700"}`}
        >
          {day.dayOfWeek}요일
        </span>
        <span className={`text-xs ${selected ? "text-blue-500" : "text-gray-400"}`}>
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
