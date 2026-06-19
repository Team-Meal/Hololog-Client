import { SurfaceCard } from "@/shared/ui";

import { buildDonutArcs, executionPercent } from "../lib/calc";
import type { BudgetCategory } from "../model/types";

const RADIUS = 42;

/** 카테고리별 집행 비중을 도넛 차트와 범례로 보여준다. */
export function ExecutionDonut({
  categories,
  total,
}: {
  categories: BudgetCategory[];
  total: number;
}) {
  const spent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const execPct = executionPercent(spent, total);
  const { arcs, circumference } = buildDonutArcs(categories, total, RADIUS);

  return (
    <SurfaceCard>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-900">집행 비중</h2>
        <span className="text-xs text-zinc-400">{execPct}% 사용</span>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="relative h-40 w-40">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#f4f4f5" strokeWidth="12" />
            {arcs.map((arc) => (
              <circle
                key={arc.label}
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                stroke={arc.color}
                strokeWidth="12"
                strokeDasharray={`${arc.len} ${circumference - arc.len}`}
                strokeDashoffset={-arc.offset}
                strokeLinecap="butt"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-zinc-900">{execPct}%</span>
            <span className="text-xs text-zinc-400">집행</span>
          </div>
        </div>
      </div>

      <ul className="mt-4 space-y-2.5">
        {categories.map((cat) => (
          <li key={cat.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-zinc-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
              {cat.label}
            </span>
            <span className="font-medium text-zinc-900">₩{cat.spent.toLocaleString()}만</span>
          </li>
        ))}
      </ul>
    </SurfaceCard>
  );
}
