"use client";

import { TrashIcon, XIcon } from "@/shared/ui";
import { useInventoryFilterStore } from "@/features/inventory-filter";

interface BulkActionBarProps {
  count: number;
}

export function BulkActionBar({ count }: BulkActionBarProps) {
  const clearSelection = useInventoryFilterStore((s) => s.clearSelection);

  return (
    <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5">
      <span className="text-sm font-medium text-blue-700">{count}개 선택됨</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <TrashIcon size={14} />
          삭제
        </button>
        <button
          type="button"
          onClick={clearSelection}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
        >
          <XIcon size={14} />
          선택 해제
        </button>
      </div>
    </div>
  );
}
