"use client";

import { useEffect, useState } from "react";
import { getDiets, shortDate, weekdayLabel } from "@/entities/meal";
import type { DietListItem, PreviewMode } from "@/entities/meal";
import { useMemberProfile } from "@/entities/member";
import { EyeIcon } from "@/shared/ui";
import { useExportStore } from "../model/export.store";

export function MealPreview() {
  const { previewMode, setPreviewMode } = useExportStore();
  const { profile } = useMemberProfile();
  const [diets, setDiets] = useState<DietListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getDiets()
      .then((list) => {
        if (active) setDiets(list);
      })
      .catch(() => {
        if (active) setDiets([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EyeIcon size={15} className="text-blue-500" />
          <span className="text-sm font-semibold text-zinc-800">실시간 미리보기</span>
        </div>
        <div className="flex rounded-lg bg-zinc-100 p-0.5">
          {(["screen", "print"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setPreviewMode(mode)}
              className={[
                "rounded-md px-3 py-1.5 text-xs font-medium",
                previewMode === mode
                  ? "bg-white text-zinc-800"
                  : "text-zinc-500 hover:text-zinc-700",
              ].join(" ")}
            >
              {mode === "screen" ? "화면" : "인쇄 모드"}
            </button>
          ))}
        </div>
      </div>

      <div
        className={[
          "flex flex-1 items-start justify-center overflow-auto rounded-xl p-6",
          previewMode === "screen" ? "bg-zinc-100" : "bg-zinc-200",
        ].join(" ")}
      >
        <div
          className="shrink-0 rounded-lg bg-white shadow-sm"
          style={{ width: "794px", minHeight: "1123px" }}
        >
          <MealDocument
            diets={diets}
            loading={loading}
            mode={previewMode}
            schoolName={profile?.schoolName ?? ""}
          />
        </div>
      </div>
    </div>
  );
}

function MealDocument({
  diets,
  loading,
  mode,
  schoolName,
}: {
  diets: DietListItem[];
  loading: boolean;
  mode: PreviewMode;
  schoolName: string;
}) {
  return (
    <div className={["p-12 font-sans", mode === "print" ? "text-black" : "text-zinc-900"].join(" ")}>
      <div className="mb-8 text-center">
        <h1 className="mb-1 text-2xl font-bold tracking-tight">급식 식단표</h1>
        {schoolName && <p className="text-sm text-zinc-500">{schoolName}</p>}
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-zinc-400">불러오는 중…</p>
      ) : diets.length === 0 ? (
        <p className="py-10 text-center text-sm text-zinc-400">등록된 식단이 없습니다.</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-zinc-200 px-3 py-2.5 text-left text-xs font-semibold text-zinc-600">
                날짜
              </th>
              <th className="border-b border-zinc-200 px-3 py-2.5 text-left text-xs font-semibold text-zinc-600">
                식단
              </th>
            </tr>
          </thead>
          <tbody>
            {diets.map((diet) => (
              <tr key={diet.id}>
                <td className="border-b border-zinc-100 px-3 py-3 align-top text-xs text-zinc-600">
                  {shortDate(diet.dietDate)} ({weekdayLabel(diet.dietDate)})
                </td>
                <td className="border-b border-zinc-100 px-3 py-3 align-top text-sm font-medium text-zinc-800">
                  {diet.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-6 flex items-center justify-end gap-8 text-xs text-zinc-500">
        <span>
          영양교사 <span className="ml-1 text-zinc-300">(인)</span>
        </span>
        <span>
          학교장 <span className="ml-1 text-zinc-300">(인)</span>
        </span>
      </div>
    </div>
  );
}
