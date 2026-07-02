"use client";

import { useEffect, useState } from "react";
import {
  getDiets,
  shortDate,
  weekdayLabel,
  getAllergensForMenuName,
  ALLERGEN_DISCLAIMER,
} from "@/entities/meal";
import type { DietListItem, PreviewMode, ExportFormType } from "@/entities/meal";
import { useMemberProfile } from "@/entities/member";
import { EyeIcon } from "@/shared/ui";
import { useExportStore } from "../model/export.store";

export function MealPreview() {
  const { previewMode, setPreviewMode, selectedForm } = useExportStore();
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
            form={selectedForm}
            schoolName={profile?.schoolName ?? ""}
          />
        </div>
      </div>
    </div>
  );
}

export function MealDocument({
  diets,
  loading,
  mode,
  form,
  schoolName,
}: {
  diets: DietListItem[];
  loading: boolean;
  mode: PreviewMode;
  form: ExportFormType;
  schoolName: string;
}) {
  if (loading) {
    return <p className="py-10 text-center text-sm text-zinc-400">불러오는 중…</p>;
  }
  if (diets.length === 0) {
    return <p className="py-10 text-center text-sm text-zinc-400">등록된 식단이 없습니다.</p>;
  }

  if (form === "student") {
    return <StudentDocument diets={diets} mode={mode} schoolName={schoolName} />;
  }

  return (
    <div
      className={["p-12 font-sans", mode === "print" ? "text-black" : "text-zinc-900"].join(" ")}
    >
      <div className="mb-8 text-center">
        <h1 className="mb-1 text-2xl font-bold tracking-tight">
          {form === "newsletter" ? "가정통신문 — 이번 달 급식 식단표" : "급식 식단표"}
        </h1>
        {schoolName && <p className="text-sm text-zinc-500">{schoolName}</p>}
        {form === "newsletter" && (
          <p className="mt-2 text-xs text-zinc-500">
            학부모님께, 이번 달 급식 식단과 알레르기 유발 항목을 안내해 드립니다.
          </p>
        )}
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border-b border-zinc-200 px-3 py-2.5 text-left text-xs font-semibold text-zinc-600">
              날짜
            </th>
            <th className="border-b border-zinc-200 px-3 py-2.5 text-left text-xs font-semibold text-zinc-600">
              식단
            </th>
            {form === "newsletter" && (
              <th className="border-b border-zinc-200 px-3 py-2.5 text-left text-xs font-semibold text-zinc-600">
                알레르기 유발 항목(추정)
              </th>
            )}
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
              {form === "newsletter" && (
                <td className="border-b border-zinc-100 px-3 py-3 align-top text-xs text-zinc-500">
                  {getAllergensForMenuName(diet.name).join(", ") || "-"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {form === "newsletter" ? (
        <p className="mt-6 rounded-lg bg-amber-50 p-3 text-[11px] text-amber-700">
          {ALLERGEN_DISCLAIMER}
        </p>
      ) : (
        <div className="mt-6 flex items-center justify-end gap-8 text-xs text-zinc-500">
          <span>
            영양교사 <span className="ml-1 text-zinc-300">(인)</span>
          </span>
          <span>
            학교장 <span className="ml-1 text-zinc-300">(인)</span>
          </span>
        </div>
      )}
    </div>
  );
}

function StudentDocument({
  diets,
  mode,
  schoolName,
}: {
  diets: DietListItem[];
  mode: PreviewMode;
  schoolName: string;
}) {
  return (
    <div
      className={["p-12 font-sans", mode === "print" ? "text-black" : "text-zinc-900"].join(" ")}
    >
      <div className="mb-8 text-center">
        <h1 className="mb-1 text-3xl font-extrabold tracking-tight text-blue-600">
          오늘 뭐 먹지? 🍽️
        </h1>
        {schoolName && <p className="text-sm text-zinc-500">{schoolName}</p>}
      </div>

      <div className="flex flex-col gap-3">
        {diets.map((diet) => (
          <div key={diet.id} className="flex items-center gap-4 rounded-2xl bg-blue-50 px-5 py-4">
            <span className="shrink-0 text-xs font-semibold text-blue-500">
              {shortDate(diet.dietDate)} ({weekdayLabel(diet.dietDate)})
            </span>
            <span className="text-base font-bold text-zinc-800">{diet.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
