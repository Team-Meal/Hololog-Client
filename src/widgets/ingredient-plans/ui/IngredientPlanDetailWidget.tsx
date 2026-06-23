"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SurfaceCard } from "@/shared/ui";
import { useIngredientPlanStore } from "@/features/ingredient-plan";

interface IngredientPlanDetailWidgetProps {
  planId: number;
}

export function IngredientPlanDetailWidget({
  planId,
}: IngredientPlanDetailWidgetProps) {
  const {
    selectedPlan: plan,
    isDetailLoading,
    detailError,
    fetchPlanDetail,
    clearErrors,
  } = useIngredientPlanStore();

  useEffect(() => {
    fetchPlanDetail(planId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isDetailLoading) {
    return <div className="p-6 text-sm text-zinc-500">불러오는 중...</div>;
  }

  if (detailError) {
    return (
      <div className="p-6">
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {detailError}
        </p>
        <div className="mt-3 flex items-center gap-4">
          <button
            onClick={() => {
              clearErrors();
              fetchPlanDetail(planId);
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            다시 시도
          </button>
          <Link
            href="/ingredient-plans"
            className="text-sm text-zinc-500 hover:underline"
          >
            ← 목록으로
          </Link>
        </div>
      </div>
    );
  }

  if (!plan) return null;

  const start = new Date(plan.startDate).toLocaleDateString("ko-KR");
  const end = new Date(plan.endDate).toLocaleDateString("ko-KR");

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/ingredient-plans"
        className="text-sm text-zinc-500 hover:text-blue-600"
      >
        ← 목록으로 돌아가기
      </Link>

      <SurfaceCard>
        <dl className="divide-y divide-zinc-100">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-zinc-500">계획표 제목</dt>
            <dd className="mt-1 text-sm text-zinc-900 sm:col-span-2 sm:mt-0">
              {plan.title}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-zinc-500">기간</dt>
            <dd className="mt-1 text-sm text-zinc-900 sm:col-span-2 sm:mt-0">
              {start} ~ {end}
            </dd>
          </div>
          {plan.memo && (
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-zinc-500">메모</dt>
              <dd className="mt-1 whitespace-pre-wrap text-sm text-zinc-900 sm:col-span-2 sm:mt-0">
                {plan.memo}
              </dd>
            </div>
          )}
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-zinc-500">작성일</dt>
            <dd className="mt-1 text-sm text-zinc-900 sm:col-span-2 sm:mt-0">
              {new Date(plan.createdAt).toLocaleDateString("ko-KR")}
            </dd>
          </div>
        </dl>
      </SurfaceCard>
    </div>
  );
}
