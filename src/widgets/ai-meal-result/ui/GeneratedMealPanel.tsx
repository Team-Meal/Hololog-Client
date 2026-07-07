"use client";

import { CalendarIcon, InfoIcon, SparklesIcon, SurfaceCard } from "@/shared/ui";
import { useGeneratorStore, useMealScoring } from "@/features/ai-meal-generator";

const TOP_N = 5;

export function GeneratedMealPanel() {
  const { status, result } = useGeneratorStore();
  const { scoredMenus } = useMealScoring();
  const topMenus = [...scoredMenus].sort((a, b) => b.score - a.score).slice(0, TOP_N);

  return (
    <SurfaceCard className="flex flex-col overflow-hidden">
      <div className="mb-4 flex items-center gap-2">
        <CalendarIcon size={15} className="text-blue-600" />
        <p className="text-sm font-semibold text-zinc-800">생성 결과</p>
      </div>

      {status === "idle" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <SparklesIcon size={22} className="text-blue-400" />
          </div>
          <div>
            <p className="font-semibold text-zinc-700">조건을 설정하고 식단을 생성하세요</p>
            <p className="mt-1 text-sm text-zinc-400">
              왼쪽에서 예산·선호도·영양 기준을 조정한 뒤 생성 버튼을 누르세요.
            </p>
          </div>
        </div>
      )}

      {status === "loading" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
            <SparklesIcon size={22} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-zinc-700">식단을 생성하고 있어요</p>
            <p className="mt-1 text-sm text-zinc-400">
              재고 · 예산 · 선호도 · 영양 기준을 분석 중...
            </p>
          </div>
          <div className="h-1.5 w-64 overflow-hidden rounded-full bg-blue-100">
            <div className="h-full rounded-full bg-blue-600" />
          </div>
        </div>
      )}

      {status === "done" && result && (
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          {result.error ? (
            <div className="rounded-lg bg-red-50 p-4 text-sm leading-relaxed text-red-600">
              {result.error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Stat label="생성 월" value={result.month || "-"} />
                <Stat
                  label={result.notice ? "생성된 식단 수" : "새로 생성된 식단 수"}
                  value={`${result.totalMeals}건`}
                />
              </div>
              <div className="rounded-lg bg-blue-50 p-3 text-sm leading-relaxed text-blue-700">
                {result.notice ??
                  "AI가 식단을 새로 생성했어요. 생성된 식단은 ‘식단 관리’에서 확인·수정할 수 있어요."}
              </div>

              <ReasonList topMenus={topMenus} />
            </>
          )}
        </div>
      )}
    </SurfaceCard>
  );
}

function ReasonList({ topMenus }: { topMenus: ReturnType<typeof useMealScoring>["scoredMenus"] }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-zinc-600">추천 근거 (후보 품목 분석)</p>
      <div className="flex items-start gap-1.5 rounded-lg bg-amber-50 p-2.5 text-xs leading-relaxed text-amber-700">
        <InfoIcon size={13} className="mt-0.5 shrink-0" />
        <span>
          이 분석은 샘플 메뉴 8개를 기준으로 한 예시이며, 실제로 생성된 식단과는 무관해요. 실제
          레시피 연동 전까지의 임시 데이터예요.
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {topMenus.map((menu) => (
          <li key={`${menu.menuName}-${menu.ingredientName}`} className="rounded-lg bg-zinc-50 p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-800">
                {menu.menuName} · {menu.ingredientName}
              </span>
              <span className="text-xs font-semibold text-blue-600">{menu.score.toFixed(0)}점</span>
            </div>
            <ul className="flex flex-col gap-1">
              {menu.reasons.map((reason, i) => (
                <li key={i} className="text-xs leading-relaxed text-zinc-500">
                  <span className="font-medium text-zinc-600">[{reason.source}]</span> {reason.text}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-50 p-3">
      <p className="text-[11px] text-zinc-500">{label}</p>
      <p className="text-lg font-bold text-zinc-900">{value}</p>
    </div>
  );
}
