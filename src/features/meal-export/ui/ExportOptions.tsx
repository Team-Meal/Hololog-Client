"use client";

import { Button } from "@/shared/ui";
import { FileDownIcon, TableIcon, PrinterIcon } from "@/shared/ui";
import { MOCK_MEAL_SCHEDULE } from "@/entities/meal";

export function ExportOptions() {
  const { schoolName, month } = MOCK_MEAL_SCHEDULE;

  const handlePdf = () => {
    // TODO: POST /api/export/pdf → blob download
    window.alert(`${month}월 급식 식단표 PDF 내보내기 (${schoolName})`);
  };

  const handleExcel = () => {
    // TODO: POST /api/export/excel → blob download
    window.alert(`${month}월 급식 식단표 엑셀 내보내기 (${schoolName})`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-2">
      <Button variant="primary" size="lg" className="w-full justify-center" onClick={handlePdf}>
        <FileDownIcon size={16} />
        PDF로 내보내기
      </Button>
      <Button variant="secondary" size="lg" className="w-full justify-center" onClick={handleExcel}>
        <TableIcon size={16} />
        엑셀로 내보내기
      </Button>
      <Button variant="ghost" size="lg" className="w-full justify-center" onClick={handlePrint}>
        <PrinterIcon size={16} />
        인쇄
      </Button>
    </div>
  );
}
