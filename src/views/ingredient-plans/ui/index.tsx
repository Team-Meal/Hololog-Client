import { PageShell } from "@/shared/ui";
import { IngredientPlansWidget } from "@/widgets/ingredient-plans";

export function IngredientPlansPage() {
  return (
    <PageShell
      eyebrow="식자재 계획표"
      title="계획표 목록"
      description="등록된 식자재 계획표를 확인하세요."
    >
      <IngredientPlansWidget />
    </PageShell>
  );
}
