"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog } from "@/shared/ui";
import { useAuthStore } from "@/features/auth";
import { useMemberProfile } from "@/entities/member";

export function AdminHeader() {
  const { profile } = useMemberProfile();
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    toast.success("로그아웃되었습니다.");
    router.replace("/login");
  };

  return (
    <>
      <header className="flex h-12 items-center justify-between border-b border-[#ebebeb] bg-[#fafafa] px-6">
        <div className="flex items-center gap-3">
          <span className="text-[15px] font-semibold tracking-tight text-[#171717]">
            Hololog
          </span>
          <span className="h-3.5 w-px bg-[#ebebeb]" />
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-[#8f8f8f]">
            Admin
          </span>
        </div>

        <div className="flex items-center gap-3">
          {profile && (
            <span className="text-sm text-[#4d4d4d]">{profile.name}</span>
          )}
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="flex h-8 items-center rounded-md border border-[#ebebeb] bg-white px-3 text-sm font-medium text-[#171717] transition-colors hover:border-[#d5d5d5] hover:bg-[#f2f2f2]"
          >
            로그아웃
          </button>
        </div>
      </header>

      <ConfirmDialog
        open={confirmOpen}
        title="로그아웃 하시겠어요?"
        description="현재 기기에서 로그아웃됩니다. 다시 이용하려면 로그인이 필요합니다."
        confirmText="로그아웃"
        cancelText="취소"
        tone="danger"
        loading={loading}
        onConfirm={handleLogout}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
