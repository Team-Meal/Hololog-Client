"use client";

import { usePathname } from "next/navigation";
import { useMemberProfile } from "@/entities/member";

const PAGE_TITLES: Record<string, string> = {
  "/": "대시보드",
  "/meal": "식단 관리",
  "/inventory": "재고 관리",
  "/budget": "예산 관리",
  "/suppliers": "공급업체",
  "/export": "내보내기",
  "/ai-meal": "AI 식단 생성",
  "/settings": "설정",
};

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"] as const;

function formatDate(): string {
  const now = new Date();
  const day = DAY_NAMES[now.getDay()];
  return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${day}요일`;
}

export function PageTitle() {
  const pathname = usePathname();
  const { profile } = useMemberProfile();
  const title = PAGE_TITLES[pathname] ?? "Hololog";
  const subtitle = profile?.schoolName ? `${formatDate()} · ${profile.schoolName}` : formatDate();

  return (
    <div className="min-w-0">
      <h1 className="truncate text-xl font-bold text-zinc-950">{title}</h1>
      <p className="truncate text-xs text-zinc-400">{subtitle}</p>
    </div>
  );
}
