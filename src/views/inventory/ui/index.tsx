import { PageShell } from "@/shared/ui";
import { InventoryActions } from "@/features/ingredient-actions";
import { InventoryTable } from "@/widgets/inventory-table";

export function InventoryPage() {
  return (
    <PageShell
      eyebrow="재고 관리"
      title="식자재 재고"
      description="식자재의 원산지·공급처·유통기한을 관리하고 지역·제철·임박 식자재를 한눈에 확인하세요."
      actions={<InventoryActions />}
    >
      <InventoryTable />
    </PageShell>
  );
}
