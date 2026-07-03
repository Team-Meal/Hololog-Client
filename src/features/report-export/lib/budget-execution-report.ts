import * as XLSX from "xlsx";
import { executionPercent, type Budget } from "@/entities/budget";
import { splitLocalCost, type IngredientItem } from "@/entities/ingredient";
import type { OrderPlanDetail } from "@/entities/order-plan";
import { totalSubstitutionSavings, type PriceQuote } from "@/entities/price";
import { escapeHtml, openPrintWindow, won } from "./html";

export interface BudgetExecutionStats {
  budgetTitle: string;
  totalAmount: number;
  usedAmount: number;
  remaining: number;
  executionPercentValue: number;
  localCost: number;
  localCostRate: number;
  estimatedSavings: number | null;
}

/** 예산 집행 리포트 통계 — entities/budget·entities/ingredient·entities/price의 순수함수를 재사용. */
export function computeBudgetExecutionStats(
  budget: Budget,
  orderPlanDetail: OrderPlanDetail,
  ingredients: IngredientItem[],
  priceItems: PriceQuote[],
): BudgetExecutionStats {
  const costLines = orderPlanDetail.items.map((i) => ({
    ingredientName: i.ingredientName,
    estimatedCost: i.estimatedCost,
  }));
  const localSplit = splitLocalCost(costLines, ingredients);

  const savingsLines = orderPlanDetail.items.map((i) => ({
    ingredientName: i.ingredientName,
    quantity: i.orderQuantity,
    unitPrice: i.unitPrice,
  }));

  return {
    budgetTitle: budget.title,
    totalAmount: budget.totalAmount,
    usedAmount: budget.usedAmount,
    remaining: budget.totalAmount - budget.usedAmount,
    executionPercentValue: executionPercent(budget.usedAmount, budget.totalAmount),
    localCost: localSplit.localCost,
    localCostRate: localSplit.localCostRate,
    estimatedSavings:
      priceItems.length > 0 ? totalSubstitutionSavings(savingsLines, priceItems) : null,
  };
}

/** 예산 집행 리포트를 엑셀(.xlsx)로 내려받는다. */
export function exportBudgetExecutionExcel(stats: BudgetExecutionStats): void {
  const rows = [
    ["예산 집행 리포트", ""],
    ["예산명", stats.budgetTitle],
    ["예산 총액", stats.totalAmount],
    ["집행액", stats.usedAmount],
    ["잔여액", stats.remaining],
    ["집행률(%)", stats.executionPercentValue],
    ["지역 농산물 발주 예정액", stats.localCost],
    ["지역 농산물 집행 비중(%)", Number(stats.localCostRate.toFixed(1))],
    ["예산 절감 예상액", stats.estimatedSavings ?? "연동 대기"],
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 22 }, { wch: 16 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "예산집행");
  XLSX.writeFile(wb, "예산_집행리포트.xlsx");
}

/** 예산 집행 리포트 인쇄용 HTML을 생성한다. */
export function buildBudgetExecutionPdfHtml(
  stats: BudgetExecutionStats,
  schoolName: string,
): string {
  const card = (label: string, value: string) => `
    <div class="card">
      <div class="card-label">${label}</div>
      <div class="card-value">${value}</div>
    </div>`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>예산 집행 리포트</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif; padding: 48px; color: #18181b; }
    h1 { text-align: center; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
    .sub { text-align: center; font-size: 12px; color: #71717a; margin-top: 6px; margin-bottom: 28px; }
    .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .card { border: 1px solid #e4e4e7; border-radius: 10px; padding: 16px; }
    .card-label { font-size: 11px; color: #71717a; }
    .card-value { font-size: 22px; font-weight: 700; margin-top: 4px; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <h1>예산 집행 리포트</h1>
  <p class="sub">${[schoolName ? escapeHtml(schoolName) : "", escapeHtml(stats.budgetTitle)].filter(Boolean).join(" · ")}</p>
  <div class="cards">
    ${card("예산 총액", won(stats.totalAmount))}
    ${card("집행액", won(stats.usedAmount))}
    ${card("잔여액", won(stats.remaining))}
    ${card("집행률", `${stats.executionPercentValue}%`)}
    ${card("지역 농산물 발주 예정액", won(stats.localCost))}
    ${card("지역 농산물 집행 비중", `${stats.localCostRate.toFixed(1)}%`)}
    ${card("예산 절감 예상액", stats.estimatedSavings !== null ? won(stats.estimatedSavings) : "연동 대기")}
  </div>
  <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); };<\/script>
</body>
</html>`;
}

export { openPrintWindow };
