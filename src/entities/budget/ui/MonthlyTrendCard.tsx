import { NxArea, SurfaceCard } from "@/shared/ui";

import type { MonthlyPoint } from "../model/types";

/** 월별 집행 추이를 영역 차트로 보여준다. */
export function MonthlyTrendCard({ trend }: { trend: MonthlyPoint[] }) {
  return (
    <SurfaceCard>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">월별 집행 추이</h2>
          <p className="text-sm text-zinc-400">1월~6월 · 단위 만원</p>
        </div>
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600">
          예상 초과 +3%
        </span>
      </div>
      <div className="mt-4">
        <NxArea data={trend} height={200} unit="만" />
      </div>
    </SurfaceCard>
  );
}
