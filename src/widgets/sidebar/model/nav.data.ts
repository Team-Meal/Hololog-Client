export type NavBadge =
  | { type: "count"; value: number; variant?: "default" | "primary" }
  | { type: "text"; value: string };

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: NavBadge;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "main",
    label: "운영",
    items: [
      { id: "dashboard", label: "대시보드", href: "/", icon: "LayoutGrid" },
      { id: "meal", label: "식단 관리", href: "/meal", icon: "CalendarDays" },
      {
        id: "ingredient-plans",
        label: "식자재 계획표",
        href: "/ingredient-plans",
        icon: "ClipboardList",
      },
      {
        id: "inventory",
        label: "재고 관리",
        href: "/inventory",
        icon: "Package",
      },
    ],
  },
  {
    id: "analytics",
    label: "분석",
    items: [
      { id: "budget", label: "예산 관리", href: "/budget", icon: "Wallet" },
      { id: "export", label: "내보내기", href: "/export", icon: "FileOutput" },
    ],
  },
  {
    id: "intelligence",
    label: "AI",
    items: [
      {
        id: "ai-meal",
        label: "AI 식단 생성",
        href: "/ai-meal",
        icon: "Sparkles",
      },
    ],
  },
];

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    id: "admin",
    label: "관리",
    items: [
      { id: "admin", label: "영양사 승인 관리", href: "/admin", icon: "ShieldCheck" },
    ],
  },
];

export const SETTINGS_NAV: NavItem = {
  id: "settings",
  label: "설정",
  href: "/settings",
  icon: "Settings",
};
