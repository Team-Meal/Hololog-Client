"use client";

import { useEffect, useMemo } from "react";
import { useIngredientStore } from "@/entities/ingredient";
import { usePriceStore } from "@/entities/price";
import { useOrderPlanCalcStore } from "@/entities/order-plan";
import { DEMO_RECIPES } from "@/entities/recipe";
import { scoreMenus } from "../lib/scoring";
import { computeMealResultMetrics } from "../lib/metrics";
import { useGeneratorStore } from "./generator.store";
import type { MealResultMetrics, ScoredMenu } from "./types";

interface UseMealScoringResult {
  scoredMenus: ScoredMenu[];
  metrics: Omit<MealResultMetrics, "estimatedOrderCost">;
  studentCount: number;
}

export function useMealScoring(): UseMealScoringResult {
  const conditions = useGeneratorStore((s) => s.conditions);

  const ingredients = useIngredientStore((s) => s.items);
  const fetchIngredients = useIngredientStore((s) => s.fetchIngredients);

  const priceItems = usePriceStore((s) => s.items);
  const fetchPrices = usePriceStore((s) => s.fetchPrices);

  const studentCount = useOrderPlanCalcStore((s) => s.studentCount);

  useEffect(() => {
    if (ingredients.length === 0) void fetchIngredients();
    void fetchPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const month = Number(conditions.month.split("-")[1] ?? new Date().getMonth() + 1);

  const scoredMenus = useMemo(
    () => scoreMenus({ recipes: DEMO_RECIPES, conditions, ingredients, priceItems, month }),
    [conditions, ingredients, priceItems, month],
  );

  const metrics = useMemo(
    () =>
      computeMealResultMetrics({
        scoredMenus,
        recipes: DEMO_RECIPES,
        conditions,
        ingredients,
        priceItems,
        month,
        studentCount,
      }),
    [scoredMenus, conditions, ingredients, priceItems, month, studentCount],
  );

  return { scoredMenus, metrics, studentCount };
}
