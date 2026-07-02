"use client";

import { useMemo } from "react";
import type { Budget } from "@/entities/budget";
import { useIngredientStore } from "@/entities/ingredient";
import { usePriceStore } from "@/entities/price";
import { useOrderPlanCalcStore, useOrderPlanItems } from "@/features/order-plan-calc";
import { SectionTitle, StatusBadge, SurfaceCard } from "@/shared/ui";
import { validateOrderAgainstBudget, type BudgetVerdict } from "../lib/validate";
import { buildBudgetKpis, buildSpikeSubstitutions } from "../lib/budget-kpis";
import { BudgetKpiExtras } from "./BudgetKpiExtras";
import { PriceSpikePanel } from "./PriceSpikePanel";

const won = (value: number) => `₩${Math.round(value).toLocaleString()}`;

const VERDICT_META: Record<
  BudgetVerdict,
  { label: string; tone: "green" | "amber" | "red"; bar: string }
> = {
  within: { label: "예산 내", tone: "green", bar: "bg-emerald-500" },
  warning: { label: "예산 임박", tone: "amber", bar: "bg-amber-500" },
  over: { label: "예산 초과", tone: "red", bar: "bg-red-500" },
};

interface Props {
  budget: Budget | null;
}

export function BudgetValidationPanel({ budget }: Props) {
  const studentCount = useOrderPlanCalcStore((s) => s.studentCount);
  const setStudentCount = useOrderPlanCalcStore((s) => s.setStudentCount);
  const { items, totalEstimatedCost, isLoading } = useOrderPlanItems();

  const ingredients = useIngredientStore((s) => s.items);
  const priceItems = usePriceStore((s) => s.items);

  const result = useMemo(
    () => (budget ? validateOrderAgainstBudget(budget, totalEstimatedCost) : null),
    [budget, totalEstimatedCost],
  );

  const kpis = useMemo(
    () => buildBudgetKpis(items, studentCount, ingredients),
    [items, studentCount, ingredients],
  );

  const spikeSummary = useMemo(
    () => buildSpikeSubstitutions(priceItems, items),
    [priceItems, items],
  );

  return (
    <SurfaceCard>
      <SectionTitle
        title="농산물 예산 분석"
        description="농산물 발주 계획표(같은 급식 인원 기준)의 예상비용을 현재 예산에 반영해 초과 여부를 확인합니다."
      />

      <div className="mt-4 flex items-center gap-2">
        <span className="shrink-0 text-xs text-zinc-500">급식 인원</span>
        <input
          type="number"
          min={0}
          value={studentCount}
          onChange={(e) => setStudentCount(Number(e.target.value))}
          className="h-9 w-24 rounded-lg border border-zinc-200 bg-white px-3 text-right text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <span className="text-xs text-zinc-400">명</span>
      </div>

      <div className="mt-4">
        {!budget ? (
          <Empty text="검증할 예산을 먼저 선택해 주세요." />
        ) : isLoading && items.length === 0 ? (
          <div className="h-40 animate-pulse rounded-xl bg-zinc-100" />
        ) : result ? (
          <div className="flex flex-col gap-4">
            <Result result={result} />
            <BudgetKpiExtras
              kpis={kpis}
              savingsWon={priceItems.length > 0 ? spikeSummary.totalSavings : null}
            />
            <PriceSpikePanel substitutions={spikeSummary.substitutions} />
          </div>
        ) : (
          <Empty text="예산 정보를 계산할 수 없습니다." />
        )}
      </div>
    </SurfaceCard>
  );
}

function Result({
  result,
}: {
  result: NonNullable<ReturnType<typeof validateOrderAgainstBudget>>;
}) {
  const meta = VERDICT_META[result.verdict];
  const barPct = Math.min(result.usageRatio * 100, 100);

  return (
    <div className="flex flex-col gap-4">
      {/* 판정 */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-600">판정</span>
        <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
      </div>

      {/* 집행 게이지 (기집행 + 이번 발주) */}
      <div className="flex flex-col gap-1.5">
        <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100">
          <div className={`h-full rounded-full ${meta.bar}`} style={{ width: `${barPct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-zinc-400">
          <span>발주 후 누계 {won(result.projectedUsed)}</span>
          <span>예산 {won(result.total)}</span>
        </div>
      </div>

      {/* 상세 내역 */}
      <dl className="flex flex-col divide-y divide-zinc-100 text-sm">
        <Row label="예산 총액" value={won(result.total)} />
        <Row label="기집행액" value={won(result.used)} />
        <Row label="이번 발주 예상비용" value={won(result.orderCost)} accent />
        <Row
          label={result.remaining < 0 ? "초과 금액" : "발주 후 잔여"}
          value={won(Math.abs(result.remaining))}
          tone={result.remaining < 0 ? "over" : "within"}
        />
      </dl>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
  tone,
}: {
  label: string;
  value: string;
  accent?: boolean;
  tone?: "over" | "within";
}) {
  const valueColor =
    tone === "over" ? "text-red-600" : tone === "within" ? "text-emerald-600" : "text-zinc-900";
  return (
    <div className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
      <dt className={accent ? "font-medium text-zinc-700" : "text-zinc-500"}>{label}</dt>
      <dd className={`font-semibold ${valueColor}`}>{value}</dd>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center py-10 text-center text-sm text-zinc-400">
      {text}
    </div>
  );
}
