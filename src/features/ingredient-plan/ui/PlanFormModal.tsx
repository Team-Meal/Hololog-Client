"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "@/shared/ui";
import { useIngredientPlanStore } from "../model/ingredient-plan.store";

interface FormFields {
  title: string;
  startDate: string;
  endDate: string;
  memo: string;
}

const EMPTY: FormFields = { title: "", startDate: "", endDate: "", memo: "" };

export function PlanFormModal() {
  const { editingPlan, isSaving, closeForm, createPlan, updatePlan } = useIngredientPlanStore();

  const [fields, setFields] = useState<FormFields>(() =>
    editingPlan
      ? {
          title: editingPlan.title,
          startDate: editingPlan.startDate.slice(0, 10),
          endDate: editingPlan.endDate.slice(0, 10),
          memo: editingPlan.memo ?? "",
        }
      : EMPTY,
  );

  const patch = useCallback(
    (update: Partial<FormFields>) => setFields((prev) => ({ ...prev, ...update })),
    [],
  );

  const dateError = fields.startDate && fields.endDate && fields.startDate > fields.endDate;

  const isValid =
    fields.title.trim().length > 0 &&
    fields.startDate.length > 0 &&
    fields.endDate.length > 0 &&
    !dateError;

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!isValid || isSaving) return;

    const data = {
      title: fields.title.trim(),
      startDate: fields.startDate,
      endDate: fields.endDate,
      memo: fields.memo.trim() || undefined,
    };

    const ok = editingPlan
      ? await updatePlan(editingPlan.ingredientPlanId, data)
      : await createPlan(data);

    if (ok) closeForm();
  };

  const isEdit = !!editingPlan;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={(e) => e.target === e.currentTarget && closeForm()}
    >
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl" style={{ maxHeight: "min(600px, 90dvh)" }}>
        {/* 헤더 */}
        <div className="flex shrink-0 items-center justify-between bg-zinc-50 px-5 py-4">
          <h2 className="text-sm font-semibold text-zinc-800">
            {isEdit ? "계획표 수정" : "새 계획표"}
          </h2>
          <button
            type="button"
            onClick={closeForm}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600"
          >
            <XIcon size={14} />
          </button>
        </div>

        {/* 폼 — 내용이 길면 스크롤 */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <div className="flex flex-col gap-4 px-5 py-5">
            {/* 계획표 이름 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-500">
                계획표 이름 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={fields.title}
                onChange={(e) => patch({ title: e.target.value })}
                placeholder="예: 6월 4주차 식자재 계획"
                maxLength={100}
                disabled={isSaving}
                autoFocus
                className="h-10 rounded-lg border border-zinc-200 px-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
              />
            </div>

            {/* 기간 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-500">
                기간 <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={fields.startDate}
                  onChange={(e) => patch({ startDate: e.target.value })}
                  disabled={isSaving}
                  className="h-10 flex-1 rounded-lg border border-zinc-200 px-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                />
                <span className="shrink-0 text-xs text-zinc-400">~</span>
                <input
                  type="date"
                  value={fields.endDate}
                  min={fields.startDate || undefined}
                  onChange={(e) => patch({ endDate: e.target.value })}
                  disabled={isSaving}
                  className="h-10 flex-1 rounded-lg border border-zinc-200 px-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                />
              </div>
              {dateError && (
                <p className="text-xs text-red-500">종료일은 시작일 이후여야 합니다.</p>
              )}
            </div>

            {/* 메모 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-500">
                메모 <span className="font-normal text-zinc-400">(선택)</span>
              </label>
              <textarea
                value={fields.memo}
                onChange={(e) => patch({ memo: e.target.value })}
                placeholder="추가 메모를 입력하세요."
                rows={3}
                disabled={isSaving}
                className="resize-none rounded-lg border border-zinc-200 px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
              />
            </div>
          </div>

          {/* 버튼 — 항상 하단 고정 */}
          <div className="mt-auto shrink-0 flex gap-2 border-t border-zinc-100 px-5 py-4">
            <button
              type="button"
              onClick={closeForm}
              disabled={isSaving}
              className="h-10 flex-1 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!isValid || isSaving}
              className="h-10 flex-[2] rounded-lg bg-blue-600 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
            >
              {isSaving ? "저장 중…" : isEdit ? "수정하기" : "작성하기"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
