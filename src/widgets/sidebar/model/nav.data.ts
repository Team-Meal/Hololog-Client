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
    label: "",
    items: [
      { id: "dashboard", label: "대시보드", href: "/", icon: "LayoutGrid" },
      {
        id: "meal",
        label: "식단 관리",
        href: "/meal",
        icon: "CalendarDays",
      },
      {
        id: "inventory",
        label: "재고 관리",
        href: "/inventory",
        icon: "Package",
        badge: { type: "count", value: 6 },
      },
      {
        id: "orders",
        label: "발주 관리",
        href: "/orders",
        icon: "ShoppingCart",
        badge: { type: "count", value: 4, variant: "primary" },
      },
    ],
  },
  {
    id: "analytics",
    label: "분석",
    items: [
      { id: "budget", label: "예산 관리", href: "/budget", icon: "Wallet" },
      {
        id: "suppliers",
        label: "공급업체",
        href: "/suppliers",
        icon: "Truck",
      },
      { id: "export", label: "내보내기", href: "/export", icon: "FileOutput" },
    ],
  },
  {
    id: "intelligence",
    label: "인텔리전스",
    items: [
      {
        id: "ai-meal",
        label: "AI 식단 생성",
        href: "/ai-meal",
        icon: "Sparkles",
        badge: { type: "text", value: "NEW" },
      },
    ],
  },
];

export const SETTINGS_NAV: NavItem = {
  id: "settings",
  label: "설정",
  href: "/settings",
  icon: "Settings",
};
