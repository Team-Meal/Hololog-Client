import type { ReactNode } from "react";

import { PackageIcon, SparklesIcon } from "@/shared/ui";

import { formatWon } from "../lib/format";
import type { OrderItem } from "../model/types";

/**
 * 품목 1건의 AI 권장 발주안을 보여주는 표현형 카드.
 * 수정·승인 등 상호작용은 `actions` 슬롯으로 주입받는다.
 */
export function OrderCard({ item, actions }: { item: OrderItem; actions?: ReactNode }) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-(--shadow-card)">
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div className="flex items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <PackageIcon className="size-6" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-zinc-950">{item.name}</h2>
            <p className="mt-1 truncate text-sm font-medium text-zinc-400">
              {item.supplier} · {formatWon(item.price)}
            </p>
          </div>
        </div>

        <Metric label="예상 수요" value={`주간 ${item.weeklyDemand}kg 소요`} />
        <Metric label="현재 재고" value={`재고 ${item.stock}kg`} />

        <div className="flex flex-col items-start gap-1.5 lg:items-end">
          <p className="text-xs font-semibold text-zinc-400">권장 구매량</p>
          <p className="text-2xl font-bold text-blue-600">{item.recommended} kg</p>
          <FitBadge fit={item.fit} />
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-blue-50/60 px-4 py-3">
        <SparklesIcon className="mt-0.5 size-4 shrink-0 text-blue-500" />
        <p className="text-sm font-medium text-zinc-600">{item.note}</p>
      </div>

      {actions && <div className="mt-4 flex justify-end gap-2">{actions}</div>}
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-zinc-400">{label}</p>
      <p className="mt-1.5 text-lg font-bold text-zinc-950">{value}</p>
    </div>
  );
}

function FitBadge({ fit }: { fit: number }) {
  const tone =
    fit >= 90
      ? "bg-emerald-50 text-emerald-600"
      : fit >= 80
        ? "bg-blue-50 text-blue-600"
        : "bg-zinc-100 text-zinc-500";

  return (
    <span className={["inline-flex rounded-full px-2.5 py-1 text-xs font-bold", tone].join(" ")}>
      {fit} % 적합
    </span>
  );
}
