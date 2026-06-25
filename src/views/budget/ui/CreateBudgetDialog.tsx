"use client";

import { useEffect, useId, useState, type InputHTMLAttributes } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/shared/ui";
import { createBudget } from "@/entities/budget";

interface CreateBudgetDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateBudgetDialog({ open, onClose, onCreated }: CreateBudgetDialogProps) {
  const titleId = useId();

  const [title, setTitle] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [usedAmount, setUsedAmount] = useState("0");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const datesValid = startDate.length > 0 && endDate.length > 0 && startDate <= endDate;
  const amountsValid =
    totalAmount.length > 0 &&
    Number(totalAmount) >= 0 &&
    usedAmount.length > 0 &&
    Number(usedAmount) >= 0;
  const valid = title.trim().length > 0 && amountsValid && datesValid;

  const reset = () => {
    setTitle("");
    setTotalAmount("");
    setUsedAmount("0");
    setStartDate("");
    setEndDate("");
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async (event: { preventDefault(): void }) => {
    event.preventDefault();
    if (!valid) return;

    setSubmitting(true);
    try {
      await createBudget({
        title: title.trim(),
        totalAmount: Number(totalAmount),
        usedAmount: Number(usedAmount),
        startDate,
        endDate,
      });
      toast.success("예산이 등록되었습니다.");
      reset();
      onCreated();
    } catch {
      toast.error("예산 등록에 실패했습니다.", {
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
          예산 입력
        </h2>
        <p className="mt-1 text-sm text-zinc-500">새 예산 항목을 등록합니다.</p>

        <div className="mt-5 flex flex-col gap-3.5">
          <Field
            label="예산명"
            type="text"
            value={title}
            maxLength={100}
            placeholder="예: 2026년 1학기 급식 예산"
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
          />

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="총 예산 (원)"
              type="number"
              min={0}
              value={totalAmount}
              placeholder="0"
              onChange={(e) => setTotalAmount(e.target.value)}
              disabled={submitting}
            />
            <Field
              label="사용액 (원)"
              type="number"
              min={0}
              value={usedAmount}
              placeholder="0"
              onChange={(e) => setUsedAmount(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="시작일"
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={submitting}
            />
            <Field
              label="종료일"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={submitting}
            />
          </div>

          {startDate.length > 0 && endDate.length > 0 && !datesValid && (
            <p className="pl-1 text-xs text-red-500">종료일은 시작일 이후여야 합니다.</p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <Button variant="secondary" type="button" onClick={handleClose} disabled={submitting}>
            취소
          </Button>
          <Button variant="primary" type="submit" disabled={submitting || !valid}>
            {submitting ? "등록 중..." : "등록"}
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
