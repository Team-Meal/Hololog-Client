"use client";

import { CalendarIcon } from "@/shared/ui";

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"] as const;

function formatToday(): string {
  const now = new Date();
  const day = DAY_NAMES[now.getDay()];
  return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${day}요일`;
}

export function CurrentDate() {
  return (
    <div className="flex items-center gap-2 text-base font-semibold text-zinc-700 sm:text-lg">
      <CalendarIcon size={20} className="text-zinc-400" />
      <span>{formatToday()}</span>
    </div>
  );
}
