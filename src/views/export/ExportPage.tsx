import { ExportCenter } from "@/widgets/export-center";

export function ExportPage() {
  return (
    <div className="flex h-full flex-col gap-6">
      {/* Page header */}
      <div>
        <p className="mb-1 text-xs font-medium text-blue-600">내보내기</p>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">내보내기 센터</h1>
        <p className="mt-1 text-sm text-gray-500">
          용도에 맞는 양식을 선택해 식단표를 PDF·엑셀로 내보내거나 인쇄하세요.
        </p>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <ExportCenter />
      </div>
    </div>
  );
}
