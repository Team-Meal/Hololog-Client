"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConfirmDialog, LogOutIcon } from "@/shared/ui";
import { useAuthStore } from "../model/auth.store";

interface LogoutButtonProps {
  // "icon": compact icon button (sidebar). "menu": full-width row (settings).
  variant?: "icon" | "menu";
}

export function LogoutButton({ variant = "icon" }: LogoutButtonProps) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await logout();
    toast.success("로그아웃되었습니다.");
    // replace so the back button can't return to an authenticated page.
    router.replace("/login");
  };

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="로그아웃"
          className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-500"
        >
          <LogOutIcon size={16} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOutIcon size={16} />
          로그아웃
        </button>
      )}

      <ConfirmDialog
        open={open}
        title="로그아웃 하시겠어요?"
        description="현재 기기에서 로그아웃됩니다. 다시 이용하려면 로그인이 필요합니다."
        confirmText="로그아웃"
        cancelText="취소"
        tone="danger"
        loading={loading}
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
