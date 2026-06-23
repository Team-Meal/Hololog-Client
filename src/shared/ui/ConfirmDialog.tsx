"use client";

import { useEffect, useId } from "react";
import { Button } from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  tone?: "default" | "danger";
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  tone = "default",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const titleId = useId();

  // Close on Escape and lock body scroll while the dialog is open.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, loading, onClose]);

  if (!open) return null;

  const confirmClass =
    tone === "danger"
      ? "bg-red-600 hover:bg-red-500 active:bg-red-700"
      : "bg-blue-600 hover:bg-blue-500 active:bg-blue-700";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        aria-label="닫기"
        onClick={() => !loading && onClose()}
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[1px]"
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 id={titleId} className="text-base font-semibold text-zinc-900">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{description}</p>
        )}
        <div className="mt-6 flex justify-end gap-2.5">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={[
              "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white shadow-sm",
              "transition-all duration-150 active:scale-[0.97]",
              "disabled:pointer-events-none disabled:opacity-40",
              confirmClass,
            ].join(" ")}
          >
            {loading ? "처리 중..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
