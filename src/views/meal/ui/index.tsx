"use client";

import { useState } from "react";
import { Button, PageShell, PlusIcon } from "@/shared/ui";
import { DietFormDialog, MealCalendar, useMealCalendarStore } from "@/widgets/meal-calendar";

export function MealManagementPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const bumpReload = useMealCalendarStore((s) => s.bumpReload);

  return (
    <PageShell
      eyebrow="식단 관리"
      title="월간 식단표"
      description="식단을 등록하고 날짜별로 관리하세요."
      actions={
        <Button variant="primary" onClick={() => setCreateOpen(true)}>
          <PlusIcon size={14} />
          식단 작성
        </Button>
      }
    >
      <MealCalendar />

      {createOpen && (
        <DietFormDialog
          open
          onClose={() => setCreateOpen(false)}
          onSaved={() => {
            setCreateOpen(false);
            bumpReload();
          }}
        />
      )}
    </PageShell>
  );
}
