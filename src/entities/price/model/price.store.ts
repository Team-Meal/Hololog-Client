"use client";

import { create } from "zustand";
import { getPricesApi } from "../api/price.api";
import type { PriceQuote, PriceSource } from "./types";

interface PriceState {
  items: PriceQuote[];
  source: PriceSource | null;
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;
  fetchPrices: () => Promise<void>;
}

export const usePriceStore = create<PriceState>((set, get) => ({
  items: [],
  source: null,
  isLoading: false,
  hasLoaded: false,
  error: null,

  fetchPrices: async () => {
    if (get().isLoading || get().hasLoaded) return;
    set({ isLoading: true, error: null });
    const { items, source } = await getPricesApi();
    set({ items, source, isLoading: false, hasLoaded: true });
  },
}));
