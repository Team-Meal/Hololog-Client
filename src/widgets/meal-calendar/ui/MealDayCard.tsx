import { UtensilsIcon } from "@/shared/ui";
import { shortDate, weekdayLabel } from "@/entities/meal";
import type { DietDateGroup } from "@/entities/meal";

interface Props {
  group: DietDateGroup;
  selectedDietId: number | null;
  onSelect: (id: number) => void;
}

// One day's column: the date header plus a card per diet on that date.
export function MealDayCard({ group, selectedDietId, onSelect }: Props) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-(--shadow-card)">
      <div className="flex w-full items-center justify-between bg-zinc-50 px-4 py-3">
        <span className="text-sm font-bold text-zinc-700">{weekdayLabel(group.date)}요일</span>
        <span className="text-xs text-zinc-400">{shortDate(group.date)}</span>
      </div>
      <div className="flex w-full flex-col gap-2 p-3">
        {group.diets.map((diet) => {
          const selected = diet.id === selectedDietId;
          return (
            <button
              key={diet.id}
              type="button"
              onClick={() => onSelect(diet.id)}
              className={`rounded-xl p-3 text-left ${
                selected ? "bg-blue-50 ring-1 ring-blue-200" : "bg-sky-50 hover:bg-sky-100"
              }`}
            >
              <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-sky-700">
                <UtensilsIcon size={12} />
                <span>식단</span>
              </div>
              <p className="text-sm font-bold text-zinc-800">{diet.name}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
