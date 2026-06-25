import { SignupRequestList } from "@/features/admin";
import { AdminHeader } from "./AdminHeader";

export function AdminPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <AdminHeader />

      <div className="mx-auto max-w-[800px] px-6 py-12">
        {/* 페이지 타이틀 */}
        <div className="mb-8">
          <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-[#8f8f8f]">
            영양사 가입 승인
          </p>
          <h1 className="text-[32px] font-semibold leading-10 tracking-[-0.04em] text-[#171717]">
            가입 요청 관리
          </h1>
          <p className="mt-2 text-base text-[#4d4d4d]">
            PENDING 상태의 영양사 가입 요청을 검토하고 승인 또는 거절합니다.
          </p>
        </div>

        <SignupRequestList />
      </div>
    </div>
  );
}
