"use client";

import { create } from "zustand";
import type { IngredientCategory } from "@/entities/ingredient";

export type CategoryFilter = IngredientCategory | "전체";

interface InventoryFilterState {
  search: string;
  categoryFilter: CategoryFilter;
  selectedIds: Set<string>;
  setSearch: (search: string) => void;
  setCategoryFilter: (filter: CategoryFilter) => void;
  toggleId: (id: string) => void;
  toggleAll: (ids: string[]) => void;
  clearSelection: () => void;
}

export const useInventoryFilterStore = create<InventoryFilterState>((set) => ({
  search: "",
  categoryFilter: "전체",
  selectedIds: new Set(),
  setSearch: (search) => set({ search }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter, selectedIds: new Set() }),
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
