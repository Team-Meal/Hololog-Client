"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Button, XIcon } from "@/shared/ui";
import { useIngredientStore } from "@/entities/ingredient";
import type { IngredientItem } from "@/entities/ingredient";

const CATEGORIES = ["곡물", "농산물", "축산", "수산", "가공"] as const;
const UNITS = ["kg", "L", "g", "모", "판", "개"] as const;

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: IngredientItem;
  ingredientId?: number;
}

// Inner component — mounts fresh each time the modal opens, so useState initializers run once.
function IngredientFormContent({
  onClose,
  initialData,
  ingredientId,
  titleId,
}: Omit<Props, "open"> & { titleId: string }) {
  const isEdit = ingredientId !== undefined;
  const { createIngredient, updateIngredient } = useIngredientStore();

  const [name, setName] = useState(initialData?.name ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [quantity, setQuantity] = useState(
    initialData?.quantity !== undefined ? String(initialData.quantity) : "",
  );
  const [unit, setUnit] = useState(initialData?.unit ?? "");
  const [expirationDate, setExpirationDate] = useState(
    initialData?.expirationDate ? initialData.expirationDate.slice(0, 10) : "",
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isLoading, onClose]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      name,
      category,
      quantity: quantity !== "" ? Number(quantity) : undefined,
      unit,
      expirationDate: expirationDate ? `${expirationDate}T00:00:00` : undefined,
    };

    const ok = isEdit
      ? await updateIngredient(ingredientId, payload)
      : await createIngredient(payload);

    setIsLoading(false);

    if (ok) {
      toast.success(isEdit ? "식자재가 수정되었습니다." : "식자재가 등록되었습니다.");
      onClose();
    } else {
      toast.error(useIngredientStore.getState().error ?? "처리 중 오류가 발생했습니다.");
    }
  }

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
        onClick={() => !isLoading && onClose()}
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[1px]"
      />

      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 id={titleId} className="text-base font-semibold text-zinc-900">
            {isEdit ? "식자재 수정" : "식자재 등록"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100"
          >
            <XIcon size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 친환경 백미"
              className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">
                카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="" disabled>
                  선택
                </option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">
                단위 <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="" disabled>
                  선택
                </option>
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">수량</label>
              <input
                type="number"
                min={0}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700">유통기한</label>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-2.5">
            <Button variant="secondary" type="button" onClick={onClose} disabled={isLoading}>
              취소
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "저장 중..." : isEdit ? "수정" : "등록"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function IngredientFormModal({ open, onClose, initialData, ingredientId }: Props) {
  const titleId = useId();

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <IngredientFormContent
      onClose={onClose}
      initialData={initialData}
      ingredientId={ingredientId}
      titleId={titleId}
    />,
    document.body,
  );
}
