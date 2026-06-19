import type { FC } from "react";

export interface BudgetCategory {
  label: string;
  /** 집행액 (만원) */
  spent: number;
  /** 배정 예산 (만원) */
  budget: number;
  /** 도넛/막대 색상 (hex) */
  color: string;
  /** 막대 트랙 색상 클래스 */
  trackColor: string;
}

export interface MonthlyPoint {
  label: string;
  /** 월 집행액 (만원) */
  value: number;
}

export interface AiTip {
  text: string;
  iconBg: string;
  iconColor: string;
  Icon: FC<{ size?: number; className?: string }>;
}
