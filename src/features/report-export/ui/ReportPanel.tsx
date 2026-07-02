"use client";

import { useEffect, useMemo, useState } from "react";
import { getIngredientsApi } from "@/entities/ingredient";
import type { IngredientItem } from "@/entities/ingredient";
import { getOrderPlans, getOrderPlanById } from "@/entities/order-plan";
import type { OrderPlanSummary, OrderPlanDetail } from "@/entities/order-plan";
import { useMemberProfile } from "@/entities/member";
import { SurfaceCard } from "@/shared/ui";
import type { ReportKind } from "../model/types";
import { computeLocalProduceStats } from "../lib/local-produce-report";
import { ReportSelector } from "./ReportSelector";
import { ReportExportOptions } from "./ReportExportOptions";
import { ReportPreview } from "./ReportPreview";

type PreviewMode = "screen" | "print";

export function ReportPanel() {
  const { profile } = useMemberProfile();
  const schoolName = profile?.schoolName ?? "";

  const [kind, setKind] = useState<ReportKind>("order-plan");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("screen");

  const [plans, setPlans] = useState<OrderPlanSummary[] | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [orderPlanDetail, setOrderPlanDetail] = useState<OrderPlanDetail | null>(null);
  const [orderPlanError, setOrderPlanError] = useState(false);

  const [ingredients, setIngredients] = useState<IngredientItem[] | null>(null);

  const now = useMemo(() => new Date(), []);

  // 발주 계획 목록
  useEffect(() => {
    let alive = true;
    getOrderPlans()
      .then((data) => {
        if (!alive) return;
        setPlans(data);
        if (data.length > 0) setSelectedPlanId((prev) => prev ?? data[0].id);
      })
      .catch(() => {
        if (alive) setPlans([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  // 재고 목록 (지역농산물 리포트용)
  useEffect(() => {
    let alive = true;
    getIngredientsApi()
      .then((data) => {
        if (alive) setIngredients(data);
      })
      .catch(() => {
        if (alive) setIngredients([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  // 선택된 발주 계획 상세
  useEffect(() => {
    if (selectedPlanId === null) return;
    let alive = true;
    getOrderPlanById(selectedPlanId)
      .then((data) => {
        if (alive) {
          setOrderPlanDetail(data);
          setOrderPlanError(false);
        }
      })
      .catch(() => {
        if (alive) {
          setOrderPlanDetail(null);
          setOrderPlanError(true);
        }
      });
    return () => {
      alive = false;
    };
  }, [selectedPlanId]);

  const localStats = useMemo(
    () => (ingredients ? computeLocalProduceStats(ingredients, now) : null),
    [ingredients, now],
  );

  const orderLoading =
    kind === "order-plan" &&
    selectedPlanId !== null &&
    !orderPlanError &&
    (orderPlanDetail === null || orderPlanDetail.id !== selectedPlanId);
  const localLoading = kind === "local-produce" && ingredients === null;
  const previewLoading = kind === "order-plan" ? orderLoading : localLoading;

  const exportDisabled =
    kind === "order-plan"
      ? orderPlanDetail === null || orderPlanDetail.id !== selectedPlanId
      : localStats === null || localStats.total === 0;

  return (
    <div className="grid h-full grid-cols-5 gap-6">
      <div className="col-span-2 flex flex-col gap-4">
        <SurfaceCard>
          <p className="mb-4 text-sm font-semibold text-zinc-800">리포트 선택</p>
          <ReportSelector
            kind={kind}
            onKindChange={setKind}
            plans={plans}
            selectedPlanId={selectedPlanId}
            onSelectPlan={setSelectedPlanId}
          />
        </SurfaceCard>
        <SurfaceCard>
          <p className="mb-4 text-sm font-semibold text-zinc-800">내보내기 옵션</p>
          <ReportExportOptions
            kind={kind}
            orderPlanDetail={orderPlanDetail}
            localStats={localStats}
            schoolName={schoolName}
            disabled={exportDisabled}
          />
        </SurfaceCard>
      </div>

      <SurfaceCard className="col-span-3 flex flex-col">
        <ReportPreview
          kind={kind}
          orderPlanDetail={orderPlanDetail}
          localStats={localStats}
          loading={previewLoading}
          schoolName={schoolName}
          previewMode={previewMode}
          onPreviewModeChange={setPreviewMode}
        />
      </SurfaceCard>
    </div>
  );
}
