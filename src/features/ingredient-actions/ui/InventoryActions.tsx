"use client";

import { useState } from "react";
import { Button, PlusIcon, UploadIcon } from "@/shared/ui";
import { IngredientFormModal } from "./IngredientFormModal";

export function InventoryActions() {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" size="sm">
        <UploadIcon size={14} />
        엑셀 업로드
      </Button>
      <Button variant="secondary" size="sm">
        <UploadIcon size={14} />
        CSV 업로드
      </Button>
      <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>
        <PlusIcon size={14} />
        재고 추가
      </Button>

      <IngredientFormModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
