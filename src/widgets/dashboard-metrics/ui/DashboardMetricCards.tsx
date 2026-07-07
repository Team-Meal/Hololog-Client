"use client";

import { SurfaceCard } from "@/shared/ui";
import { useDashboardMetrics } from "../model/useDashboardMetrics";
import { KpiCard } from "./KpiCard";

const won = (value: number) => `₩${Math.round(value).toLocaleString("ko-KR")}`;

export function DashboardMetricCards() {
  const { metrics, isLoading } = useDashboardMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SurfaceCard key={i} className="h-24 animate-pulse">
            {null}
          </SurfaceCard>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="지역 농산물 사용률"
        value={`${metrics.localUsageRatePercent.toFixed(1)}%`}
        sub={metrics.localUsageBasis}
        formulaTitle="지역 농산물 사용률"
        formulaLines={["지역 농산물 사용률 = (지역 농산물 식재료비 ÷ 전체 식재료비) × 100"]}
      />
      <KpiCard
        label="제철 반영률"
        value={`${metrics.seasonalRatePercent.toFixed(1)}%`}
        sub={metrics.seasonalRateBasis}
        formulaTitle="제철 반영률"
        formulaLines={["제철 반영률 = (제철 품목 수 ÷ 전체 사용 품목 수) × 100"]}
      />
      <KpiCard
        label="폐기 위험 재고"
        value={`${metrics.expiringSoonCount}개`}
        sub="유통기한 임박 기준"
        formulaTitle="폐기 위험 재고"
        formulaLines={["폐기 위험 재고 = 유통기한이 임박 기준(3일) 이내로 남은 품목 수"]}
      />
      <KpiCard
        label="지역 농가 발주 예정액"
        value={won(metrics.localOrderCost)}
        sub="현재 발주표 기준"
        formulaTitle="지역 농가 발주 예정액"
        formulaLines={["지역 농가 발주 예정액 = Σ(원산지가 지역산인 발주 항목의 예상비용)"]}
      />
    </div>
  );
}
