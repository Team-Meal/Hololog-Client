import { PackageIcon, ShoppingCartIcon, SparklesIcon, WalletIcon } from "@/shared/ui";

import type { OrderStat, OrderStatTone } from "../model/types";

const ICONS = {
  package: PackageIcon,
  cart: ShoppingCartIcon,
  wallet: WalletIcon,
  sparkles: SparklesIcon,
} as const;

const TONE_TAG: Record<OrderStatTone, string> = {
  neutral: "bg-blue-50 text-blue-600",
  warning: "bg-amber-50 text-amber-600",
  success: "bg-emerald-50 text-emerald-600",
};

const TONE_DOT: Record<OrderStatTone, string> = {
  neutral: "bg-blue-500",
  warning: "bg-amber-500",
  success: "bg-emerald-500",
};

/** 상단 요약 통계 1건을 표시하는 카드. */
export function OrderStatCard({ stat }: { stat: OrderStat }) {
  const Icon = ICONS[stat.icon];

  return (
    <article className="rounded-2xl bg-white p-5 shadow-(--shadow-card)">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Icon className="size-6" />
        </span>
        <span
          className={[
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
            TONE_TAG[stat.tone],
          ].join(" ")}
        >
          <span className={["size-1.5 rounded-full", TONE_DOT[stat.tone]].join(" ")} />
          {stat.tag}
        </span>
      </div>

      <p className="mt-5 flex items-baseline gap-1.5">
        <span className="text-3xl font-bold text-zinc-950">{stat.value}</span>
        <span className="text-sm font-semibold text-zinc-400">{stat.unit}</span>
      </p>
      <p className="mt-1 text-sm font-medium text-zinc-500">{stat.label}</p>
    </article>
  );
}
