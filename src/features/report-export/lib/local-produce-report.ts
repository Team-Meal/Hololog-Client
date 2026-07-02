import * as XLSX from "xlsx";
import { isInSeason, isLocalOrigin } from "@/entities/ingredient";
import type { IngredientItem } from "@/entities/ingredient";
import { escapeHtml, openPrintWindow } from "./html";

export interface CategoryCount {
  category: string;
  count: number;
}

export interface LocalProduceStats {
  month: number; // 기준 월 (1~12)
  total: number; // 전체 품목 수
  seasonalCount: number; // 제철 품목 수
  localCount: number; // 지역(국내산) 품목 수
  seasonalRate: number; // 제철 반영률 (%)
  localRate: number; // 지역농산물 활용률 (%)
  byCategory: CategoryCount[];
  seasonalItems: string[]; // 제철 품목명
  localItems: string[]; // 지역 품목명
}

function rate(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}

/** 현재 재고 목록으로 지역농산물 활용 통계를 계산한다. */
export function computeLocalProduceStats(items: IngredientItem[], now: Date): LocalProduceStats {
  const month = now.getMonth() + 1;
  const seasonalItems = items.filter((i) => isInSeason(i.name, month)).map((i) => i.name);
  const localItems = items.filter((i) => isLocalOrigin(i.origin)).map((i) => i.name);

  const categoryMap = new Map<string, number>();
  for (const item of items) {
    const key = item.category || "기타";
    categoryMap.set(key, (categoryMap.get(key) ?? 0) + 1);
  }
  const byCategory = [...categoryMap.entries()].map(([category, count]) => ({ category, count }));

  return {
    month,
    total: items.length,
    seasonalCount: seasonalItems.length,
    localCount: localItems.length,
    seasonalRate: rate(seasonalItems.length, items.length),
    localRate: rate(localItems.length, items.length),
    byCategory,
    seasonalItems,
    localItems,
  };
}

/** 지역농산물 활용 리포트를 엑셀(.xlsx)로 내려받는다. */
export function exportLocalProduceExcel(stats: LocalProduceStats): void {
  const summary = [
    ["지역농산물 활용 리포트", ""],
    ["기준 월", `${stats.month}월`],
    ["전체 품목 수", stats.total],
    ["제철 품목 수", stats.seasonalCount],
    ["제철 반영률(%)", stats.seasonalRate],
    ["지역농산물 품목 수", stats.localCount],
    ["지역농산물 활용률(%)", stats.localRate],
    ["", ""],
    ["카테고리", "품목 수"],
    ...stats.byCategory.map((c) => [c.category, c.count]),
  ];
  const ws = XLSX.utils.aoa_to_sheet(summary);
  ws["!cols"] = [{ wch: 20 }, { wch: 12 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "지역농산물활용");
  XLSX.writeFile(wb, "지역농산물_활용리포트.xlsx");
}

/** 지역농산물 활용 리포트 인쇄용 HTML을 생성한다. */
export function buildLocalProducePdfHtml(stats: LocalProduceStats, schoolName: string): string {
  const categoryRows = stats.byCategory
    .map((c) => `<tr><td>${escapeHtml(c.category)}</td><td class="num">${c.count}</td></tr>`)
    .join("");

  const card = (label: string, value: string, sub: string) => `
    <div class="card">
      <div class="card-label">${label}</div>
      <div class="card-value">${value}</div>
      <div class="card-sub">${sub}</div>
    </div>`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>지역농산물 활용 리포트</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif; padding: 48px; color: #18181b; }
    h1 { text-align: center; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
    .sub { text-align: center; font-size: 12px; color: #71717a; margin-top: 6px; margin-bottom: 28px; }
    .cards { display: flex; gap: 12px; margin-bottom: 28px; }
    .card { flex: 1; border: 1px solid #e4e4e7; border-radius: 10px; padding: 16px; }
    .card-label { font-size: 11px; color: #71717a; }
    .card-value { font-size: 26px; font-weight: 700; margin-top: 4px; }
    .card-sub { font-size: 11px; color: #a1a1aa; margin-top: 2px; }
    h2 { font-size: 13px; font-weight: 700; margin: 20px 0 8px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f4f4f5; border: 1px solid #d4d4d8; padding: 7px 8px; font-size: 11px; color: #3f3f46; text-align: left; }
    td { border: 1px solid #e4e4e7; padding: 6px 8px; font-size: 11px; }
    td.num { text-align: right; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <h1>지역농산물 활용 리포트</h1>
  <p class="sub">${[schoolName ? escapeHtml(schoolName) : "", `${stats.month}월 기준`].filter(Boolean).join(" · ")}</p>
  <div class="cards">
    ${card("지역농산물 활용률", `${stats.localRate}%`, `${stats.localCount} / ${stats.total} 품목`)}
    ${card("제철 반영률", `${stats.seasonalRate}%`, `${stats.seasonalCount} / ${stats.total} 품목`)}
    ${card("전체 품목", `${stats.total}`, "재고 등록 기준")}
  </div>
  <h2>카테고리별 품목 수</h2>
  <table>
    <thead><tr><th>카테고리</th><th>품목 수</th></tr></thead>
    <tbody>${categoryRows}</tbody>
  </table>
  <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); };<\/script>
</body>
</html>`;
}

export { openPrintWindow };
