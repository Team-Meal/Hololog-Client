"use client";

import { useState } from "react";

import { PageShell } from "@/shared/ui";
import {
  LocationPreview,
  RecommendationSummary,
  SUPPLIERS,
  SupplierCardGrid,
  SupplierCompareTable,
} from "@/entities/supplier";
import { SupplierOrderActions } from "@/features/supplier-actions";

type ViewMode = "cards" | "compare";

export function SuppliersPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  return (
    <PageShell
      eyebrow="공급업체"
      title="공급업체 추천"
      description="거리·평점·단가·배송 가능 여부를 비교해 최적의 공급업체를 찾으세요."
      actions={
        <div className="inline-flex w-full rounded-2xl bg-zinc-200/70 p-1 sm:w-auto">
          <ViewToggleButton selected={viewMode === "cards"} onClick={() => setViewMode("cards")}>
            카드
          </ViewToggleButton>
          <ViewToggleButton
            selected={viewMode === "compare"}
            onClick={() => setViewMode("compare")}
          >
            비교
          </ViewToggleButton>
        </div>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_405px]">
        <section className="min-w-0">
          {viewMode === "cards" ? (
            <SupplierCardGrid
              suppliers={SUPPLIERS}
              renderActions={(supplier) => <SupplierOrderActions supplier={supplier} />}
            />
          ) : (
            <SupplierCompareTable suppliers={SUPPLIERS} />
          )}
        </section>

        <aside className="flex flex-col gap-5">
          <LocationPreview />
          <RecommendationSummary />
        </aside>
      </div>
    </PageShell>
  );
}

function ViewToggleButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-9 flex-1 rounded-xl px-5 text-sm font-semibold sm:flex-none",
        selected
          ? "bg-white text-zinc-950 shadow-sm"
          : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800",
      ].join(" ")}
      aria-pressed={selected}
    >
      {children}
    </button>
  );
}
