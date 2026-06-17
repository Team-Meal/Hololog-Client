"use client";

import { Copy, Sparkles } from "lucide-react";
import { Toaster, toast } from "sonner";
import { MealCalendar } from "@/widgets/meal-calendar";

export function MealManagementPage() {
  const handleCopyWeek = () => {
    toast.success("주 복사", {
      description: "1주차 식단을 다음 주로 복사했어요.",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Toaster position="bottom-right" richColors closeButton />

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-medium text-gray-400">식단 관리</p>
          <h1 className="text-2xl font-bold text-gray-900">월간 식단표</h1>
          <p className="mt-1 text-sm text-gray-500">
            한 달 식단을 끌어다 놓아 손쉽게 조정하고, AI로 빈 칸을 채우세요.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyWeek}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Copy size={14} />
            <span>주 복사</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Sparkles size={14} />
            <span>AI 자동 채우기</span>
          </button>
        </div>
      </div>

      {/* Calendar */}
      <MealCalendar />
    </div>
  );
}
