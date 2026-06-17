"use client";

import { Smile, Wallet, Leaf, Recycle, Package, ThumbsUp, Activity, Tag } from "lucide-react";
import { useGeneratorStore } from "@/features/ai-meal-generator";

type LucideIcon = React.FC<{ size?: number; className?: string }>;

interface Metric {
  label: string;
  value: string;
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

const REASON_ICONS: LucideIcon[] = [Package, ThumbsUp, Activity, Tag];

export function EvaluationPanel() {
  const { status, result } = useGeneratorStore();
  const ev = result?.evaluation;

  const metrics: Metric[] = ev
    ? [
        {
          label: "예측 만족도",
          value: `${ev.satisfactionRate}%`,
          Icon: Smile,
          iconBg: "bg-amber-50",
          iconColor: "text-amber-500",
        },
        {
          label: "비용 효율",
          value: `${ev.costEfficiency}점`,
          Icon: Wallet,
          iconBg: "bg-blue-50",
          iconColor: "text-blue-500",
        },
        {
          label: "영양 점수",
          value: `${ev.nutritionScore}점`,
          Icon: Leaf,
          iconBg: "bg-green-50",
          iconColor: "text-green-500",
        },
        {
          label: "잔반 감축 기여",
          value: `${ev.wasteReduction}%`,
          Icon: Recycle,
          iconBg: "bg-emerald-50",
          iconColor: "text-emerald-500",
        },
      ]
    : [];

  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-800">생성 결과 평가</p>
      </div>

      {(status === "idle" || status === "loading") && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-gray-200">
            <div className="h-4 w-4 rounded-full border-2 border-gray-200" />
          </div>
          <p className="text-sm text-gray-400">
            식단을 생성하면 만족도·비용·영양 점수와 추천 이유가 표시돼요.
          </p>
        </div>
      )}

      {status === "done" && ev && (
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          {/* Metric grid */}
          <div className="grid grid-cols-2 gap-2">
            {metrics.map(({ label, value, Icon, iconBg, iconColor }) => (
              <div key={label} className="rounded-lg bg-gray-50 p-3">
                <div
                  className={`mb-2 flex h-7 w-7 items-center justify-center rounded-lg ${iconBg}`}
                >
                  <Icon size={14} className={iconColor} />
                </div>
                <p className="text-[11px] text-gray-500">{label}</p>
                <p className="text-lg font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* AI confidence + reasons */}
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-700">추천 이유</p>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                AI 신뢰도 {ev.aiConfidence}%
              </span>
            </div>
            <div className="mb-3 h-1.5 w-full rounded-full bg-blue-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${ev.aiConfidence}%` }}
              />
            </div>
            <ul className="flex flex-col gap-2.5">
              {ev.reasons.map((reason, i) => {
                const Icon = REASON_ICONS[i] ?? Package;
                return (
                  <li key={i} className="flex items-start gap-2">
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-gray-200">
                      <Icon size={10} className="text-gray-500" />
                    </div>
                    <p className="text-xs leading-relaxed text-gray-600">{reason}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
