"use client";

import type { OrderPlanSummary } from "@/entities/order-plan";
import { CheckIcon, ClipboardListIcon, LeafIcon } from "@/shared/ui";
import type { ReportKind } from "../model/types";

interface ReportOption {
  kind: ReportKind;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}

const REPORT_OPTIONS: ReportOption[] = [
  {
    kind: "order-plan",
    icon: <ClipboardListIcon size={18} className="text-blue-600" />,
    iconBg: "bg-blue-100",
    title: "발주 계획서",
    description: "메뉴별 필요량·부족량·발주량·예상비용",
  },
  {
    kind: "local-produce",
    icon: <LeafIcon size={18} className="text-green-600" />,
    iconBg: "bg-green-100",
    title: "지역농산물 활용 리포트",
    description: "지역·제철 활용률과 카테고리별 집계",
  },
];

interface Props {
  kind: ReportKind;
  onKindChange: (kind: ReportKind) => void;
  plans: OrderPlanSummary[] | null;
  selectedPlanId: number | null;
  onSelectPlan: (id: number | null) => void;
}

export function ReportSelector({ kind, onKindChange, plans, selectedPlanId, onSelectPlan }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {REPORT_OPTIONS.map((option) => {
        const isSelected = kind === option.kind;
        return (
          <div key={option.kind} className="flex flex-col">
            <button
              onClick={() => onKindChange(option.kind)}
              className={[
                "flex w-full items-center gap-4 rounded-xl p-4 text-left",
                isSelected ? "bg-blue-50" : "bg-white hover:bg-zinc-50",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  option.iconBg,
                ].join(" ")}
              >
                {option.icon}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span
                  className={[
                    "text-sm font-medium",
                    isSelected ? "text-blue-700" : "text-zinc-800",
                  ].join(" ")}
                >
                  {option.title}
                </span>
                <span className="text-xs text-zinc-500">{option.description}</span>
              </span>
              {isSelected && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600">
                  <CheckIcon size={11} className="text-white" strokeWidth={2.5} />
                </span>
              )}
            </button>

            {/* 발주 계획서는 어떤 계획을 쓸지 선택 */}
            {isSelected && option.kind === "order-plan" && (
              <div className="mt-2 flex items-center gap-2 px-1">
                <span className="shrink-0 text-xs text-zinc-500">발주 계획</span>
                <select
                  value={selectedPlanId ?? ""}
                  onChange={(e) => onSelectPlan(e.target.value ? Number(e.target.value) : null)}
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
            )}
          </div>
        );
      })}
    </div>
  );
}
