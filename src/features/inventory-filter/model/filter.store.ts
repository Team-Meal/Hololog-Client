"use client";

import { create } from "zustand";
import type { IngredientStatus } from "@/entities/ingredient";

export type StatusFilter = IngredientStatus | "전체";

interface InventoryFilterState {
  search: string;
  statusFilter: StatusFilter;
  selectedIds: Set<string>;
  setSearch: (search: string) => void;
  setStatusFilter: (filter: StatusFilter) => void;
  toggleId: (id: string) => void;
  toggleAll: (ids: string[]) => void;
  clearSelection: () => void;
}

export const useInventoryFilterStore = create<InventoryFilterState>((set) => ({
  search: "",
  statusFilter: "전체",
  selectedIds: new Set(),
  setSearch: (search) => set({ search }),
  setStatusFilter: (statusFilter) => set({ statusFilter, selectedIds: new Set() }),
  toggleId: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    }),
  toggleAll: (ids) =>
    set((state) => {
      const allSelected = ids.length > 0 && ids.every((id) => state.selectedIds.has(id));
      return { selectedIds: allSelected ? new Set() : new Set(ids) };
    }),
  clearSelection: () => set({ selectedIds: new Set() }),
}));
