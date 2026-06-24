"use client";

import { SurfaceCard, TriangleAlertIcon, WalletIcon } from "@/shared/ui";
import { useGeneratorStore } from "@/features/ai-meal-generator";

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function EvaluationPanel() {
  const { status, result } = useGeneratorStore();

  const budgetEntries = result ? Object.entries(result.budgetInfo ?? {}) : [];
  const validationErrors = result?.validationErrors ?? [];

  return (
    <SurfaceCard className="flex flex-col overflow-hidden">
      <div className="mb-4">
        <p className="text-sm font-semibold text-zinc-800">예산 · 검증</p>
      </div>

      {(status === "idle" || status === "loading") && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-zinc-200">
            <div className="h-4 w-4 rounded-full border-2 border-zinc-200" />
          </div>
          <p className="text-sm text-zinc-400">식단을 생성하면 예산 정보와 검증 결과가 표시돼요.</p>
        </div>
      )}

      {status === "done" && result && (
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          <div className="rounded-lg bg-zinc-50 p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <WalletIcon size={14} className="text-blue-500" />
              <p className="text-xs font-semibold text-zinc-700">예산 정보</p>
            </div>
            {budgetEntries.length === 0 ? (
              <p className="text-xs text-zinc-400">예산 정보가 없습니다.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {budgetEntries.map(([key, value]) => (
                  <li key={key} className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-zinc-500">{key}</span>
                    <span className="font-medium text-zinc-800">{formatValue(value)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-lg bg-zinc-50 p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <TriangleAlertIcon
                size={14}
                className={validationErrors.length > 0 ? "text-amber-500" : "text-emerald-500"}
              />
              <p className="text-xs font-semibold text-zinc-700">
                검증 {validationErrors.length > 0 ? `(${validationErrors.length})` : ""}
              </p>
            </div>
            {validationErrors.length === 0 ? (
              <p className="text-xs text-emerald-600">검증을 통과했어요.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {validationErrors.map((err, i) => (
                  <li key={i} className="text-xs leading-relaxed text-zinc-600">
                    {formatValue(err)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </SurfaceCard>
  );
}
