"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { SectionTitle, StatusBadge, SurfaceCard, XIcon, CheckIcon } from "@/shared/ui";
import { useMealStore } from "@/features/meal";
import type { MealSuggestion, MealSuggestionStatus } from "@/features/meal";

const STATUS_META: Record<MealSuggestionStatus, { label: string; tone: "blue" | "green" | "red" }> =
  {
    PENDING: { label: "검토 중", tone: "blue" },
    APPROVED: { label: "채택됨", tone: "green" },
    REJECTED: { label: "미채택", tone: "red" },
  };

function SuggestionRow({
  suggestion,
  onApprove,
  onReject,
}: {
  suggestion: MealSuggestion;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}) {
  const meta = STATUS_META[suggestion.mealSuggestionStatus];
  const isPending = suggestion.mealSuggestionStatus === "PENDING";

  return (
    <li className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-zinc-950">{suggestion.title}</p>
        {suggestion.content && (
          <p className="mt-0.5 text-xs text-zinc-500">{suggestion.content}</p>
        )}
      </div>
      {isPending ? (
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={() => onApprove(suggestion.id)}
            className="flex h-7 items-center gap-1 rounded-lg bg-emerald-50 px-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
          >
            <CheckIcon size={12} />
            채택
          </button>
          <button
            type="button"
            onClick={() => onReject(suggestion.id)}
            className="flex h-7 items-center gap-1 rounded-lg bg-zinc-100 px-2.5 text-xs font-semibold text-zinc-500 hover:bg-zinc-200"
          >
            <XIcon size={12} />
            거절
          </button>
        </div>
      ) : (
        <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
      )}
    </li>
  );
}

export function StudentSuggestions() {
  const { suggestions, isSuggestionsLoading, fetchSuggestions, updateSuggestionStatus } =
    useMealStore();

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const pendingCount = suggestions.filter((s) => s.mealSuggestionStatus === "PENDING").length;

  const handleApprove = async (id: number) => {
    const ok = await updateSuggestionStatus(id, { mealSuggestionStatus: "APPROVED" });
    if (ok) toast.success("추천을 채택했습니다.");
    else toast.error("처리에 실패했습니다.");
  };

  const handleReject = async (id: number) => {
    const ok = await updateSuggestionStatus(id, { mealSuggestionStatus: "REJECTED" });
    if (ok) toast.success("추천을 거절했습니다.");
    else toast.error("처리에 실패했습니다.");
  };

  return (
    <SurfaceCard>
      <SectionTitle
        title="학생 급식 추천"
        description={pendingCount > 0 ? `검토 중 ${pendingCount}건` : "새 추천 없음"}
      />

      {isSuggestionsLoading ? (
        <p className="mt-4 text-center text-sm text-zinc-400">불러오는 중…</p>
      ) : suggestions.length === 0 ? (
        <p className="mt-4 text-center text-sm text-zinc-400">학생 추천이 없습니다.</p>
      ) : (
        <ul className="mt-4 divide-y divide-zinc-100">
          {suggestions.map((s) => (
            <SuggestionRow
              key={s.id}
              suggestion={s}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </ul>
      )}
    </SurfaceCard>
  );
}
