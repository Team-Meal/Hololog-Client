import { RotateCcwIcon, TrendingUpIcon, TriangleAlertIcon } from "@/shared/ui";

import type { AiTip, BudgetCategory, MonthlyPoint } from "./types";

/** 월 식자재 총 예산 (만원) */
export const BUDGET_TOTAL = 7200;
/** 이번 달 집행액 (만원) */
export const BUDGET_SPENT = 4821;

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  { label: "농산물", spent: 1684, budget: 2000, color: "#22c55e", trackColor: "bg-emerald-500" },
  { label: "축산·수산", spent: 2012, budget: 2600, color: "#3b82f6", trackColor: "bg-blue-500" },
  { label: "가공·곡물", spent: 824, budget: 1400, color: "#8b5cf6", trackColor: "bg-violet-500" },
  { label: "기타", spent: 301, budget: 1200, color: "#9ca3af", trackColor: "bg-zinc-400" },
];

export const MONTHLY_TREND: MonthlyPoint[] = [
  { label: "1월", value: 5820 },
  { label: "2월", value: 6100 },
  { label: "3월", value: 5690 },
  { label: "4월", value: 6350 },
  { label: "5월", value: 6580 },
  { label: "6월", value: 4821 },
];

export const AI_TIPS: AiTip[] = [
  {
    text: "축산 품목을 셋째 주에 집중 발주하면 가격 안정기를 활용해 약 42만원을 아낄 수 있어요.",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    Icon: TrendingUpIcon,
  },
  {
    text: "현재 집행률 추세라면 이달 가공·곡물 예산이 3% 초과될 전망이에요.",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
    Icon: TriangleAlertIcon,
  },
  {
    text: "잔반 감축 목표 달성 시 다음 달 예산을 5% 절감할 수 있어요.",
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
    Icon: RotateCcwIcon,
  },
];
