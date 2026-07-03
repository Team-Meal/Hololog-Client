"use client";

import { useEffect, useMemo, useState } from "react";
import { useIngredientStore } from "@/entities/ingredient";
import type { OrderPlanDetail } from "@/entities/order-plan";
import { useOrderPlanCalcStore } from "@/entities/order-plan";
import { usePriceStore } from "@/entities/price";
import { useMemberProfile } from "@/entities/member";
import { getBudgets, selectActiveBudget, type Budget } from "@/entities/budget";
import { getDiets, type DietListItem } from "@/entities/meal";
import { SurfaceCard } from "@/shared/ui";
import type { ReportKind } from "../model/types";
import { computeLocalProduceStats } from "../lib/local-produce-report";
import { buildOrderPlanDetail } from "../lib/order-plan-source";
import {
  computeBudgetExecutionStats,
  type BudgetExecutionStats,
} from "../lib/budget-execution-report";
import { buildAllergyNoticeRows, type AllergyNoticeRow } from "../lib/allergy-notice-report";
import { ReportSelector } from "./ReportSelector";
import { ReportExportOptions } from "./ReportExportOptions";
import { ReportPreview } from "./ReportPreview";

type PreviewMode = "screen" | "print";

export function ReportPanel() {
  const { profile } = useMemberProfile();
  const schoolName = profile?.schoolName ?? "";

  const [kind, setKind] = useState<ReportKind>("order-plan");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("screen");

  const ingredients = useIngredientStore((s) => s.items);
  const fetchIngredients = useIngredientStore((s) => s.fetchIngredients);
  const priceItems = usePriceStore((s) => s.items);
  const fetchPrices = usePriceStore((s) => s.fetchPrices);
  const studentCount = useOrderPlanCalcStore((s) => s.studentCount);

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [diets, setDiets] = useState<DietListItem[]>([]);

  const now = useMemo(() => new Date(), []);

  useEffect(() => {
    if (ingredients.length === 0) void fetchIngredients();
    void fetchPrices();
    getBudgets()
      .then(setBudgets)
      .catch(() => setBudgets([]));
    getDiets()
      .then(setDiets)
      .catch(() => setDiets([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orderPlanDetail: OrderPlanDetail = useMemo(
    () => buildOrderPlanDetail(studentCount, ingredients, priceItems),
    [studentCount, ingredients, priceItems],
  );

  const localStats = useMemo(() => computeLocalProduceStats(ingredients, now), [ingredients, now]);

  const activeBudget = useMemo(() => selectActiveBudget(budgets), [budgets]);
  const budgetStats: BudgetExecutionStats | null = useMemo(
    () =>
      activeBudget
        ? computeBudgetExecutionStats(activeBudget, orderPlanDetail, ingredients, priceItems)
        : null,
    [activeBudget, orderPlanDetail, ingredients, priceItems],
  );

  const allergyRows: AllergyNoticeRow[] = useMemo(() => buildAllergyNoticeRows(diets), [diets]);

  const exportDisabled =
    kind === "order-plan"
      ? orderPlanDetail.items.length === 0
      : kind === "local-produce"
        ? localStats.total === 0
        : kind === "budget-execution"
          ? budgetStats === null
          : allergyRows.length === 0;

  return (
    <div className="grid h-full grid-cols-5 gap-6">
      <div className="col-span-2 flex flex-col gap-4">
        <SurfaceCard>
          <p className="mb-4 text-sm font-semibold text-zinc-800">리포트 선택</p>
          <ReportSelector kind={kind} onKindChange={setKind} />
        </SurfaceCard>
        <SurfaceCard>
          <p className="mb-4 text-sm font-semibold text-zinc-800">내보내기 옵션</p>
          <ReportExportOptions
            kind={kind}
            orderPlanDetail={orderPlanDetail}
            localStats={localStats}
            budgetStats={budgetStats}
            allergyRows={allergyRows}
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
          budgetStats={budgetStats}
          allergyRows={allergyRows}
          loading={false}
          schoolName={schoolName}
          previewMode={previewMode}
          onPreviewModeChange={setPreviewMode}
        />
      </SurfaceCard>
    </div>
  );
}
