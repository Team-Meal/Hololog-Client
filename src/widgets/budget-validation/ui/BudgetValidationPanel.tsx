"use client";

import { useEffect, useMemo, useState } from "react";
import type { Budget } from "@/entities/budget";
import {
  getOrderPlans,
  getOrderPlanById,
  type OrderPlanSummary,
  type OrderPlanDetail,
} from "@/entities/order-plan";
import { SectionTitle, StatusBadge, SurfaceCard } from "@/shared/ui";
import { validateOrderAgainstBudget, type BudgetVerdict } from "../lib/validate";

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
  const [plans, setPlans] = useState<OrderPlanSummary[] | null>(null);
  const [plansError, setPlansError] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<OrderPlanDetail | null>(null);
  const [detailError, setDetailError] = useState(false);

  // 발주 계획 목록 로드
  useEffect(() => {
    let alive = true;
    getOrderPlans()
      .then((data) => {
        if (!alive) return;
        setPlans(data);
        setPlansError(false);
        if (data.length > 0) setSelectedId((prev) => prev ?? data[0].id);
      })
      .catch(() => {
        if (alive) {
          setPlans([]);
          setPlansError(true);
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  // 선택된 발주 계획 상세 로드 (동기 setState 없이 비동기 결과에서만 갱신)
  useEffect(() => {
    if (selectedId === null) return;
    let alive = true;
    getOrderPlanById(selectedId)
      .then((data) => {
        if (alive) {
          setDetail(data);
          setDetailError(false);
        }
      })
      .catch(() => {
        if (alive) {
          setDetail(null);
          setDetailError(true);
        }
      });
    return () => {
      alive = false;
    };
  }, [selectedId]);

  // 선택된 계획의 상세를 아직 못 받았고 오류도 아니면 로딩으로 간주
  const detailLoading =
    selectedId !== null && !detailError && (detail === null || detail.id !== selectedId);

  // 상세가 현재 선택과 일치할 때만 검증 결과 계산 (직전 선택의 값으로 계산되지 않도록)
  const result = useMemo(
    () =>
      budget && detail && detail.id === selectedId
        ? validateOrderAgainstBudget(budget, detail.totalEstimatedCost)
        : null,
    [budget, detail, selectedId],
  );

  return (
    <SurfaceCard>
      <SectionTitle
        title="예산 검증"
        description="발주 예상비용을 현재 예산에 반영해 초과 여부를 확인합니다."
      />

      {/* 발주 계획 선택 */}
      <div className="mt-4 flex items-center gap-2">
        <span className="shrink-0 text-xs text-zinc-500">발주 계획</span>
        <select
          value={selectedId ?? ""}
          onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : null)}
          disabled={!plans || plans.length === 0}
          className="h-9 flex-1 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-zinc-50 disabled:text-zinc-400"
        >
          {plans && plans.length > 0 ? (
            plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.title}
                {plan.planDate ? ` · ${plan.planDate}` : ""}
              </option>
            ))
          ) : (
            <option value="">발주 계획 없음</option>
          )}
        </select>
      </div>

      {/* 본문 */}
      <div className="mt-4">
        {!budget ? (
          <Empty text="검증할 예산을 먼저 선택해 주세요." />
        ) : plansError ? (
          <Empty text="발주 계획을 불러오지 못했습니다." />
        ) : plans && plans.length === 0 ? (
          <Empty text="등록된 발주 계획이 없습니다. 발주 계획을 먼저 작성해 주세요." />
        ) : detailError ? (
          <Empty text="발주 계획 상세를 불러오지 못했습니다." />
        ) : detailLoading || !result ? (
          <div className="h-40 animate-pulse rounded-xl bg-zinc-100" />
        ) : (
          <Result result={result} />
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
