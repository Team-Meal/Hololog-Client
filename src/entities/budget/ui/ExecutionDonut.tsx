import { SurfaceCard } from "@/shared/ui";

import { executionPercent } from "../lib/calc";

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** 집행액 대비 잔여 예산을 도넛으로 보여준다. (단위: 원) */
export function ExecutionDonut({ used, total }: { used: number; total: number }) {
  const execPct = executionPercent(used, total);
  const usedLen = (Math.min(execPct, 100) / 100) * CIRCUMFERENCE;
  const remaining = Math.max(total - used, 0);

  return (
    <SurfaceCard>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-900">집행 현황</h2>
        <span className="text-xs text-zinc-400">{execPct}% 사용</span>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="relative h-40 w-40">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#f4f4f5" strokeWidth="12" />
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="12"
              strokeDasharray={`${usedLen} ${CIRCUMFERENCE - usedLen}`}
              strokeLinecap="butt"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-zinc-900">{execPct}%</span>
            <span className="text-xs text-zinc-400">집행</span>
          </div>
        </div>
      </div>

      <ul className="mt-4 space-y-2.5">
        <li className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-zinc-600">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            집행액
          </span>
          <span className="font-medium text-zinc-900">₩{used.toLocaleString()}</span>
        </li>
        <li className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-zinc-600">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
            잔여
          </span>
          <span className="font-medium text-zinc-900">₩{remaining.toLocaleString()}</span>
        </li>
      </ul>
    </SurfaceCard>
  );
}
