import Link from "next/link";
import {
  ClipboardListIcon,
  FileOutputIcon,
  SectionTitle,
  SparklesIcon,
  WalletIcon,
} from "@/shared/ui";

type IconComponent = React.FC<{ size?: number; className?: string }>;

interface NewFeature {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: IconComponent;
  iconClass: string;
}

const NEW_FEATURES: NewFeature[] = [
  {
    id: "order-plan",
    title: "발주 자동계산",
    description: "식단과 재고를 반영해 발주량과 비용을 자동으로 계산해요.",
    href: "/ingredient-plans",
    icon: ClipboardListIcon,
    iconClass: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "budget-validation",
    title: "KAMIS 예산 검증",
    description: "실시간 농산물 시세로 발주 예산이 적정한지 검증해요.",
    href: "/budget",
    icon: WalletIcon,
    iconClass: "bg-amber-50 text-amber-600",
  },
  {
    id: "export-reports",
    title: "리포트 내보내기",
    description: "식단표·예산·알레르기 리포트를 문서로 내려받아요.",
    href: "/export",
    icon: FileOutputIcon,
    iconClass: "bg-blue-50 text-blue-600",
  },
  {
    id: "ai-evidence",
    title: "AI 추천 근거",
    description: "AI가 추천한 식단의 점수와 근거를 한눈에 확인해요.",
    href: "/ai-meal",
    icon: SparklesIcon,
    iconClass: "bg-violet-50 text-violet-600",
  },
];

export function WhatsNewSection() {
  return (
    <section className="flex flex-col gap-3">
      <SectionTitle
        title="새로워진 기능"
        description="최근 추가된 기능이에요. 클릭하면 바로 이동해요."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {NEW_FEATURES.map(({ id, title, description, href, icon: Icon, iconClass }) => (
          <Link
            key={id}
            href={href}
            className="group rounded-2xl bg-white p-5 shadow-(--shadow-card) transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
              <Icon size={20} />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-zinc-950 group-hover:text-blue-600">
              {title}
            </h3>
            <p className="mt-1 text-sm leading-5 text-zinc-500">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
