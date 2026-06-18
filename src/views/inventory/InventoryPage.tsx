import { PageShell, Button, UploadIcon, PlusIcon } from "@/shared/ui";
import { InventoryTable } from "@/widgets/inventory-table";

export function InventoryPage() {
  return (
    <PageShell
      eyebrow="재고 관리"
      title="식자재 재고"
      description="전 사이트의 재고를 추적하고 안전 재고와 유통기한을 관리하세요."
      actions={
        <>
          <Button variant="secondary" size="sm">
            <UploadIcon size={14} />
            엑셀 업로드
          </Button>
          <Button variant="secondary" size="sm">
            <UploadIcon size={14} />
            CSV 업로드
          </Button>
          <Button variant="primary" size="sm">
            <PlusIcon size={14} />
            재고 추가
          </Button>
        </>
      }
    >
      <InventoryTable />
    </PageShell>
  );
}
