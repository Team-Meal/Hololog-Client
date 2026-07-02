import * as XLSX from "xlsx";
import type { OrderPlanDetail } from "@/entities/order-plan";
import { escapeHtml, openPrintWindow, won, qty } from "./html";

const COLUMNS = [
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
] as const;

function fileBase(detail: OrderPlanDetail): string {
  return `발주계획서_${detail.title || detail.id}`;
}

/** 발주 계획서를 엑셀(.xlsx)로 내려받는다. */
export function exportOrderPlanExcel(detail: OrderPlanDetail): void {
  const rows = detail.items.map((i) => [
    i.menuName,
    i.ingredientName,
    i.requiredQuantity,
    i.unit,
    i.currentStock,
    i.shortageQuantity,
    i.orderQuantity,
    i.supplierName,
    i.unitPrice,
    i.estimatedCost,
    i.basis,
  ]);
  const totalRow = ["합계", "", "", "", "", "", "", "", "", detail.totalEstimatedCost, ""];
  const ws = XLSX.utils.aoa_to_sheet([[...COLUMNS], ...rows, totalRow]);
  ws["!cols"] = [
    { wch: 16 },
    { wch: 14 },
    { wch: 8 },
    { wch: 6 },
    { wch: 8 },
    { wch: 8 },
    { wch: 8 },
    { wch: 14 },
    { wch: 10 },
    { wch: 12 },
    { wch: 26 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "발주계획서");
  XLSX.writeFile(wb, `${fileBase(detail)}.xlsx`);
}

/** 발주 계획서 인쇄용 HTML을 생성한다. */
export function buildOrderPlanPdfHtml(detail: OrderPlanDetail, schoolName: string): string {
  const bodyRows = detail.items
    .map(
      (i) => `
      <tr>
        <td>${escapeHtml(i.menuName)}</td>
        <td>${escapeHtml(i.ingredientName)}</td>
        <td class="num">${qty(i.requiredQuantity)}</td>
        <td>${escapeHtml(i.unit)}</td>
        <td class="num">${qty(i.currentStock)}</td>
        <td class="num">${qty(i.shortageQuantity)}</td>
        <td class="num">${qty(i.orderQuantity)}</td>
        <td>${escapeHtml(i.supplierName)}</td>
        <td class="num">${won(i.unitPrice)}</td>
        <td class="num">${won(i.estimatedCost)}</td>
        <td class="basis">${escapeHtml(i.basis)}</td>
      </tr>`,
    )
    .join("");

  const meta = [
    schoolName ? escapeHtml(schoolName) : "",
    detail.planDate ? `계획일 ${escapeHtml(detail.planDate)}` : "",
    detail.studentCount ? `인원 ${detail.studentCount.toLocaleString()}명` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>발주 계획서</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif; padding: 48px; color: #18181b; }
    h1 { text-align: center; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
    .sub { text-align: center; font-size: 12px; color: #71717a; margin-top: 6px; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f4f4f5; border: 1px solid #d4d4d8; padding: 7px 6px; font-size: 11px; color: #3f3f46; }
    td { border: 1px solid #e4e4e7; padding: 6px; font-size: 11px; vertical-align: top; }
    td.num { text-align: right; white-space: nowrap; }
    td.basis { color: #71717a; font-size: 10px; }
    tfoot td { font-weight: 700; background: #fafafa; }
    .total { margin-top: 16px; text-align: right; font-size: 13px; font-weight: 700; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <h1>발주 계획서</h1>
  <p class="sub">${meta}</p>
  <table>
    <thead>
      <tr>${COLUMNS.map((c) => `<th>${c}</th>`).join("")}</tr>
    </thead>
    <tbody>${bodyRows}</tbody>
    <tfoot>
      <tr>
        <td colspan="9">합계</td>
        <td class="num">${won(detail.totalEstimatedCost)}</td>
        <td></td>
      </tr>
    </tfoot>
  </table>
  <p class="total">총 예상비용 ${won(detail.totalEstimatedCost)}</p>
  <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); };<\/script>
</body>
</html>`;
}

export { openPrintWindow };
