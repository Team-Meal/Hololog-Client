"use client";

import { RotateCcw, Check } from "lucide-react";
import { useGeneratorStore } from "../model/generator.store";

export function ActionBar() {
  const { status, generate } = useGeneratorStore();

  if (status !== "done") return null;

  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={() => void generate()}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
      >
        <RotateCcw size={14} />
        다시 생성
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
      >
        <Check size={14} />
        식단표에 적용
      </button>
    </div>
  );
}
