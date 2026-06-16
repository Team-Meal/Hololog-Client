import type { ComponentType } from "react";
import { SparklesIcon, BarChart2Icon, PackageIcon, SmileIcon } from "@/shared/ui";

interface Insight {
  icon: ComponentType<{ size?: number; className?: string }>;
  iconClass: string;
  title: string;
  description: string;
  confidence: number;
  action: string;
}

// 퍼블리싱용 mock 데이터
const INSIGHTS: Insight[] = [
  {
    icon: BarChart2Icon,
    iconClass: "bg-amber-50 text-amber-600",
    title: "다음 주 양파 가격 14% 상승 전망",
    description:
      "주문을 앞당겨서 이번 주 120kg를 선구매하면 현재 가격 고정해 38만원을 절감할 수 있어요.",
    confidence: 94,
    action: "구매 적용",
  },
  {
    icon: PackageIcon,
    iconClass: "bg-emerald-50 text-emerald-600",
    title: "금요일 시금치·나물 준비량 12% 감축 권장",
    description:
      "최근 데이터상 시금치 메뉴의 선호도가 낮아 폐기가 과잉 조리되고 있어요. 준비량을 줄이면 폐기를 줄일 수 있어요.",
    confidence: 89,
    action: "식단 수정",
  },
  {
    icon: SmileIcon,
    iconClass: "bg-blue-50 text-blue-600",
    title: "그린빈 대신 구운 당근으로 교체 추천",
    description: "선호도 점수가 92%로 더 높고, 1인분 단가는 18% 더 낮아요. 영양 균형도 유지돼요.",
    confidence: 91,
    action: "메뉴 교체",
  },
];

export function AiInsights() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            <SparklesIcon size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">AI 인사이트</p>
            <p className="text-xs text-gray-400">추천 3건 · 8분 전 업데이트</p>
          </div>
        </div>
        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-600">
          주간 ~64만원 절감
        </span>
      </div>

      {/* List */}
      <ul className="mt-5 divide-y divide-gray-100">
        {INSIGHTS.map((insight) => (
          <li key={insight.title} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            <span
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${insight.iconClass}`}
            >
              <insight.icon size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">{insight.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-gray-500">{insight.description}</p>
              <p className="mt-1.5 text-xs text-gray-400">신뢰도 {insight.confidence}%</p>
            </div>
            <button
              type="button"
              className="shrink-0 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              {insight.action}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
