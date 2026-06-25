"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useIngredientStore } from "@/entities/ingredient";
import type { IngredientItem } from "@/entities/ingredient";
import { IngredientFormModal } from "@/features/ingredient-actions";
import { useInventoryFilterStore } from "@/features/inventory-filter";
import { SearchIcon, SlidersIcon, DownloadIcon, Button, PencilIcon, TrashIcon, ConfirmDialog } from "@/shared/ui";
import { BulkActionBar } from "./BulkActionBar";

function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

export function InventoryTable() {
  const { items, isLoading, error, fetchIngredients, deleteIngredient } = useIngredientStore();
  const { search, selectedIds, setSearch, toggleId, toggleAll, clearSelection } =
    useInventoryFilterStore();

  const [editItem, setEditItem] = useState<IngredientItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IngredientItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  const filtered = useMemo(() => {
    const q = search.trim();
    if (!q) return items;
    return items.filter((item) => item.name.includes(q) || item.category.includes(q));
  }, [items, search]);

  const filteredIds = filtered.map((i) => String(i.ingredientId));
  const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id));
  const someSelected = filteredIds.some((id) => selectedIds.has(id));
  const selectedCount = filteredIds.filter((id) => selectedIds.has(id)).length;
  const selectedIngredientIds = filtered
    .filter((i) => selectedIds.has(String(i.ingredientId)))
    .map((i) => i.ingredientId);

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const ok = await deleteIngredient(deleteTarget.ingredientId);
    setIsDeleting(false);
    setDeleteTarget(null);
    if (ok) toast.success(`${deleteTarget.name}이(가) 삭제되었습니다.`);
    else toast.error(useIngredientStore.getState().error ?? "삭제 중 오류가 발생했습니다.");
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Search + toolbar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon
              size={14}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="식자재 검색..."
              className="h-9 w-52 rounded-lg border border-zinc-200 bg-white pr-3 pl-8 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50"
            >
              <SlidersIcon size={15} />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50"
            >
              <DownloadIcon size={15} />
            </button>
          </div>
        </div>

        {/* Bulk action bar */}
        {someSelected && (
          <BulkActionBar
            count={selectedCount}
            selectedIds={selectedIngredientIds}
            onDeleted={clearSelection}
          />
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-(--shadow-card)">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-sm text-zinc-400">
              불러오는 중…
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 py-16 text-sm text-zinc-500">
              <span>{error}</span>
              <Button size="sm" onClick={() => fetchIngredients()}>
                다시 시도
              </Button>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() => toggleAll(filteredIds)}
                      className="h-4 w-4 rounded border-zinc-300 accent-blue-600"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">
                    식자재
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500">
                    수량
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">
                    단위
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">
                    유통기한
                  </th>
                  <th className="w-20 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-sm text-zinc-400">
                      {items.length === 0 ? "등록된 식자재가 없습니다." : "검색 결과가 없습니다."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => {
                    const sid = String(item.ingredientId);
                    return (
                      <tr
                        key={item.ingredientId}
                        className={`group hover:bg-zinc-50 ${selectedIds.has(sid) ? "bg-blue-50/50" : ""}`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(sid)}
                            onChange={() => toggleId(sid)}
                            className="h-4 w-4 rounded border-zinc-300 accent-blue-600"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 shrink-0 rounded-lg bg-zinc-100" />
                            <div>
                              <p className="font-medium text-zinc-900">{item.name}</p>
                              <p className="text-xs text-zinc-400">{item.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-zinc-900">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-zinc-500">{item.unit}</td>
                        <td className="px-4 py-3 text-zinc-500">
                          {item.expirationDate ? formatDate(item.expirationDate) : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => setEditItem(item)}
                              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                            >
                              <PencilIcon size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(item)}
                              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-red-50 hover:text-red-500"
                            >
                              <TrashIcon size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit modal */}
      <IngredientFormModal
        open={editItem !== null}
        onClose={() => setEditItem(null)}
        initialData={editItem ?? undefined}
        ingredientId={editItem?.ingredientId}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleteTarget !== null}
        title={`${deleteTarget?.name}을(를) 삭제하시겠습니까?`}
        description="삭제된 식자재는 복구할 수 없습니다."
        confirmText="삭제"
        tone="danger"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
