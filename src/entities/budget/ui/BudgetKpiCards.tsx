import { CalendarIcon, SurfaceCard } from "@/shared/ui";

import { executionPercent } from "../lib/calc";

/** 월 예산·집행액·잔여 예산을 요약하는 KPI 카드 묶음. */
export function BudgetKpiCards({
  total,
  spent,
  period,
}: {
  total: number;
  spent: number;
  period: string;
}) {
  const remaining = total - spent;
  const execPct = executionPercent(spent, total);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <SurfaceCard>
        <p className="text-sm text-zinc-500">월 예산</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
          ₩{total.toLocaleString()}만
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2.5 py-1 text-xs text-zinc-500">
          <CalendarIcon size={12} />
          {period}
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <p className="text-sm text-zinc-500">집행액</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-blue-600">
          ₩{spent.toLocaleString()}만
        </p>
        <p className="mt-1 text-xs text-zinc-400">집행액 · {execPct}%</p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
          <div className="h-full rounded-full bg-blue-500" style={{ width: `${execPct}%` }} />
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <p className="text-sm text-zinc-500">잔여 예산</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-600">
          ₩{remaining.toLocaleString()}만
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          안정적 집행
        </div>
      </SurfaceCard>
    </div>
  );
}
