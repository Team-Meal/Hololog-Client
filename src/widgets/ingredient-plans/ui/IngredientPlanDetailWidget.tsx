"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SurfaceCard, PencilIcon, TrashIcon } from "@/shared/ui";
import { useIngredientPlanStore, PlanFormModal } from "@/features/ingredient-plan";

interface IngredientPlanDetailWidgetProps {
  planId: number;
}

export function IngredientPlanDetailWidget({ planId }: IngredientPlanDetailWidgetProps) {
  const router = useRouter();
  const {
    selectedPlan: plan,
    isDetailLoading,
    detailError,
    isFormOpen,
    fetchPlanDetail,
    openEdit,
    deletePlan,
    clearErrors,
  } = useIngredientPlanStore();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    void fetchPlanDetail(planId);
  }, [planId, fetchPlanDetail]);

  const handleDelete = async () => {
    setIsDeleting(true);
    const ok = await deletePlan(planId);
    if (ok) router.push("/ingredient-plans");
    else setIsDeleting(false);
  };

  if (isDetailLoading) {
    return <div className="p-6 text-sm text-zinc-500">불러오는 중...</div>;
  }

  if (detailError) {
    return (
      <div className="p-6">
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{detailError}</p>
        <div className="mt-3 flex items-center gap-4">
          <button
            onClick={() => {
              clearErrors();
              void fetchPlanDetail(planId);
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            다시 시도
          </button>
          <Link href="/ingredient-plans" className="text-sm text-zinc-500 hover:underline">
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
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Link href="/ingredient-plans" className="text-sm text-zinc-500 hover:text-blue-600">
            ← 목록으로 돌아가기
          </Link>

          {!confirmDelete ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openEdit(plan)}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
              >
                <PencilIcon size={13} />
                수정
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
              >
                <TrashIcon size={13} />
                삭제
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">정말 삭제할까요?</span>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                disabled={isDeleting}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={isDeleting}
                className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-400 disabled:opacity-50"
              >
                {isDeleting ? "삭제 중…" : "삭제"}
              </button>
            </div>
          )}
        </div>

        <SurfaceCard>
          <dl className="divide-y divide-zinc-100">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-zinc-500">계획표 제목</dt>
              <dd className="mt-1 text-sm text-zinc-900 sm:col-span-2 sm:mt-0">{plan.title}</dd>
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
                <dd className="mt-1 text-sm whitespace-pre-wrap text-zinc-900 sm:col-span-2 sm:mt-0">
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

      {isFormOpen && <PlanFormModal key={plan.ingredientPlanId} />}
    </>
  );
}
