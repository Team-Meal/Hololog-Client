"use client";

import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/": "대시보드",
  "/meal": "식단 관리",
  "/inventory": "재고 관리",
  "/orders": "발주 관리",
  "/budget": "예산 관리",
  "/suppliers": "공급업체",
  "/export": "내보내기",
  "/ai-meal": "AI 식단 생성",
  "/settings": "설정",
};

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"] as const;

function formatDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const day = DAY_NAMES[now.getDay()];
  return `${y}년 ${m}월 ${d}일 ${day}요일 · 한빛초등학교`;
}

export function PageTitle() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "홀로로그";

  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900">{title}</h1>
      <p className="text-xs text-zinc-400">{formatDate()}</p>
    </div>
  );
}
