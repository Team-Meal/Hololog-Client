"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/shared/ui";
import { createDietLeftover, getDietLeftover } from "@/entities/meal";
import type { LeftoverUnit } from "@/entities/meal";

interface LeftoverDialogProps {
  open: boolean;
  dietId: number;
  dietName: string;
  onClose: () => void;
  onSaved: () => void;
}

const UNITS: LeftoverUnit[] = ["KG", "G", "L", "ML", "EA", "BOX"];

export function LeftoverDialog({ open, dietId, dietName, onClose, onSaved }: LeftoverDialogProps) {
  const titleId = useId();

  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState<LeftoverUnit>("KG");
  const [memo, setMemo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Prefill with the existing leftover record if there is one (404 → none yet).
  // Mounted fresh per open (parent gates on `open`), so `loading` starts true.
  useEffect(() => {
    if (!open) return;
    let active = true;
    getDietLeftover(dietId)
      .then((lo) => {
        if (!active || !lo) return;
        setAmount(String(lo.amount));
        setUnit(lo.unit);
        setMemo(lo.memo ?? "");
      })
      .catch(() => {
        // Couldn't load an existing record — start from an empty form.
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open, dietId]);

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

  const valid = amount.length > 0 && Number(amount) >= 0;

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async (event: { preventDefault(): void }) => {
    event.preventDefault();
    if (!valid) return;

    setSubmitting(true);
    try {
      await createDietLeftover(dietId, {
        // Backend stores amount as an int32 — round to avoid rejecting decimals.
        amount: Math.round(Number(amount)),
        unit,
        memo: memo.trim() || undefined,
      });
      toast.success("잔반량이 저장되었습니다.");
      onSaved();
    } catch {
      toast.error("잔반량 저장에 실패했습니다.");
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
          잔반량 입력
        </h2>
        <p className="mt-1 truncate text-sm text-zinc-500">{dietName}</p>

        <div className="mt-5 flex flex-col gap-3.5">
          <div className="grid grid-cols-3 gap-3">
            <label className="col-span-2 flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-zinc-700">잔반량</span>
              <input
                type="number"
                min={0}
                step={1}
                value={amount}
                placeholder="0"
                onChange={(e) => setAmount(e.target.value)}
                disabled={submitting || loading}
                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-3.5 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium text-zinc-700">단위</span>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as LeftoverUnit)}
                disabled={submitting || loading}
                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-zinc-700">메모 (선택)</span>
            <textarea
              value={memo}
              placeholder="예: 잔반이 많은 날"
              onChange={(e) => setMemo(e.target.value)}
              disabled={submitting || loading}
              rows={2}
              className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50/80 px-3.5 py-2.5 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <Button variant="secondary" type="button" onClick={handleClose} disabled={submitting}>
            취소
          </Button>
          <Button variant="primary" type="submit" disabled={submitting || loading || !valid}>
            {submitting ? "저장 중..." : "저장"}
          </Button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
