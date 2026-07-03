"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Button, FileDownIcon, PrinterIcon, TableIcon } from "@/shared/ui";
import {
  getDiets,
  weekdayLabel,
  getAllergensForMenuName,
  ALLERGEN_DISCLAIMER,
} from "@/entities/meal";
import type { DietListItem, ExportFormType } from "@/entities/meal";
import { useExportStore } from "../model/export.store";

function toSortedDiets(diets: DietListItem[]) {
  return [...diets].sort((a, b) => a.dietDate.localeCompare(b.dietDate));
}

const FORM_TITLE: Record<ExportFormType, string> = {
  official: "급식 식단표",
  newsletter: "가정통신문 — 이번 달 급식 식단표",
  student: "오늘 뭐 먹지?",
};

function doExportExcel(diets: DietListItem[], form: ExportFormType) {
  const header =
    form === "newsletter"
      ? ["날짜", "요일", "식단명", "알레르기 유발 항목(추정)"]
      : ["날짜", "요일", "식단명"];
  const rows: (string | number)[][] = [
    header,
    ...diets.map((d) =>
      form === "newsletter"
        ? [
            d.dietDate,
            weekdayLabel(d.dietDate),
            d.name,
            getAllergensForMenuName(d.name).join(", ") || "-",
          ]
        : [d.dietDate, weekdayLabel(d.dietDate), d.name],
    ),
    ...(form === "newsletter" ? [[], [ALLERGEN_DISCLAIMER]] : []),
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] =
    form === "newsletter"
      ? [{ wch: 14 }, { wch: 6 }, { wch: 30 }, { wch: 24 }]
      : [{ wch: 14 }, { wch: 6 }, { wch: 44 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "식단표");
  XLSX.writeFile(wb, `${FORM_TITLE[form]}.xlsx`);
}

function doExportPDF(diets: DietListItem[], form: ExportFormType) {
  const tableRows = diets
    .map((d) =>
      form === "newsletter"
        ? `
    <tr>
      <td class="date">${d.dietDate}&nbsp;(${weekdayLabel(d.dietDate)})</td>
      <td class="name">${d.name}</td>
      <td class="allergen">${getAllergensForMenuName(d.name).join(", ") || "-"}</td>
    </tr>`
        : `
    <tr>
      <td class="date">${d.dietDate}&nbsp;(${weekdayLabel(d.dietDate)})</td>
      <td class="name">${d.name}</td>
    </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>${FORM_TITLE[form]}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif; padding: 60px; color: #18181b; }
    h1 { text-align: center; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 32px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 8px 12px; border-bottom: 2px solid #18181b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #52525b; }
    td { padding: 9px 12px; border-bottom: 1px solid #e4e7ec; }
    td.date { font-size: 12px; color: #52525b; white-space: nowrap; width: 140px; }
    td.name { font-size: 13px; font-weight: 500; }
    td.allergen { font-size: 11px; color: #71717a; }
    .footer { margin-top: 40px; display: flex; justify-content: flex-end; gap: 48px; font-size: 12px; color: #71717a; }
    .disclaimer { margin-top: 24px; font-size: 11px; color: #b45309; background: #fffbeb; border-radius: 8px; padding: 10px 12px; }
    @media print { body { padding: 40px; } }
  </style>
</head>
<body>
  <h1>${FORM_TITLE[form]}</h1>
  <table>
    <thead><tr><th>날짜</th><th>식단</th>${form === "newsletter" ? "<th>알레르기 유발 항목(추정)</th>" : ""}</tr></thead>
    <tbody>${tableRows}</tbody>
  </table>
  ${
    form === "newsletter"
      ? `<div class="disclaimer">${ALLERGEN_DISCLAIMER}</div>`
      : `<div class="footer">
    <span>영양교사&nbsp;&nbsp;&nbsp;&nbsp;(인)</span>
    <span>학교장&nbsp;&nbsp;&nbsp;&nbsp;(인)</span>
  </div>`
  }
  <script>window.onload = () => { window.print(); window.onafterprint = () => window.close(); };<\/script>
</body>
</html>`;

  const w = window.open("", "_blank", "width=860,height=720");
  if (w) {
    w.document.write(html);
    w.document.close();
  } else {
    toast.error("팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.");
  }
}

export function ExportOptions() {
  const { selectedForm } = useExportStore();
  const [busy, setBusy] = useState<"PDF" | "EXCEL" | null>(null);

  async function handleExport(format: "PDF" | "EXCEL") {
    setBusy(format);
    try {
      const diets = toSortedDiets(await getDiets());
      if (diets.length === 0) {
        toast.error("내보낼 식단이 없습니다.");
        return;
      }
      if (format === "EXCEL") {
        doExportExcel(diets, selectedForm);
        toast.success("엑셀 파일이 다운로드됐습니다.");
      } else {
        doExportPDF(diets, selectedForm);
      }
    } catch {
      toast.error("내보내기에 실패했습니다.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="primary"
        size="lg"
        className="w-full justify-center shadow-none"
        onClick={() => handleExport("PDF")}
        disabled={busy !== null}
      >
        <FileDownIcon size={16} />
        {busy === "PDF" ? "내보내는 중…" : "PDF로 내보내기"}
      </Button>
      <p className="px-1 text-[11px] text-zinc-400">
        인쇄 대화상자에서 &apos;PDF로 저장&apos;을 선택하세요.
      </p>
      <Button
        variant="secondary"
        size="lg"
        className="w-full justify-center border-0 shadow-none"
        onClick={() => handleExport("EXCEL")}
        disabled={busy !== null}
      >
        <TableIcon size={16} />
        {busy === "EXCEL" ? "내보내는 중…" : "엑셀로 내보내기"}
      </Button>
      <Button
        variant="ghost"
        size="lg"
        className="w-full justify-center"
        onClick={() => window.print()}
      >
        <PrinterIcon size={16} />
        인쇄
      </Button>
    </div>
  );
}
