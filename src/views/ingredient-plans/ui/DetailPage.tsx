import { PageShell } from "@/shared/ui";
import { IngredientPlanDetailWidget } from "@/widgets/ingredient-plans";

interface IngredientPlanDetailPageProps {
  params: Promise<{ planId: string }>;
}

export async function IngredientPlanDetailPage({
  params,
}: IngredientPlanDetailPageProps) {
  const { planId } = await params;
  return (
    <PageShell
      eyebrow="식자재 계획표"
      title="계획표 상세"
      description=""
    >
      <IngredientPlanDetailWidget planId={Number(planId)} />
    </PageShell>
  );
}
