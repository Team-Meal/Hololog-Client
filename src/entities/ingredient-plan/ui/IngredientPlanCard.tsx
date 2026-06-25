import Link from "next/link";
import type { IngredientPlan } from "../model/types";

interface Props {
  plan: IngredientPlan;
}

export function IngredientPlanCard({ plan }: Props) {
  const start = new Date(plan.startDate).toLocaleDateString("ko-KR");
  const end = new Date(plan.endDate).toLocaleDateString("ko-KR");

  return (
    <Link
      href={`/ingredient-plans/${plan.ingredientPlanId}`}
      className="block rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md"
    >
      <p className="text-xs font-medium text-blue-600">
        {start} ~ {end}
      </p>
      <h3 className="mt-1.5 text-base font-semibold text-zinc-900">{plan.title}</h3>
      {plan.memo && <p className="mt-1 truncate text-sm text-zinc-500">{plan.memo}</p>}
      <p className="mt-3 text-xs text-zinc-400">
        작성일 {new Date(plan.createdAt).toLocaleDateString("ko-KR")}
      </p>
    </Link>
  );
}
