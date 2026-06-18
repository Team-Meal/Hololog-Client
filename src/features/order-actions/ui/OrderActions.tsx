"use client";

import { toast } from "sonner";

import type { OrderItem } from "@/entities/order";
import { Button, CheckIcon, PencilIcon } from "@/shared/ui";

/** 권장 발주안을 수정하거나 승인하는 액션 버튼 묶음. */
export function OrderActions({ item }: { item: OrderItem }) {
  const handleApprove = () => {
    toast.success(`${item.name} ${item.recommended}kg 발주가 승인되었습니다.`);
  };

  const handleEdit = () => {
    toast(`${item.name} 권장 구매량을 수정합니다.`);
  };

  return (
    <>
      <Button variant="ghost" className="text-zinc-700 hover:bg-zinc-100" onClick={handleEdit}>
        <PencilIcon className="size-4" />
        수정
      </Button>
      <Button variant="primary" className="font-bold active:scale-[0.98]" onClick={handleApprove}>
        <CheckIcon className="size-4" />
        승인
      </Button>
    </>
  );
}
