import { PageShell } from "@/shared/ui";
import { BudgetContent } from "./BudgetContent";

export function BudgetPage() {
  return (
    <PageShell
      eyebrow="예산 관리"
      title="예산 현황"
      description="식자재 예산의 집행 현황을 확인하세요."
    >
      <BudgetContent />
    </PageShell>
  );
}
