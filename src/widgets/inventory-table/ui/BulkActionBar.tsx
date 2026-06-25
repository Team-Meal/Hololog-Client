"use client";

import { useState } from "react";
import { toast } from "sonner";
import { TrashIcon, XIcon } from "@/shared/ui";
import { useIngredientStore } from "@/entities/ingredient";
import { useInventoryFilterStore } from "@/features/inventory-filter";

interface BulkActionBarProps {
  count: number;
  selectedIds: number[];
  onDeleted: () => void;
}

export function BulkActionBar({ count, selectedIds, onDeleted }: BulkActionBarProps) {
  const clearSelection = useInventoryFilterStore((s) => s.clearSelection);
  const deleteIngredients = useIngredientStore((s) => s.deleteIngredients);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    await deleteIngredients(selectedIds);
    setIsDeleting(false);
    onDeleted();
    toast.success(`${count}개 항목이 삭제되었습니다.`);
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5">
      <span className="text-sm font-medium text-blue-700">{count}개 선택됨</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-40"
        >
          <TrashIcon size={14} />
          {isDeleting ? "삭제 중..." : "삭제"}
        </button>
        <button
          type="button"
          onClick={clearSelection}
          disabled={isDeleting}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 disabled:opacity-40"
        >
          <XIcon size={14} />
          선택 해제
        </button>
      </div>
    </div>
  );
}
