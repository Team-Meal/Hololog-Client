"use client";

import { useEffect } from "react";
import { IngredientPlanCard } from "@/entities/ingredient-plan";
import { useIngredientPlanStore } from "@/features/ingredient-plan";

export function IngredientPlansWidget() {
  const { plans, isLoading, error, fetchPlans, clearErrors } =
    useIngredientPlanStore();

  useEffect(() => {
    fetchPlans();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return <p className="text-sm text-zinc-500">불러오는 중...</p>;
  }

  if (error) {
    return (
      <div>
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
        <button
          onClick={() => {
            clearErrors();
            fetchPlans();
          }}
          className="mt-3 text-sm text-blue-600 hover:underline"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <p className="text-sm text-zinc-500">등록된 계획표가 없습니다.</p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <IngredientPlanCard key={plan.ingredientPlanId} plan={plan} />
      ))}
    </div>
  );
}
