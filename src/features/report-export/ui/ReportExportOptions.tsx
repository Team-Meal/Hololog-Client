"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { OrderPlanDetail } from "@/entities/order-plan";
import { Button, FileDownIcon, PrinterIcon, TableIcon } from "@/shared/ui";
import type { ReportKind } from "../model/types";
import { openPrintWindow } from "../lib/html";
import { buildOrderPlanPdfHtml, exportOrderPlanExcel } from "../lib/order-plan-report";
import {
  buildLocalProducePdfHtml,
  exportLocalProduceExcel,
  type LocalProduceStats,
} from "../lib/local-produce-report";

interface Props {
  kind: ReportKind;
  orderPlanDetail: OrderPlanDetail | null;
  localStats: LocalProduceStats | null;
  schoolName: string;
  disabled: boolean;
}

export function ReportExportOptions({
  kind,
  orderPlanDetail,
  localStats,
  schoolName,
  disabled,
}: Props) {
  const [busy, setBusy] = useState<"PDF" | "EXCEL" | null>(null);

  function handleExport(format: "PDF" | "EXCEL") {
    setBusy(format);
    try {
      if (kind === "order-plan") {
        if (!orderPlanDetail) {
          toast.error("내보낼 발주 계획이 없습니다.");
          return;
        }
        if (format === "EXCEL") {
          exportOrderPlanExcel(orderPlanDetail);
          toast.success("엑셀 파일이 다운로드됐습니다.");
        } else if (!openPrintWindow(buildOrderPlanPdfHtml(orderPlanDetail, schoolName))) {
          toast.error("팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.");
        }
      } else {
        if (!localStats || localStats.total === 0) {
          toast.error("집계할 재고가 없습니다.");
          return;
        }
        if (format === "EXCEL") {
          exportLocalProduceExcel(localStats);
          toast.success("엑셀 파일이 다운로드됐습니다.");
        } else if (!openPrintWindow(buildLocalProducePdfHtml(localStats, schoolName))) {
          toast.error("팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.");
        }
      }
    } catch {
      toast.error("내보내기에 실패했습니다.");
    } finally {
      setBusy(null);
    }
  }

  const blocked = disabled || busy !== null;

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="primary"
        size="lg"
        className="w-full justify-center shadow-none"
        onClick={() => handleExport("PDF")}
        disabled={blocked}
      >
        <FileDownIcon size={16} />
        {busy === "PDF" ? "내보내는 중…" : "PDF로 내보내기"}
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="w-full justify-center border-0 shadow-none"
        onClick={() => handleExport("EXCEL")}
        disabled={blocked}
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
