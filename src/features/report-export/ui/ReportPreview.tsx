"use client";

import type { OrderPlanDetail } from "@/entities/order-plan";
import { ALLERGEN_DISCLAIMER } from "@/entities/meal";
import { EyeIcon } from "@/shared/ui";
import type { ReportKind } from "../model/types";
import type { LocalProduceStats } from "../lib/local-produce-report";
import type { BudgetExecutionStats } from "../lib/budget-execution-report";
import type { AllergyNoticeRow } from "../lib/allergy-notice-report";
import { won, qty } from "../lib/html";

type PreviewMode = "screen" | "print";

interface Props {
  kind: ReportKind;
  orderPlanDetail: OrderPlanDetail | null;
  localStats: LocalProduceStats | null;
  budgetStats: BudgetExecutionStats | null;
  allergyRows: AllergyNoticeRow[];
  loading: boolean;
  schoolName: string;
  previewMode: PreviewMode;
  onPreviewModeChange: (mode: PreviewMode) => void;
}

export function ReportPreview({
  kind,
  orderPlanDetail,
  localStats,
  budgetStats,
  allergyRows,
  loading,
  schoolName,
  previewMode,
  onPreviewModeChange,
}: Props) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EyeIcon size={15} className="text-blue-500" />
          <span className="text-sm font-semibold text-zinc-800">실시간 미리보기</span>
        </div>
        <div className="flex rounded-lg bg-zinc-100 p-0.5">
          {(["screen", "print"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onPreviewModeChange(mode)}
              className={[
                "rounded-md px-3 py-1.5 text-xs font-medium",
                previewMode === mode
                  ? "bg-white text-zinc-800"
                  : "text-zinc-500 hover:text-zinc-700",
              ].join(" ")}
            >
              {mode === "screen" ? "화면" : "인쇄 모드"}
            </button>
          ))}
        </div>
      </div>

      <div
        className={[
          "flex flex-1 items-start justify-center overflow-auto rounded-xl p-6",
          previewMode === "screen" ? "bg-zinc-100" : "bg-zinc-200",
        ].join(" ")}
      >
        <div
          className={[
            "shrink-0 rounded-lg bg-white p-12 shadow-sm",
            previewMode === "print" ? "text-black" : "text-zinc-900",
          ].join(" ")}
          style={{ width: "794px", minHeight: "1123px" }}
        >
          {loading ? (
            <p className="py-10 text-center text-sm text-zinc-400">불러오는 중…</p>
          ) : kind === "order-plan" ? (
            <OrderPlanDoc detail={orderPlanDetail} schoolName={schoolName} />
          ) : kind === "local-produce" ? (
            <LocalProduceDoc stats={localStats} schoolName={schoolName} />
          ) : kind === "budget-execution" ? (
            <BudgetExecutionDoc stats={budgetStats} schoolName={schoolName} />
          ) : (
            <AllergyNoticeDoc rows={allergyRows} schoolName={schoolName} />
          )}
        </div>
      </div>
    </div>
  );
}

