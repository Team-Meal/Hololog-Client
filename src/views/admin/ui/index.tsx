import { PageShell } from "@/shared/ui";
import { SignupRequestList } from "@/features/admin";

export function AdminPage() {
  return (
    <PageShell
      eyebrow="어드민"
      title="영양사 가입 요청 관리"
      description="PENDING 상태의 영양사 가입 요청을 검토하고 승인 또는 거절합니다."
    >
      <SignupRequestList />
    </PageShell>
  );
}
