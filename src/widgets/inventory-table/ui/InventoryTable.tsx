"use client";

import { useMemo } from "react";
import { MOCK_INGREDIENTS } from "@/entities/ingredient";
import type { IngredientStatus } from "@/entities/ingredient";
import { useInventoryFilterStore } from "@/features/inventory-filter";
import type { StatusFilter } from "@/features/inventory-filter";
import { SearchIcon, SlidersIcon, DownloadIcon } from "@/shared/ui";
import { StatusBadge } from "./StatusBadge";
import { BulkActionBar } from "./BulkActionBar";

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: "전체", value: "전체" },
  { label: "정상", value: "정상" },
  { label: "부족", value: "부족" },
  { label: "긴급", value: "긴급" },
  { label: "임박", value: "임박" },
];

const QUANTITY_COLOR: Record<IngredientStatus, string> = {
  정상: "text-zinc-900",
  부족: "text-amber-500",
  긴급: "text-red-500",
  임박: "text-zinc-900",
};

export function InventoryTable() {
  const { search, statusFilter, selectedIds, setSearch, setStatusFilter, toggleId, toggleAll } =
    useInventoryFilterStore();

  const filtered = useMemo(() => {
    return MOCK_INGREDIENTS.filter((item) => {
      const matchesSearch =
        search.trim() === "" ||
        item.name.includes(search.trim()) ||
        item.category.includes(search.trim());
      const matchesStatus = statusFilter === "전체" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const filteredIds = filtered.map((i) => i.id);
  const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id));
  const someSelected = filteredIds.some((id) => selectedIds.has(id));
  const selectedCount = filteredIds.filter((id) => selectedIds.has(id)).length;

  return (
    <div className="flex flex-col gap-3">
      {/* Search + tabs row */}
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

        <div className="flex items-center gap-1 rounded-xl bg-zinc-100 p-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                statusFilter === tab.value
                  ? "bg-white text-zinc-800 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
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
      {someSelected && <BulkActionBar count={selectedCount} />}

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-(--shadow-card)">
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
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">식자재</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500">수량</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">단위</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">유통기한</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500">안전재고</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-zinc-400">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-zinc-50 ${selectedIds.has(item.id) ? "bg-blue-50/50" : ""}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleId(item.id)}
                      className="h-4 w-4 rounded border-zinc-300 accent-blue-600"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-zinc-100" />
                      <div>
                        <p className="font-medium text-zinc-900">{item.name}</p>
                        <p className="text-xs text-zinc-400">{item.category}</p>
                      </div>
                    </div>
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-semibold ${QUANTITY_COLOR[item.status]}`}
                  >
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{item.unit}</td>
                  <td className="px-4 py-3 text-zinc-500">{item.expiryDate}</td>
                  <td className="px-4 py-3 text-right text-zinc-500">{item.safetyStock}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
