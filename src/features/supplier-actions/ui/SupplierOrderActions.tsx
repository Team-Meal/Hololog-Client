"use client";

import { toast } from "sonner";

import type { Supplier } from "@/entities/supplier";
import { Button, MessageCircleIcon, ShoppingCartIcon } from "@/shared/ui";

/** 공급업체에 문의하거나 발주를 생성하는 액션 버튼 묶음. */
export function SupplierOrderActions({ supplier }: { supplier: Supplier }) {
  const handleInquiry = () => {
    toast(`${supplier.name}에 문의를 보냅니다.`);
  };

  const handleOrder = () => {
    toast.success(`${supplier.name} 발주가 생성되었습니다.`);
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] gap-3">
      <Button
        variant="ghost"
        className="h-10 text-zinc-800 hover:bg-zinc-100"
        onClick={handleInquiry}
      >
        <MessageCircleIcon className="size-4" />
        문의
      </Button>
      <Button
        variant="primary"
        className="h-10 rounded-lg bg-blue-600 font-bold hover:bg-blue-700"
        onClick={handleOrder}
      >
        <ShoppingCartIcon className="size-4" />
        발주
      </Button>
    </div>
  );
}
