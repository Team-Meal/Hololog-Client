import { SurfaceCard } from "@/shared/ui";

import type { BudgetCategory } from "../model/types";

/** 카테고리별 예산 대비 집행액을 막대로 보여준다. */
export function CategoryBudgetBars({ categories }: { categories: BudgetCategory[] }) {
  return (
    <SurfaceCard>
      <div>
        <h2 className="text-base font-semibold text-zinc-900">카테고리별 예산 배분</h2>
        <p className="text-sm text-zinc-400">예산 대비 집행액</p>
      </div>
      <div className="mt-6 flex flex-col gap-5">
        {categories.map((cat) => (
          <CategoryBar key={cat.label} category={cat} />
        ))}
      </div>
    </SurfaceCard>
  );
}

function CategoryBar({ category }: { category: BudgetCategory }) {
  const pct = Math.round((category.spent / category.budget) * 100);
  const isHigh = pct >= 90;

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700">{category.label}</span>
        <span className={`text-xs ${isHigh ? "font-medium text-amber-500" : "text-zinc-400"}`}>
          ₩{category.spent.toLocaleString()}만 / ₩{category.budget.toLocaleString()}만 · {pct}%
        </span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-zinc-100">
        <div
          className={`h-full rounded-full ${isHigh ? "bg-amber-400" : category.trackColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