function OrderPlanDoc({
  detail,
  schoolName,
}: {
  detail: OrderPlanDetail | null;
  schoolName: string;
}) {
  if (!detail) {
    return <p className="py-10 text-center text-sm text-zinc-400">발주 계획을 선택해 주세요.</p>;
  }
  const meta = [
    schoolName,
    detail.planDate && `계획일 ${detail.planDate}`,
    detail.studentCount ? `인원 ${detail.studentCount.toLocaleString()}명` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">발주 계획서</h1>
        {meta && <p className="mt-1.5 text-xs text-zinc-500">{meta}</p>}
      </div>

      {detail.items.length === 0 ? (
        <p className="py-10 text-center text-sm text-zinc-400">발주 항목이 없습니다.</p>
      ) : (
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="bg-zinc-100 text-zinc-600">
              {[
                "메뉴",
                "필요농산물",
                "필요량",
                "단위",
                "재고",
                "부족량",
                "발주량",
                "공급처",
                "단가",
                "예상비용",
                "근거",
              ].map((h) => (
                <th key={h} className="border border-zinc-300 px-1.5 py-1.5 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {detail.items.map((i) => (
              <tr key={i.id}>
                <td className="border border-zinc-200 px-1.5 py-1.5">{i.menuName}</td>
                <td className="border border-zinc-200 px-1.5 py-1.5">{i.ingredientName}</td>
                <td className="border border-zinc-200 px-1.5 py-1.5 text-right">
                  {qty(i.requiredQuantity)}
                </td>
                <td className="border border-zinc-200 px-1.5 py-1.5">{i.unit}</td>
                <td className="border border-zinc-200 px-1.5 py-1.5 text-right">
                  {qty(i.currentStock)}
                </td>
                <td className="border border-zinc-200 px-1.5 py-1.5 text-right">
                  {qty(i.shortageQuantity)}
                </td>
                <td className="border border-zinc-200 px-1.5 py-1.5 text-right">
                  {qty(i.orderQuantity)}
                </td>
                <td className="border border-zinc-200 px-1.5 py-1.5">{i.supplierName}</td>
                <td className="border border-zinc-200 px-1.5 py-1.5 text-right whitespace-nowrap">
                  {won(i.unitPrice)}
                </td>
                <td className="border border-zinc-200 px-1.5 py-1.5 text-right whitespace-nowrap">
                  {won(i.estimatedCost)}
                </td>
                <td className="border border-zinc-200 px-1.5 py-1.5 text-[10px] text-zinc-500">
                  {i.basis}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-zinc-50 font-bold">
              <td className="border border-zinc-200 px-1.5 py-1.5" colSpan={9}>
                합계
              </td>
              <td className="border border-zinc-200 px-1.5 py-1.5 text-right whitespace-nowrap">
                {won(detail.totalEstimatedCost)}
              </td>
              <td className="border border-zinc-200 px-1.5 py-1.5" />
            </tr>
          </tfoot>
        </table>
      )}
      <p className="mt-4 text-right text-sm font-bold">
        총 예상비용 {won(detail.totalEstimatedCost)}
      </p>
    </>
  );
}

function LocalProduceDoc({
  stats,
  schoolName,
}: {
  stats: LocalProduceStats | null;
  schoolName: string;
}) {
  if (!stats || stats.total === 0) {
    return <p className="py-10 text-center text-sm text-zinc-400">집계할 재고가 없습니다.</p>;
  }
  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">지역농산물 활용 리포트</h1>
        <p className="mt-1.5 text-xs text-zinc-500">
          {[schoolName, `${stats.month}월 기준`].filter(Boolean).join(" · ")}
        </p>
      </div>

      <div className="mb-7 flex gap-3">
        <StatCard
          label="지역농산물 활용률"
          value={`${stats.localRate}%`}
          sub={`${stats.localCount} / ${stats.total} 품목`}
        />
        <StatCard
          label="제철 반영률"
          value={`${stats.seasonalRate}%`}
          sub={`${stats.seasonalCount} / ${stats.total} 품목`}
        />
        <StatCard label="전체 품목" value={String(stats.total)} sub="재고 등록 기준" />
      </div>

      <h2 className="mb-2 text-sm font-bold text-zinc-800">카테고리별 품목 수</h2>
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-zinc-100 text-zinc-600">
            <th className="border border-zinc-300 px-2 py-1.5 text-left font-semibold">카테고리</th>
            <th className="border border-zinc-300 px-2 py-1.5 text-right font-semibold">품목 수</th>
          </tr>
        </thead>
        <tbody>
          {stats.byCategory.map((c) => (
            <tr key={c.category}>
              <td className="border border-zinc-200 px-2 py-1.5">{c.category}</td>
              <td className="border border-zinc-200 px-2 py-1.5 text-right">{c.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function BudgetExecutionDoc({
  stats,
  schoolName,
}: {
  stats: BudgetExecutionStats | null;
  schoolName: string;
}) {
  if (!stats) {
    return <p className="py-10 text-center text-sm text-zinc-400">집계할 예산이 없습니다.</p>;
  }
  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">예산 집행 리포트</h1>
        <p className="mt-1.5 text-xs text-zinc-500">
          {[schoolName, stats.budgetTitle].filter(Boolean).join(" · ")}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="예산 총액" value={won(stats.totalAmount)} sub="설정 예산" />
        <StatCard
          label="집행액"
          value={won(stats.usedAmount)}
          sub={`집행률 ${stats.executionPercentValue}%`}
        />
        <StatCard
          label="잔여액"
          value={won(stats.remaining)}
          sub={stats.remaining < 0 ? "초과" : "여유"}
        />
        <StatCard
          label="지역 농산물 발주 예정액"
          value={won(stats.localCost)}
          sub={`집행 비중 ${stats.localCostRate.toFixed(1)}%`}
        />
        <StatCard
          label="예산 절감 예상액"
          value={stats.estimatedSavings !== null ? won(stats.estimatedSavings) : "연동 대기"}
          sub="가격 급등 품목 대체 기준"
        />
      </div>
    </>
  );
}

function AllergyNoticeDoc({ rows, schoolName }: { rows: AllergyNoticeRow[]; schoolName: string }) {
  if (rows.length === 0) {
    return <p className="py-10 text-center text-sm text-zinc-400">등록된 식단이 없습니다.</p>;
  }
  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">알레르기 안내표</h1>
        <p className="mt-1.5 text-xs text-zinc-500">{schoolName}</p>
      </div>

      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-zinc-100 text-zinc-600">
            <th className="border border-zinc-300 px-2 py-1.5 text-left font-semibold">날짜</th>
            <th className="border border-zinc-300 px-2 py-1.5 text-left font-semibold">메뉴</th>
            <th className="border border-zinc-300 px-2 py-1.5 text-left font-semibold">
              알레르기 유발 항목(추정)
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="border border-zinc-200 px-2 py-1.5">{r.dietDate}</td>
              <td className="border border-zinc-200 px-2 py-1.5">{r.name}</td>
              <td className="border border-zinc-200 px-2 py-1.5">
                {r.allergens.length > 0 ? r.allergens.join(", ") : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 rounded-lg bg-amber-50 p-3 text-[11px] text-amber-700">
        {ALLERGEN_DISCLAIMER}
      </p>
    </>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="flex-1 rounded-xl border border-zinc-200 p-4">
      <p className="text-[11px] text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      <p className="mt-0.5 text-[11px] text-zinc-400">{sub}</p>
    </div>
  );
}
