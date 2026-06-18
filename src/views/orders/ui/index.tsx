import { Toaster } from "sonner";

import { PageShell } from "@/shared/ui";
import { ORDER_ITEMS, ORDER_STATS, OrderList, OrderStatGrid } from "@/entities/order";
import { CreatePurchaseOrderButton, OrderActions } from "@/features/order-actions";

export function OrdersPage() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <PageShell
        eyebrow="발주 관리"
        title="AI 발주 어시스턴트"
        description="예측 수요와 현재 재고를 비교해 품목별 권장 구매량을 제안해요."
        actions={<CreatePurchaseOrderButton />}
      >
        <OrderStatGrid stats={ORDER_STATS} />
        <OrderList
          items={ORDER_ITEMS}
          renderActions={(item) => (item.recommended > 0 ? <OrderActions item={item} /> : null)}
        />
      </PageShell>
    </>
  );
}
