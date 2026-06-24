import type { FC } from "react";

export type TabId = "profile" | "school";

export interface SettingsTab {
  id: TabId;
  label: string;
  Icon: FC<{ className?: string }>;
}
