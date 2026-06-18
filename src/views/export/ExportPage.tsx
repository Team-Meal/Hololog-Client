import { PageShell } from "@/shared/ui";
import { ExportCenter } from "@/widgets/export-center";

export function ExportPage() {
  return (
    <PageShell
      eyebrow="내보내기"
      title="내보내기 센터"
      description="용도에 맞는 양식을 선택해 식단표를 PDF·엑셀로 내보내거나 인쇄하세요."
    >
      <div className="flex flex-1 overflow-hidden">
        <ExportCenter />
      </div>
    </PageShell>
  );
}
