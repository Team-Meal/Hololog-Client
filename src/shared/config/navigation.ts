export type NavigationBadge =
  | {
      kind: "count";
      value: number;
    }
  | {
      kind: "label";
      value: string;
    };

export type NavigationItem = {
  label: string;
  href: string;
  icon: string;
  badge?: NavigationBadge;
};

export type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

export const navigationGroups: NavigationGroup[] = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", href: "/", icon: "D" },
      { label: "Projects", href: "/projects", icon: "P", badge: { kind: "count", value: 8 } },
      { label: "Inbox", href: "/inbox", icon: "I", badge: { kind: "count", value: 12 } },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Calendar", href: "/calendar", icon: "C" },
      { label: "Reports", href: "/reports", icon: "R", badge: { kind: "label", value: "NEW" } },
      { label: "Settings", href: "/settings", icon: "S" },
    ],
  },
];

export const shellUser = {
  name: "Holo Team",
  role: "Product Ops",
  initials: "HT",
};

export const topBarActions = {
  title: "Dashboard",
  aiLabel: "AI",
  notificationCount: 3,
};
