"use client";

import { useMemo, useState } from "react";
import { FormulaHint, SurfaceCard, TriangleAlertIcon, WalletIcon } from "@/shared/ui";
import { useGeneratorStore, useMealScoring } from "@/features/ai-meal-generator";
import { useOrderPlanItems } from "@/features/order-plan-calc";
import { DEMO_RECIPES } from "@/entities/recipe";

const TOP_N = 5;

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

const won = (value: number) => `₩${Math.round(value).toLocaleString("ko-KR")}`;

export function EvaluationPanel() {
  const { status, result } = useGeneratorStore();
  const { scoredMenus, metrics } = useMealScoring();
  const [showRaw, setShowRaw] = useState(false);

  const topMenus = useMemo(
    () => [...scoredMenus].sort((a, b) => b.score - a.score).slice(0, TOP_N),
    [scoredMenus],
  );
  const topRecipes = useMemo(
    () =>
      DEMO_RECIPES.filter((r) =>
        topMenus.some((m) => m.menuName === r.menuName && m.ingredientName === r.ingredientName),
      ),
    [topMenus],
  );
  const { totalEstimatedCost } = useOrderPlanItems(topRecipes);

  const budgetEntries = result ? Object.entries(result.budgetInfo ?? {}) : [];
  const validationErrors = result?.validationErrors ?? [];

  return (
    <SurfaceCard className="flex flex-col overflow-hidden">
      <div className="mb-4">
        <p className="text-sm font-semibold text-zinc-800">예산 · 검증</p>
      </div>

      {(status === "idle" || status === "loading") && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-zinc-200">
            <div className="h-4 w-4 rounded-full border-2 border-zinc-200" />
          </div>
          <p className="text-sm text-zinc-400">식단을 생성하면 예산 정보와 검증 결과가 표시돼요.</p>
        </div>
      )}

      {status === "done" && result && (
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            <Metric
              label="지역 농산물 활용률"
              value={`${metrics.localUsageRatePercent.toFixed(0)}%`}
              formulaTitle="지역 농산물 활용률"
              formulaLines={["상위 후보 메뉴 중 원산지가 지역산인 비율"]}
            />
            <Metric
              label="제철 반영률"
              value={`${metrics.seasonalRatePercent.toFixed(0)}%`}
              formulaTitle="제철 반영률"
              formulaLines={["제철 반영률 = (제철 품목 수 ÷ 전체 사용 품목 수) × 100"]}
            />
            <Metric
              label="1인 단가"
              value={won(metrics.perPersonCost)}
              formulaTitle="1인당 단가"
              formulaLines={["1인당 단가 = 총 식재료비 ÷ 급식 인원"]}
            />
            <Metric
              label="예상 발주비"
              value={won(totalEstimatedCost)}
              formulaTitle="예상 발주비"
              formulaLines={["상위 후보 메뉴의 발주 자동계산 예상비용 합계"]}
            />
            <Metric
              label="폐기 감소 예상"
              value={`${metrics.estimatedWasteReductionKg.toFixed(1)}kg`}
              formulaTitle="폐기 감소 예상량"
              formulaLines={[
                "폐기 감소 예상량 = (직전 평균 폐기율 − AI 식단 적용 후 예상 폐기율) × 식수량",
                "* 이력 데이터가 없어 가정값 기반 근사치입니다.",
              ]}
            />
            <Metric
              label="영양 기준 적합"
              value={`${metrics.nutritionMatchRatio.toFixed(0)}%`}
              formulaTitle="영양 기준 적합"
              formulaLines={["선택한 영양 기준 태그와 일치하는 상위 후보 메뉴 비율"]}
            />
          </div>

          <div className="rounded-lg bg-zinc-50 p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <TriangleAlertIcon
                size={14}
                className={validationErrors.length > 0 ? "text-amber-500" : "text-emerald-500"}
              />
              <p className="text-xs font-semibold text-zinc-700">
                검증 {validationErrors.length > 0 ? `(${validationErrors.length})` : ""}
              </p>
            </div>
            {validationErrors.length === 0 ? (
              <p className="text-xs text-emerald-600">검증을 통과했어요.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {validationErrors.map((err, i) => (
                  <li key={i} className="text-xs leading-relaxed text-zinc-600">
                    {formatValue(err)}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowRaw((v) => !v)}
            className="flex items-center gap-1.5 text-left text-xs font-medium text-zinc-400 hover:text-zinc-600"
          >
            <WalletIcon size={12} />
            {showRaw ? "원본 응답 숨기기" : "원본 응답 보기"}
          </button>
          {showRaw && (
            <div className="rounded-lg bg-zinc-50 p-3">
              {budgetEntries.length === 0 ? (
                <p className="text-xs text-zinc-400">예산 정보가 없습니다.</p>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {budgetEntries.map(([key, value]) => (
                    <li key={key} className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-zinc-500">{key}</span>
                      <span className="font-medium text-zinc-800">{formatValue(value)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </SurfaceCard>
  );
}

function Metric({
  label,
  value,
  formulaTitle,
  formulaLines,
}: {
  label: string;
  value: string;
  formulaTitle: string;
  formulaLines: string[];
}) {
  return (
    <div className="rounded-lg bg-zinc-50 p-3">
      <div className="flex items-center gap-1">
        <p className="text-[11px] text-zinc-500">{label}</p>
        <FormulaHint title={formulaTitle} lines={formulaLines} />
      </div>
      <p className="text-lg font-bold text-zinc-900">{value}</p>
    </div>
  );
}
