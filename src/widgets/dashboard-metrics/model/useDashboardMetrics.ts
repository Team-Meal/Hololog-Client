"use client";

import { useEffect, useMemo } from "react";
import { useIngredientStore } from "@/entities/ingredient";
import { usePriceStore } from "@/entities/price";
import { useOrderPlanItems } from "@/features/order-plan-calc";
import { computeDashboardMetrics, type DashboardMetrics } from "../lib/metrics";

export function useDashboardMetrics(): { metrics: DashboardMetrics; isLoading: boolean } {
  const ingredients = useIngredientStore((s) => s.items);
  const fetchIngredients = useIngredientStore((s) => s.fetchIngredients);
  const ingredientLoading = useIngredientStore((s) => s.isLoading);

  const priceItems = usePriceStore((s) => s.items);
  const fetchPrices = usePriceStore((s) => s.fetchPrices);

  const { items: orderPlanItems, isLoading: orderPlanLoading } = useOrderPlanItems();

  useEffect(() => {
    if (ingredients.length === 0) void fetchIngredients();
    void fetchPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const metrics = useMemo(
    () => computeDashboardMetrics(ingredients, orderPlanItems, priceItems, new Date()),
    [ingredients, orderPlanItems, priceItems],
  );

  return { metrics, isLoading: ingredientLoading || orderPlanLoading };
}
