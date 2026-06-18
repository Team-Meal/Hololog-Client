"use client";

import {
  ActivityIcon,
  LeafIcon,
  PackageIcon,
  RecycleIcon,
  SmileIcon,
  TagIcon,
  ThumbsUpIcon,
  WalletIcon,
  SurfaceCard,
} from "@/shared/ui";
import { useGeneratorStore } from "@/features/ai-meal-generator";

type IconComp = React.FC<{ size?: number; className?: string }>;

interface Metric {
  label: string;
  value: string;
  Icon: IconComp;
  iconBg: string;
  iconColor: string;
}

const REASON_ICONS: IconComp[] = [PackageIcon, ThumbsUpIcon, ActivityIcon, TagIcon];

export function EvaluationPanel() {
  const { status, result } = useGeneratorStore();
  const ev = result?.evaluation;

  const metrics: Metric[] = ev
    ? [
        {
          label: "예측 만족도",
          value: `${ev.satisfactionRate}%`,
          Icon: SmileIcon,
          iconBg: "bg-amber-50",
          iconColor: "text-amber-500",
        },
        {
          label: "비용 효율",
          value: `${ev.costEfficiency}점`,
          Icon: WalletIcon,
          iconBg: "bg-blue-50",
          iconColor: "text-blue-500",
        },
        {
          label: "영양 점수",
          value: `${ev.nutritionScore}점`,
          Icon: LeafIcon,
          iconBg: "bg-green-50",
          iconColor: "text-green-500",
        },
        {
          label: "잔반 감축 기여",
          value: `${ev.wasteReduction}%`,
          Icon: RecycleIcon,
          iconBg: "bg-emerald-50",
          iconColor: "text-emerald-500",
        },
      ]
    : [];

  return (
    <SurfaceCard className="flex flex-col overflow-hidden">
      <div className="mb-4">
        <p className="text-sm font-semibold text-zinc-800">생성 결과 평가</p>
      </div>

      {(status === "idle" || status === "loading") && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-zinc-200">
            <div className="h-4 w-4 rounded-full border-2 border-zinc-200" />
          </div>
          <p className="text-sm text-zinc-400">
            식단을 생성하면 만족도·비용·영양 점수와 추천 이유가 표시돼요.
          </p>
        </div>
      )}

      {status === "done" && ev && (
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {metrics.map(({ label, value, Icon, iconBg, iconColor }) => (
              <div key={label} className="rounded-lg bg-zinc-50 p-3">
                <div
                  className={`mb-2 flex h-7 w-7 items-center justify-center rounded-lg ${iconBg}`}
                >
                  <Icon size={14} className={iconColor} />
                </div>
                <p className="text-[11px] text-zinc-500">{label}</p>
                <p className="text-lg font-bold text-zinc-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-zinc-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-zinc-700">추천 이유</p>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                AI 신뢰도 {ev.aiConfidence}%
              </span>
            </div>
            <div className="mb-3 h-1.5 w-full rounded-full bg-blue-100">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${ev.aiConfidence}%` }}
              />
            </div>
            <ul className="flex flex-col gap-2.5">
              {ev.reasons.map((reason, i) => {
                const Icon = REASON_ICONS[i] ?? PackageIcon;
                return (
                  <li key={i} className="flex items-start gap-2">
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-zinc-200">
                      <Icon size={10} className="text-zinc-500" />
                    </div>
                    <p className="text-xs leading-relaxed text-zinc-600">{reason}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </SurfaceCard>
  );
}
