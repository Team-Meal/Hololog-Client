import { SurfaceCard } from "@/shared/ui";
import { FormSelector, ExportOptions, MealPreview } from "@/features/meal-export";

export function ExportCenter() {
  return (
    <div className="grid h-full grid-cols-5 gap-6">
      <div className="col-span-2 flex flex-col gap-4">
        <SurfaceCard>
          <p className="mb-4 text-sm font-semibold text-zinc-800">양식 선택</p>
          <FormSelector />
        </SurfaceCard>
        <SurfaceCard>
          <p className="mb-4 text-sm font-semibold text-zinc-800">내보내기 옵션</p>
          <ExportOptions />
        </SurfaceCard>
      </div>

      <SurfaceCard className="col-span-3 flex flex-col">
        <MealPreview />
      </SurfaceCard>
    </div>
  );
}
