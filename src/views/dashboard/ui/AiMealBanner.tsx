import Link from "next/link";
import { SparklesIcon } from "@/shared/ui";

const AI_FEATURES = ["재고 반영", "예산 준수", "영양 기준", "추천 근거 제공"];

export function AiMealBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-blue-600 to-blue-500 p-6 text-white shadow-(--shadow-card) sm:p-7">
      <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <SparklesIcon size={24} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold sm:text-xl">AI 식단 생성</h2>
              <span className="rounded-md bg-white/25 px-1.5 py-0.5 text-[11px] font-bold">
                NEW
              </span>
            </div>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-blue-100">
              재고·예산·선호도·영양 기준만 입력하면 AI가 한 달 식단을 설계하고, 왜 이 식단인지
              점수와 근거까지 보여드려요.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {AI_FEATURES.map((feature) => (
                <span
                  key={feature}
                  className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Link
          href="/ai-meal"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-white px-5 text-sm font-semibold text-blue-700 shadow-sm transition-all duration-150 hover:bg-blue-50 active:scale-[0.97] lg:self-center"
        >
          <SparklesIcon size={16} />
          지금 생성하기
        </Link>
      </div>
    </section>
  );
}
