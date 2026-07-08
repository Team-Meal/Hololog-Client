"use client";

import { useEffect, useMemo } from "react";
import { useIngredientStore } from "@/entities/ingredient";
import { useOrderPlanItems } from "@/features/order-plan-calc";
import { computeDashboardMetrics, type DashboardMetrics } from "../lib/metrics";

export function useDashboardMetrics(): { metrics: DashboardMetrics; isLoading: boolean } {
  const ingredients = useIngredientStore((s) => s.items);
  const fetchIngredients = useIngredientStore((s) => s.fetchIngredients);
  const ingredientLoading = useIngredientStore((s) => s.isLoading);

  const { items: orderPlanItems, isLoading: orderPlanLoading } = useOrderPlanItems();

  useEffect(() => {
    if (ingredients.length === 0) void fetchIngredients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const metrics = useMemo(
    () => computeDashboardMetrics(ingredients, orderPlanItems, new Date()),
    [ingredients, orderPlanItems],
  );

  return { metrics, isLoading: ingredientLoading || orderPlanLoading };
}
