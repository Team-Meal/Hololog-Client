import { UploadIcon, PlusIcon } from "@/shared/ui";
import { InventoryTable } from "@/widgets/inventory-table";

export function InventoryPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-medium text-blue-600">재고 관리</p>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">식자재 재고</h1>
          <p className="mt-1 text-sm text-zinc-500">
            전 사이트의 재고를 추적하고 안전 재고와 유통기한을 관리하세요.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <UploadIcon size={14} />
            엑셀 업로드
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <UploadIcon size={14} />
            CSV 업로드
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <PlusIcon size={14} />
            재고 추가
          </button>
        </div>
      </div>

      {/* Table */}
      <InventoryTable />
    </div>
  );
}
