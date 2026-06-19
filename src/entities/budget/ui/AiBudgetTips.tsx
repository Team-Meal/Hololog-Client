import { SparklesIcon } from "@/shared/ui";

import type { AiTip } from "../model/types";

/** AI가 제안하는 예산 최적화 팁 목록. */
export function AiBudgetTips({ tips }: { tips: AiTip[] }) {
  return (
    <section className="rounded-2xl bg-linear-to-br from-blue-50 to-violet-50 p-5 shadow-(--shadow-card)">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparklesIcon size={16} className="text-blue-600" />
          <h2 className="text-sm font-semibold text-zinc-900">AI 예산 최적화</h2>
        </div>
        <span className="text-xs text-zinc-400">절감 기회 {tips.length}건</span>
      </div>
      <div className="mt-3 flex flex-col gap-2.5">
        {tips.map((tip) => (
          <div key={tip.text} className="flex gap-3 rounded-lg bg-white/70 p-3">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tip.iconBg}`}
            >
              <tip.Icon size={14} className={tip.iconColor} />
            </div>
            <p className="text-xs leading-relaxed text-zinc-600">{tip.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
