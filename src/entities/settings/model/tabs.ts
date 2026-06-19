import { BellIcon, BuildingIcon, PlugIcon, SparklesIcon, UserIcon } from "@/shared/ui";

import type { SettingsTab } from "./types";

export const SETTINGS_TABS: SettingsTab[] = [
  { id: "profile", label: "프로필", Icon: UserIcon },
  { id: "school", label: "학교 정보", Icon: BuildingIcon },
  { id: "notifications", label: "알림", Icon: BellIcon },
  { id: "ai", label: "AI 설정", Icon: SparklesIcon },
  { id: "integrations", label: "연동", Icon: PlugIcon },
];

/** 토글 상태의 초기값. */
export const INITIAL_TOGGLES = {
  stockShortage: true,
  expiryReminder: true,
  aiInsight: true,
  budgetWarning: false,
  autoOrder: true,
  preferenceLearning: true,
  allergyAvoidance: true,
  sheetSync: true,
} as const;
