import { SparklesIcon } from "@/shared/ui";

/** AI 추천 결과를 요약해 보여주는 사이드 카드. */
export function RecommendationSummary() {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-(--shadow-card)">
      <h2 className="text-lg font-bold text-zinc-950">추천 요약</h2>
      <div className="mt-4 flex gap-3 rounded-xl bg-blue-50 p-4 text-sm font-medium text-zinc-600">
        <SparklesIcon className="mt-0.5 size-5 shrink-0 text-zinc-500" />
        <p>
          채소·과일은 거리와 평점이 우수한 <strong className="text-zinc-900">푸르름 농산</strong>
          을, 육류는 품질 평점이 높은 <strong className="text-zinc-900">한울 축산</strong>을
          추천해요.
        </p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <SummaryStat label="추천" value="2곳" />
        <SummaryStat label="당일배송" value="2곳" />
        <SummaryStat label="평균평점" value="4.6" />
      </div>
    </section>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-zinc-50 px-3 py-3">
      <p className="text-xs font-semibold text-zinc-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-zinc-950">{value}</p>
    </div>
  );
}
