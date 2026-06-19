import type { ReactNode } from "react";

import { SparklesIcon } from "@/shared/ui";

import { SupplierMark } from "./SupplierMark";
import type { Supplier } from "../model/types";

/**
 * 공급업체 1곳을 카드로 보여주는 표현형 컴포넌트.
 * 문의·발주 등 상호작용은 `actions` 슬롯으로 주입받는다.
 */
export function SupplierCard({ supplier, actions }: { supplier: Supplier; actions?: ReactNode }) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-(--shadow-card)">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <SupplierMark supplier={supplier} />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-zinc-950">{supplier.name}</h2>
            <p className="mt-1 text-sm font-medium text-zinc-400">{supplier.category}</p>
          </div>
        </div>
        {supplier.recommended && <AiBadge />}
      </div>

      <dl className="mt-5 grid grid-cols-4 gap-3">
        <SupplierMetric label="거리" value={supplier.distance} />
        <SupplierMetric label="평점" value={supplier.rating.toFixed(1)} featured />
        <SupplierMetric label="단가" value={supplier.price} />
        <SupplierMetric label="배송" value={supplier.delivery} />
      </dl>

      {actions && <div className="mt-5">{actions}</div>}
    </article>
  );
}

function SupplierMetric({
  label,
  value,
  featured = false,
}: {
  label: string;
  value: string;
  featured?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold text-zinc-400">{label}</dt>
      <dd className="mt-2 flex min-h-6 items-center gap-1 text-sm font-bold text-zinc-950">
        {featured && <span className="text-lg leading-none text-amber-400">★</span>}
        {value}
      </dd>
    </div>
  );
}

function AiBadge() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
      <SparklesIcon className="size-3.5" />
      AI 추천
    </span>
  );
}
