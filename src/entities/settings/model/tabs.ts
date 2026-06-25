import { BuildingIcon, UserIcon } from "@/shared/ui";

import type { SettingsTab } from "./types";

export const SETTINGS_TABS: SettingsTab[] = [
  { id: "profile", label: "프로필", Icon: UserIcon },
  { id: "school", label: "학교 정보", Icon: BuildingIcon },
];
