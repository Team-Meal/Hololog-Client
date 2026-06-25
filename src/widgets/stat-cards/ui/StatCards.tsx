import type { ComponentType } from "react";
import { ShoppingCartIcon, SparklesIcon, StatusBadge, SurfaceCard, UsersIcon } from "@/shared/ui";

type Tone = "green" | "blue";

interface Stat {
  icon: ComponentType<{ size?: number; className?: string }>;
  iconClass: string;
  label: string;
  value: string;
  unit: string;
  badge: string;
  badgeTone: Tone;
}

const STATS: Stat[] = [
  {
    icon: UsersIcon,
    iconClass: "bg-blue-50 text-blue-600",
    label: "오늘 급식 인원",
    value: "982",
    unit: "명",
    badge: "+4.2%",
    badgeTone: "green",
  },
  {
    icon: UsersIcon,
    iconClass: "bg-violet-50 text-violet-600",
    label: "내일 예상 인원",
    value: "1,010",
    unit: "명",
    badge: "AI 예측",
    badgeTone: "blue",
  },
  {
    icon: ShoppingCartIcon,
    iconClass: "bg-amber-50 text-amber-600",
    label: "이번 달 식자재 비용",
    value: "4,821",
    unit: "만원",
    badge: "67% 진행",
    badgeTone: "blue",
  },
  {
    icon: SparklesIcon,
    iconClass: "bg-emerald-50 text-emerald-600",
    label: "AI 예상 절감액",
    value: "264",
    unit: "만원",
    badge: "+38만원/주",
    badgeTone: "green",
  },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map((stat) => (
        <SurfaceCard key={stat.label}>
          <div className="flex items-start justify-between">
            <span
              className={`flex size-10 items-center justify-center rounded-xl ${stat.iconClass}`}
            >
              <stat.icon size={18} />
            </span>
            <StatusBadge tone={stat.badgeTone}>{stat.badge}</StatusBadge>
          </div>
          <p className="mt-4 text-sm text-zinc-500">{stat.label}</p>
          <p className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-zinc-950">{stat.value}</span>
            <span className="text-sm font-medium text-zinc-400">{stat.unit}</span>
          </p>
        </SurfaceCard>
      ))}
    </div>
  );
}
