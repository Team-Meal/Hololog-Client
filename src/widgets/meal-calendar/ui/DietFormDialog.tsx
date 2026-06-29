"use client";

import { useEffect, useId, useState, type InputHTMLAttributes } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/shared/ui";
import { createDiet, updateDiet } from "@/entities/meal";
import type { Diet, ServerMealType } from "@/entities/meal";

const MEAL_NAME: Record<ServerMealType, string> = {
  BREAKFAST: "조식",
  LUNCH: "중식",
  DINNER: "석식",
};

interface DietFormDialogProps {
  open: boolean;
  // When provided, the dialog edits this diet; otherwise it creates a new one.
  diet?: Diet | null;
  onClose: () => void;
  onSaved: () => void;
}

export function DietFormDialog({ open, diet, onClose, onSaved }: DietFormDialogProps) {
  const titleId = useId();
  const isEdit = Boolean(diet);

  const [description, setDescription] = useState(diet?.description ?? "");
  const [dietDate, setDietDate] = useState(diet?.dietDate ?? "");
  const [mealType, setMealType] = useState<ServerMealType | "">(diet?.mealType ?? "");
  const [submitting, setSubmitting] = useState(false);

  const pad = (n: number) => String(n).padStart(2, "0");
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  // Close on Escape and lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, submitting, onClose]);

  if (!open || typeof document === "undefined") return null;

  const valid = mealType.length > 0 && dietDate.length > 0;

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async (event: { preventDefault(): void }) => {
    event.preventDefault();
    if (!valid) return;

    setSubmitting(true);
    try {
      const payload = {
        name: MEAL_NAME[mealType as ServerMealType],
        description: description.trim() || undefined,
        dietDate,
        mealType: mealType as ServerMealType,
      };
      if (diet) {
        await updateDiet(diet.id, payload);
        toast.success("식단이 수정되었습니다.");
      } else {
        await createDiet(payload);
        toast.success("식단이 등록되었습니다.");
      }
      onSaved();
    } catch {
      toast.error(isEdit ? "식단 수정에 실패했습니다." : "식단 등록에 실패했습니다.", {
        description: "입력값을 다시 확인해 주세요.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        aria-label="닫기"
        onClick={handleClose}
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[1px]"
      />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        noValidate
      >
        <h2 id={titleId} className="text-base font-semibold text-zinc-900">
          {isEdit ? "식단 수정" : "식단 작성"}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          {isEdit ? "식단 정보를 수정합니다." : "새 식단을 등록합니다."}
        </p>

        <div className="mt-5 flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-zinc-700">구분</span>
            <div className="flex gap-1.5">
              {(
                [
                  { value: "BREAKFAST", label: "조식" },
                  { value: "LUNCH", label: "중식" },
                  { value: "DINNER", label: "석식" },
                ] as { value: ServerMealType; label: string }[]
              ).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  disabled={submitting}
                  onClick={() => setMealType(value)}
                  className={`flex-1 rounded-xl border py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    mealType === value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Field
            label="날짜"
            type="date"
            value={dietDate}
            onChange={(e) => setDietDate(e.target.value)}
            disabled={submitting}
            min={isEdit ? undefined : todayStr}
          />

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-zinc-700">메뉴 (선택)</span>
            <textarea
              value={description}
              placeholder={"백미밥\n된장국\n제육볶음"}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              rows={4}
              className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50/80 px-3.5 py-2.5 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <Button variant="secondary" type="button" onClick={handleClose} disabled={submitting}>
            취소
          </Button>
          <Button variant="primary" type="submit" disabled={submitting || !valid}>
            {submitting ? "저장 중..." : isEdit ? "수정" : "등록"}
          </Button>
        </div>
      </form>
    </div>,
    document.body,
  );
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Field({ label, id, ...inputProps }: FieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <label htmlFor={inputId} className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-zinc-700">{label}</span>
      <input
        id={inputId}
        className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-3.5 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
        {...inputProps}
      />
    </label>
  );
}
