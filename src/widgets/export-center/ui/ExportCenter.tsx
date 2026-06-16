import { FormSelector, ExportOptions, MealPreview } from "@/features/meal-export";

export function ExportCenter() {
  return (
    <div className="grid h-full grid-cols-5 gap-6">
      {/* Left panel */}
      <div className="col-span-2 flex flex-col gap-4">
        <div className="rounded-xl bg-white p-6">
          <p className="mb-4 text-sm font-semibold text-gray-800">양식 선택</p>
          <FormSelector />
        </div>
        <div className="rounded-xl bg-white p-6">
          <p className="mb-4 text-sm font-semibold text-gray-800">내보내기 옵션</p>
          <ExportOptions />
        </div>
      </div>

      {/* Right panel */}
      <div className="col-span-3 flex flex-col rounded-xl bg-white p-6">
        <MealPreview />
      </div>
    </div>
  );
}
