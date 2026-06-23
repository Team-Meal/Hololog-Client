"use client";

import { useEffect, useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@/shared/ui";
import { IngredientPlanCard } from "@/entities/ingredient-plan";
import { useIngredientPlanStore, PlanFormModal } from "@/features/ingredient-plan";

export function IngredientPlansWidget() {
  const {
    plans,
    isLoading,
    error,
    fetchPlans,
    clearErrors,
    openCreate,
    openEdit,
    deletePlan,
    isFormOpen,
    editingPlan,
  } = useIngredientPlanStore();

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    void fetchPlans();
  }, [fetchPlans]);

  const handleDeleteConfirm = async (planId: number) => {
    const ok = await deletePlan(planId);
    if (ok) setConfirmDeleteId(null);
  };

  if (isLoading) {
    return <p className="text-sm text-zinc-500">불러오는 중...</p>;
  }

  if (error) {
    return (
      <div>
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        <button
          onClick={() => {
            clearErrors();
            void fetchPlans();
          }}
          className="mt-3 text-sm text-blue-600 hover:underline"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400">식자재 계획표</p>
            <h2 className="text-sm font-semibold text-zinc-800">계획표 목록</h2>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-500 active:scale-95"
          >
            <PlusIcon size={12} />
            계획표 작성
          </button>
        </div>

        {/* 빈 상태 */}
        {plans.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/60 py-14">
            <p className="text-sm text-zinc-400">아직 등록된 계획표가 없습니다.</p>
            <button
              type="button"
              onClick={openCreate}
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              첫 번째 계획표 작성하기 →
            </button>
          </div>
        )}

        {/* 카드 목록 */}
        {plans.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.ingredientPlanId} className="group relative">
                <IngredientPlanCard plan={plan} />

                {/* 액션 버튼 (hover 시 표시) */}
                {confirmDeleteId !== plan.ingredientPlanId && (
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        openEdit(plan);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-zinc-500 shadow-sm hover:bg-blue-50 hover:text-blue-600"
                    >
                      <PencilIcon size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setConfirmDeleteId(plan.ingredientPlanId);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-zinc-500 shadow-sm hover:bg-red-50 hover:text-red-500"
                    >
                      <TrashIcon size={13} />
                    </button>
                  </div>
                )}

                {/* 삭제 확인 오버레이 */}
                {confirmDeleteId === plan.ingredientPlanId && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/95 backdrop-blur-sm">
                    <p className="text-sm font-medium text-zinc-700">정말 삭제할까요?</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteConfirm(plan.ingredientPlanId)}
                        className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-400"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isFormOpen && <PlanFormModal key={editingPlan?.ingredientPlanId ?? "__create__"} />}
    </>
  );
}
