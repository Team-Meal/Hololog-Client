import type { ComponentType } from "react";
import {
  BarChart2Icon,
  PackageIcon,
  SectionTitle,
  SmileIcon,
  StatusBadge,
  SurfaceCard,
} from "@/shared/ui";

interface Insight {
  icon: ComponentType<{ size?: number; className?: string }>;
  iconClass: string;
  title: string;
  description: string;
  confidence: number;
  action: string;
}

const INSIGHTS: Insight[] = [
  {
    icon: BarChart2Icon,
    iconClass: "bg-amber-50 text-amber-600",
    title: "다음 주 양파 가격 14% 상승 전망",
    description: "이번 주 120kg을 선구매하면 현재 가격을 고정해 약 38만원을 절감할 수 있습니다.",
    confidence: 94,
    action: "발주 반영",
  },
  {
    icon: PackageIcon,
    iconClass: "bg-emerald-50 text-emerald-600",
    title: "금요일 시금치나물 준비량 12% 감축 권장",
    description: "최근 선호도와 잔반 데이터를 기준으로 준비량을 줄여도 충분한 배식이 가능합니다.",
    confidence: 89,
    action: "식단 수정",
  },
  {
    icon: SmileIcon,
    iconClass: "bg-blue-50 text-blue-600",
    title: "그린빈 대신 구운 당근 추천",
    description: "선호도 점수가 높고 단가가 낮아 영양 균형과 만족도를 함께 개선합니다.",
    confidence: 91,
    action: "메뉴 교체",
  },
];

export function AiInsights() {
  return (
    <SurfaceCard>
      <SectionTitle
        title="AI 인사이트"
        description="추천 3건 · 8분 전 업데이트"
        action={<StatusBadge tone="blue">주간 약 64만원 절감</StatusBadge>}
      />

      <ul className="mt-5 divide-y divide-zinc-100">
        {INSIGHTS.map((insight) => (
          <li key={insight.title} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            <span
              className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl ${insight.iconClass}`}
            >
              <insight.icon size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-zinc-950">{insight.title}</p>
              <p className="mt-1 text-sm leading-6 text-zinc-500">{insight.description}</p>
              <p className="mt-1.5 text-xs text-zinc-400">신뢰도 {insight.confidence}%</p>
            </div>
            <button
              type="button"
              className="shrink-0 text-sm font-semibold text-blue-600 hover:text-blue-500"
            >
              {insight.action}
            </button>
          </li>
        ))}
      </ul>
    </SurfaceCard>
  );
}
