import { Toaster } from "sonner";

import { ORDER_ITEMS, ORDER_STATS, OrderList, OrderStatGrid } from "@/entities/order";
import { CreatePurchaseOrderButton, OrderActions } from "@/features/order-actions";

/** 발주 관리 페이지 — 요약 통계와 품목별 권장 발주 목록을 조합한다. */
export function OrdersPage() {
  return (
    <main className="min-h-full bg-[#f4f4f6] text-gray-900">
      <Toaster position="top-right" richColors closeButton />
      <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">발주 관리</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-gray-950 sm:text-4xl">
              AI 발주 어시스턴트
            </h1>
            <p className="mt-2 text-sm font-medium text-gray-500">
              예측 수요와 현재 재고를 비교해 품목별 권장 구매량을 제안해요.
            </p>
          </div>
          <CreatePurchaseOrderButton />
        </header>

        <OrderStatGrid stats={ORDER_STATS} />

        <OrderList
          items={ORDER_ITEMS}
          renderActions={(item) => (item.recommended > 0 ? <OrderActions item={item} /> : null)}
        />
      </section>
    </main>
  );
}
