import { PageShell } from "@/shared/ui";
import { InventoryActions } from "@/features/ingredient-actions";
import { InventoryTable } from "@/widgets/inventory-table";

export function InventoryPage() {
  return (
    <PageShell
      eyebrow="재고 관리"
      title="식자재 재고"
      description="전 사이트의 재고를 추적하고 안전 재고와 유통기한을 관리하세요."
      actions={<InventoryActions />}
    >
      <InventoryTable />
    </PageShell>
  );
}
