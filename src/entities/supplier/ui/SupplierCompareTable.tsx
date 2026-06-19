import { Button } from "@/shared/ui";

import { SupplierMark } from "./SupplierMark";
import type { Supplier } from "../model/types";

/** 공급업체들을 한 행씩 나열해 항목별로 비교하는 표. */
export function SupplierCompareTable({ suppliers }: { suppliers: Supplier[] }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-(--shadow-card)">
      <h2 className="text-lg font-bold text-zinc-950">공급업체 비교</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-100 text-xs font-semibold text-zinc-400">
              <th className="py-4 pr-4">공급업체</th>
              <th className="px-4 py-4">카테고리</th>
              <th className="px-4 py-4">거리</th>
              <th className="px-4 py-4">평점</th>
              <th className="px-4 py-4">단가</th>
              <th className="px-4 py-4">배송</th>
              <th className="py-4 pl-4 text-right">선택</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <SupplierCompareRow key={supplier.id} supplier={supplier} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SupplierCompareRow({ supplier }: { supplier: Supplier }) {
  return (
    <tr className="border-b border-zinc-100 last:border-0 hover:bg-blue-50/35">
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <SupplierMark supplier={supplier} compact />
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-950">{supplier.name}</span>
            {supplier.recommended && (
              <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
                추천
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-sm font-medium text-zinc-500">{supplier.category}</td>
      <td className="px-4 py-4 text-sm font-medium text-zinc-600">{supplier.distance}</td>
      <td className="px-4 py-4 text-sm font-medium text-zinc-600">
        {supplier.rating.toFixed(1)} ({supplier.reviews})
      </td>
      <td className="px-4 py-4 text-sm font-medium text-zinc-600">{supplier.price}</td>
      <td className="px-4 py-4">
        <DeliveryBadge delivery={supplier.delivery} />
      </td>
      <td className="py-4 pl-4 text-right">
        <Button variant="ghost" size="sm" className="font-bold text-zinc-900">
          선택
        </Button>
      </td>
    </tr>
  );
}

function DeliveryBadge({ delivery }: { delivery: string }) {
  const sameDay = delivery === "당일";

  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-xs font-bold",
        sameDay ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-500",
      ].join(" ")}
    >
      {delivery}
    </span>
  );
}
