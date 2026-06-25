"use client";

import { usePathname } from "next/navigation";
import { useMemberProfile } from "@/entities/member";

const PAGE_TITLES: Record<string, string> = {
  "/": "대시보드",
  "/meal": "식단 관리",
  "/inventory": "재고 관리",
  "/budget": "예산 관리",
  "/export": "내보내기",
  "/ai-meal": "AI 식단 생성",
  "/settings": "설정",
};

export function PageTitle() {
  const pathname = usePathname();
  const { profile } = useMemberProfile();
  const title = PAGE_TITLES[pathname] ?? "Hololog";

  return (
    <div className="min-w-0">
      <h1 className="truncate text-xl font-bold text-zinc-950">{title}</h1>
      {profile?.schoolName && (
        <p className="truncate text-xs text-zinc-400">{profile.schoolName}</p>
      )}
    </div>
  );
}
