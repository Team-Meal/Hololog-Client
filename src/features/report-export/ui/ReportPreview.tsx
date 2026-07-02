"use client";

import type { OrderPlanDetail } from "@/entities/order-plan";
import { EyeIcon } from "@/shared/ui";
import type { ReportKind } from "../model/types";
import type { LocalProduceStats } from "../lib/local-produce-report";
import { won, qty } from "../lib/html";

type PreviewMode = "screen" | "print";

interface Props {
  kind: ReportKind;
  orderPlanDetail: OrderPlanDetail | null;
  localStats: LocalProduceStats | null;
  loading: boolean;
  schoolName: string;
  previewMode: PreviewMode;
  onPreviewModeChange: (mode: PreviewMode) => void;
}

export function ReportPreview({
  kind,
  orderPlanDetail,
  localStats,
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
          ) : (
            <LocalProduceDoc stats={localStats} schoolName={schoolName} />
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

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="flex-1 rounded-xl border border-zinc-200 p-4">
      <p className="text-[11px] text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      <p className="mt-0.5 text-[11px] text-zinc-400">{sub}</p>
    </div>
  );
}
