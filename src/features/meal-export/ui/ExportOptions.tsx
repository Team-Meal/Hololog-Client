"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/ui";
import { FileDownIcon, TableIcon, PrinterIcon } from "@/shared/ui";
import { exportDiet, getDiets } from "@/entities/meal";
import type { DietExportFormat } from "@/entities/meal";

export function ExportOptions() {
  const [busy, setBusy] = useState<DietExportFormat | null>(null);

  // The export API works per-diet (POST /diets/{dietId}/exports). With no diet
  // selection on this page, export the most recent diet and open its file.
  const handleExport = async (format: DietExportFormat) => {
    setBusy(format);
    try {
      const diets = await getDiets();
      if (diets.length === 0) {
        toast.error("내보낼 식단이 없습니다.");
        return;
      }
      const latest = diets.reduce((a, b) => (a.dietDate >= b.dietDate ? a : b));
      const result = await exportDiet(latest.id, format);
      if (result.fileUrl) {
        window.open(result.fileUrl, "_blank", "noopener,noreferrer");
        toast.success(`${format} 내보내기 완료`, { description: latest.name });
      } else {
        toast.success(`${format} 내보내기를 요청했어요.`);
      }
    } catch {
      toast.error("내보내기에 실패했습니다.");
    } finally {
      setBusy(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

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
      <Button variant="ghost" size="lg" className="w-full justify-center" onClick={handlePrint}>
        <PrinterIcon size={16} />
        인쇄
      </Button>
    </div>
  );
}
