"use client";

import Link from "next/link";
import { CalendarIcon, RotateCcwIcon } from "@/shared/ui";
import { useGeneratorStore } from "../model/generator.store";

export function ActionBar() {
  const { status, generate } = useGeneratorStore();

  if (status !== "done") return null;

  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={() => void generate()}
        className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 active:bg-zinc-100"
      >
        <RotateCcwIcon size={14} />
        다시 생성
      </button>
      <Link
        href="/meal"
        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800"
      >
        <CalendarIcon size={14} />
        식단 관리에서 확인
      </Link>
    </div>
  );
}
