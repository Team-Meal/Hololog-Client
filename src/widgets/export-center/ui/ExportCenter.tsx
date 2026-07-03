"use client";

import { useState } from "react";
import { SurfaceCard } from "@/shared/ui";
import { FormSelector, ExportOptions, MealPreview } from "@/features/meal-export";
import { ReportPanel } from "@/features/report-export";

type Category = "meal" | "report";

const TABS: { key: Category; label: string }[] = [
  { key: "meal", label: "식단표" },
  { key: "report", label: "리포트" },
];

export function ExportCenter() {
  const [category, setCategory] = useState<Category>("meal");

  return (
    <div className="flex h-full flex-col gap-4">
      {/* 카테고리 탭 */}
      <div className="flex w-fit rounded-lg bg-zinc-100 p-0.5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCategory(tab.key)}
            className={[
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              category === tab.key
                ? "bg-white text-zinc-800 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {category === "meal" ? (
        <div className="grid flex-1 grid-cols-5 gap-6">
          <div className="col-span-2 flex flex-col gap-4">
            <SurfaceCard>
              <p className="mb-4 text-sm font-semibold text-zinc-800">양식 선택</p>
              <FormSelector />
            </SurfaceCard>
            <SurfaceCard>
              <p className="mb-4 text-sm font-semibold text-zinc-800">내보내기 옵션</p>
              <ExportOptions />
            </SurfaceCard>
          </div>

          <SurfaceCard className="col-span-3 flex flex-col">
            <MealPreview />
          </SurfaceCard>
        </div>
      ) : (
        <div className="flex-1">
          <ReportPanel />
        </div>
      )}
    </div>
  );
}
