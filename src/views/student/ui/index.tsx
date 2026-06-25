"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SectionTitle, StatusBadge, SurfaceCard } from "@/shared/ui";
import { useMemberProfile } from "@/entities/member";
import { LogoutButton } from "@/features/auth";
import { useMealStore } from "@/features/meal";
import type { MealSuggestionStatus } from "@/features/meal";

const MEAL_CONFIG = [
  { type: "BREAKFAST" as const, name: "조식", time: "08:00" },
  { type: "LUNCH" as const, name: "중식", time: "12:00" },
  { type: "DINNER" as const, name: "석식", time: "17:00" },
];

const STATUS_META: Record<MealSuggestionStatus, { label: string; tone: "blue" | "green" | "red" }> =
  {
    PENDING: { label: "검토 중", tone: "blue" },
    APPROVED: { label: "채택됨", tone: "green" },
    REJECTED: { label: "미채택", tone: "red" },
  };

export function StudentPage() {
  const { profile } = useMemberProfile();
  const { todayMeals, isTodayLoading, fetchTodayMeals, suggestions, fetchSuggestions, createSuggestion } =
    useMealStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTodayMeals();
    fetchSuggestions();
  }, [fetchTodayMeals, fetchSuggestions]);

  const dateLabel = new Date().toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    const ok = await createSuggestion({ title: title.trim(), content: content.trim() || undefined });
    if (ok) {
      toast.success("추천이 등록되었습니다.");
      setTitle("");
      setContent("");
    } else {
      toast.error("등록에 실패했습니다.");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-zinc-950">Hololog</span>
          {profile?.schoolName && (
            <span className="hidden text-sm text-zinc-400 sm:block">· {profile.schoolName}</span>
          )}
        </div>
        <LogoutButton variant="icon" />
      </header>

      {/* 콘텐츠 */}
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">오늘의 급식</p>
          <h1 className="mt-1 text-2xl font-bold text-zinc-950">
            {profile ? `안녕하세요, ${profile.name}님` : "안녕하세요"}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            오늘의 급식을 확인하고 먹고 싶은 음식을 추천해보세요.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* 오늘 급식 */}
          <SurfaceCard>
            <SectionTitle title="오늘의 급식" description={dateLabel} />
            <ul className="mt-4 divide-y divide-zinc-100">
              {isTodayLoading ? (
                <li className="py-8 text-center text-sm text-zinc-400">불러오는 중…</li>
              ) : MEAL_CONFIG.every(({ type }) => !todayMeals[type]) ? (
                <li className="py-8 text-center text-sm text-zinc-400">
                  오늘 등록된 급식 정보가 없습니다.
                </li>
              ) : (
                MEAL_CONFIG.map(({ type, name, time }) => {
                  const meal = todayMeals[type];
                  if (!meal) return null;
                  return (
                    <li key={type} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                      <span className="w-12 shrink-0 text-sm font-medium text-zinc-400">{time}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-zinc-950">{name}</p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {meal.menuNames.join(" · ") || "메뉴 정보 없음"}
                        </p>
                      </div>
                      {meal.calorie && (
                        <span className="shrink-0 text-xs text-zinc-400">{meal.calorie}</span>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </SurfaceCard>

          {/* 먹고싶은 음식 추천 */}
          <SurfaceCard>
            <SectionTitle
              title="먹고 싶은 음식 추천하기"
              description="드시고 싶은 급식을 영양사 선생님께 추천해보세요."
            />
            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="음식 이름 (예: 불고기, 된장찌개)"
                maxLength={100}
                disabled={submitting}
                className="h-10 rounded-xl bg-zinc-50 px-3 text-sm font-medium text-zinc-800 outline-none placeholder:text-zinc-400 focus:bg-blue-50 focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="이유나 추가 내용을 적어주세요. (선택)"
                rows={3}
                disabled={submitting}
                className="resize-none rounded-xl bg-zinc-50 px-3 py-2.5 text-sm text-zinc-800 outline-none placeholder:text-zinc-400 focus:bg-blue-50 focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!title.trim() || submitting}
                  className="h-10 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:pointer-events-none disabled:opacity-40"
                >
                  {submitting ? "등록 중…" : "추천 보내기"}
                </button>
              </div>
            </form>
          </SurfaceCard>

          {/* 내 추천 현황 */}
          {suggestions.length > 0 && (
            <SurfaceCard>
              <SectionTitle title="내 추천 현황" description={`총 ${suggestions.length}건`} />
              <ul className="mt-4 divide-y divide-zinc-100">
                {suggestions.map((s) => {
                  const meta = STATUS_META[s.mealSuggestionStatus];
                  return (
                    <li key={s.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-zinc-950">{s.title}</p>
                        {s.content && (
                          <p className="mt-0.5 truncate text-xs text-zinc-500">{s.content}</p>
                        )}
                      </div>
                      <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                    </li>
                  );
                })}
              </ul>
            </SurfaceCard>
          )}
        </div>
      </main>
    </div>
  );
}
