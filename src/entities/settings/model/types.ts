import type { FC } from "react";

export type TabId = "profile" | "school" | "notifications" | "ai" | "integrations";

export type Aggressiveness = "보수적" | "균형" | "적극적";

export interface SettingsTab {
  id: TabId;
  label: string;
  Icon: FC<{ className?: string }>;
}

/** 알림·AI·연동 패널에서 켜고 끄는 토글들의 전체 상태. */
export interface ToggleValues {
  stockShortage: boolean;
  expiryReminder: boolean;
  aiInsight: boolean;
  budgetWarning: boolean;
  autoOrder: boolean;
  preferenceLearning: boolean;
  allergyAvoidance: boolean;
  sheetSync: boolean;
}

export type ToggleKey = keyof ToggleValues;
