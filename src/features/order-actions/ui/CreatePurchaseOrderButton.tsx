"use client";

import { toast } from "sonner";

import { Button, FileTextIcon } from "@/shared/ui";

/** 권장 발주안을 모아 발주서를 생성하는 버튼. */
export function CreatePurchaseOrderButton() {
  const handleCreate = () => {
    toast.success("권장 발주안으로 발주서를 생성했습니다.");
  };

  return (
    <Button
      variant="primary"
      size="lg"
      className="font-bold active:scale-[0.98]"
      onClick={handleCreate}
    >
      <FileTextIcon className="size-4" />
      발주서 생성
    </Button>
  );
}
