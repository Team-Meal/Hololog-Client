"use client";

import { useOrderPlanCalcStore } from "@/entities/order-plan";
import { FormulaHint } from "@/shared/ui";
import { useOrderPlanItems } from "../lib/use-order-plan-items";

function won(value: number): string {
  return `₩${Math.round(value).toLocaleString("ko-KR")}`;
}

function qty(value: number, unit: string): string {
  return `${value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}${unit}`;
}

export function OrderPlanCalcTable() {
  const studentCount = useOrderPlanCalcStore((s) => s.studentCount);
  const setStudentCount = useOrderPlanCalcStore((s) => s.setStudentCount);
  const setStockOverride = useOrderPlanCalcStore((s) => s.setStockOverride);

  const { items, totalEstimatedCost, priceSource, isLoading } = useOrderPlanItems();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-zinc-600">
          급식 인원
          <input
            type="number"
            min={0}
            value={studentCount}
            onChange={(e) => setStudentCount(Number(e.target.value))}
            className="h-9 w-24 rounded-lg border border-zinc-200 px-2 text-right text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          명
        </label>

        <FormulaHint
          title="발주 자동계산 산식"
          lines={[
            "필요량 = 1인 사용량 × 급식 인원",
            "부족량 = max(필요량 − 현재 재고, 0)",
            "발주량 = 부족량 × 1.05 (안전계수)",
            "예상비용 = 발주량 × 단가",
          ]}
        />

        {priceSource && (
          <span className="ml-auto text-xs text-zinc-400">
            단가 출처:{" "}
            {priceSource === "kamis"
              ? "KAMIS 실시간"
              : priceSource === "mixed"
                ? "KAMIS + 캐시"
                : "캐시 스냅샷"}
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-(--shadow-card)">
        {isLoading && items.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-sm text-zinc-400">
            불러오는 중…
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">메뉴</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">
                  필요 농산물
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500">필요량</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500">
                  현재 재고
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500">부족량</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500">
                  추천 발주량
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">
                  추천 공급처
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500">
                  예상 비용
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">근거</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">{item.menuName}</td>
                  <td className="px-4 py-3 text-zinc-700">{item.ingredientName}</td>
                  <td className="px-4 py-3 text-right text-zinc-500">
                    {qty(item.requiredQuantity, item.unit)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      min={0}
                      step="0.1"
                      defaultValue={item.currentStock}
                      onChange={(e) =>
                        setStockOverride(item.ingredientName, Number(e.target.value))
                      }
                      className="h-8 w-20 rounded-md border border-zinc-200 px-2 text-right text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-zinc-900">
                    {qty(item.shortageQuantity, item.unit)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-600">
                    {qty(item.orderQuantity, item.unit)}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{item.supplierName}</td>
                  <td className="px-4 py-3 text-right font-semibold text-zinc-900">
                    {won(item.estimatedCost)}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-500">{item.basis}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-zinc-100 bg-zinc-50">
                <td
                  colSpan={7}
                  className="px-4 py-3 text-right text-xs font-semibold text-zinc-500"
                >
                  합계
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-zinc-900">
                  {won(totalEstimatedCost)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
