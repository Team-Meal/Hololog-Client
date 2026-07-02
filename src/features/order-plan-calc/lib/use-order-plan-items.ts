"use client";

import { useEffect, useMemo } from "react";
import {
  useIngredientStore,
  isInSeason,
  daysUntilExpiry,
  EXPIRY_SOON_DAYS,
} from "@/entities/ingredient";
import { usePriceStore, getSubstitutes, type PriceSource } from "@/entities/price";
import {
  computeOrderPlanItems,
  useOrderPlanCalcStore,
  type OrderPlanItem,
  type OrderPlanBasisContext,
} from "@/entities/order-plan";
import { DEMO_RECIPES, type RecipeIngredient } from "@/entities/recipe";
import { findIngredientByName } from "./match-stock";

interface UseOrderPlanItemsResult {
  items: OrderPlanItem[];
  totalEstimatedCost: number;
  priceSource: PriceSource | null;
  isLoading: boolean;
}

export function useOrderPlanItems(recipesOverride?: RecipeIngredient[]): UseOrderPlanItemsResult {
  const recipes = recipesOverride ?? DEMO_RECIPES;

  const ingredientItems = useIngredientStore((s) => s.items);
  const fetchIngredients = useIngredientStore((s) => s.fetchIngredients);
  const ingredientLoading = useIngredientStore((s) => s.isLoading);

  const priceItems = usePriceStore((s) => s.items);
  const fetchPrices = usePriceStore((s) => s.fetchPrices);
  const priceSource = usePriceStore((s) => s.source);
  const priceLoading = usePriceStore((s) => s.isLoading);

  const studentCount = useOrderPlanCalcStore((s) => s.studentCount);
  const stockOverrides = useOrderPlanCalcStore((s) => s.stockOverrides);

  useEffect(() => {
    if (ingredientItems.length === 0) void fetchIngredients();
    void fetchPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = useMemo(() => {
    const month = new Date().getMonth() + 1;

    const getStock = (ingredientName: string): number => {
      if (ingredientName in stockOverrides) return stockOverrides[ingredientName];
      return findIngredientByName(ingredientItems, ingredientName)?.quantity ?? 0;
    };

    const getPrice = (ingredientName: string) => {
      const quote = priceItems.find((q) => q.itemName === ingredientName);
      return quote ? { unitPrice: quote.price } : undefined;
    };

    const getBasis = (ctx: OrderPlanBasisContext): string => {
      const { recipe, orderQuantity } = ctx;
      const matched = findIngredientByName(ingredientItems, recipe.ingredientName);
      const days = matched ? daysUntilExpiry(matched.expirationDate, new Date()) : null;
      if (days !== null && days <= EXPIRY_SOON_DAYS) return "유통기한 임박 재고 우선";

      if (isInSeason(recipe.ingredientName, month)) return `${month}월 제철`;

      const quote = priceItems.find((q) => q.itemName === recipe.ingredientName);
      if (quote?.isSpiking) {
        const substitutes = getSubstitutes(recipe.ingredientName);
        return substitutes.length > 0
          ? `KAMIS 가격 급등 — ${substitutes.join("·")} 대체 검토`
          : "KAMIS 가격 급등";
      }

      return orderQuantity === 0 ? "재고 충분" : "발주 필요";
    };

    const calcRecipes = recipes.map((r) => ({ ...r, supplierName: r.defaultSupplierName }));
    return computeOrderPlanItems({
      recipes: calcRecipes,
      studentCount,
      getStock,
      getPrice,
      getBasis,
    });
  }, [recipes, studentCount, stockOverrides, ingredientItems, priceItems]);

  const totalEstimatedCost = useMemo(
    () => items.reduce((sum, item) => sum + item.estimatedCost, 0),
    [items],
  );

  return {
    items,
    totalEstimatedCost,
    priceSource,
    isLoading: ingredientLoading || priceLoading,
  };
}
