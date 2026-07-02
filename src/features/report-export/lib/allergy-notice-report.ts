import * as XLSX from "xlsx";
import { getAllergensForMenuName, ALLERGEN_DISCLAIMER, type DietListItem } from "@/entities/meal";
import { escapeHtml, openPrintWindow } from "./html";

export interface AllergyNoticeRow {
  dietDate: string;
  name: string;
  allergens: string[];
}

/** 등록된 식단 목록에서 알레르기 안내표 행을 구성한다(메뉴명 키워드 기반 추정). */
export function buildAllergyNoticeRows(diets: DietListItem[]): AllergyNoticeRow[] {
  return diets
    .map((diet) => ({
      dietDate: diet.dietDate,
      name: diet.name,
      allergens: getAllergensForMenuName(diet.name),
    }))
    .sort((a, b) => a.dietDate.localeCompare(b.dietDate));
}

/** 알레르기 안내표를 엑셀(.xlsx)로 내려받는다. */
export function exportAllergyNoticeExcel(rows: AllergyNoticeRow[]): void {
  const header = ["날짜", "메뉴", "알레르기 유발 항목(추정)"];
  const body = rows.map((r) => [r.dietDate, r.name, r.allergens.join(", ") || "-"]);
  const ws = XLSX.utils.aoa_to_sheet([header, ...body, [], [ALLERGEN_DISCLAIMER]]);
  ws["!cols"] = [{ wch: 12 }, { wch: 20 }, { wch: 30 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "알레르기안내표");
  XLSX.writeFile(wb, "알레르기_안내표.xlsx");
}

/** 알레르기 안내표 인쇄용 HTML을 생성한다. */
export function buildAllergyNoticePdfHtml(rows: AllergyNoticeRow[], schoolName: string): string {
  const bodyRows = rows
    .map(
      (r) => `
      <tr>
        <td>${escapeHtml(r.dietDate)}</td>
        <td>${escapeHtml(r.name)}</td>
        <td>${r.allergens.length > 0 ? escapeHtml(r.allergens.join(", ")) : "-"}</td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>알레르기 안내표</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif; padding: 48px; color: #18181b; }
    h1 { text-align: center; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
    .sub { text-align: center; font-size: 12px; color: #71717a; margin-top: 6px; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f4f4f5; border: 1px solid #d4d4d8; padding: 7px 8px; font-size: 11px; color: #3f3f46; text-align: left; }
    td { border: 1px solid #e4e4e7; padding: 6px 8px; font-size: 11px; }
    .disclaimer { margin-top: 16px; font-size: 11px; color: #b45309; background: #fffbeb; border-radius: 8px; padding: 10px 12px; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <h1>알레르기 안내표</h1>
  <p class="sub">${schoolName ? escapeHtml(schoolName) : ""}</p>
  <table>
    <thead><tr><th>날짜</th><th>메뉴</th><th>알레르기 유발 항목(추정)</th></tr></thead>
    <tbody>${bodyRows}</tbody>
  </table>
  <p class="disclaimer">${escapeHtml(ALLERGEN_DISCLAIMER)}</p>
  <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); };<\/script>
</body>
</html>`;
}

export { openPrintWindow };
