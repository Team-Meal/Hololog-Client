import type { OrderStat } from "../model/types";
import { OrderStatCard } from "./OrderStatCard";

/** 요약 통계 카드들을 4열 그리드로 나열한다. */
export function OrderStatGrid({ stats }: { stats: OrderStat[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <OrderStatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
