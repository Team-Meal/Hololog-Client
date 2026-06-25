"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarIcon,
  ClipboardListIcon,
  FileOutputIcon,
  LayoutDashboardIcon,
  PackageIcon,
  SettingsIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  SparklesIcon,
  TruckIcon,
  UtensilsIcon,
  WalletIcon,
} from "@/shared/ui";
import type { NavItem as NavItemData } from "../model/nav.data";

type IconComponent = React.FC<{
  size?: number;
  strokeWidth?: number;
  className?: string;
}>;

const ICON_MAP: Record<string, IconComponent> = {
  LayoutGrid: LayoutDashboardIcon,
  CalendarDays: CalendarIcon,
  ClipboardList: ClipboardListIcon,
  Package: PackageIcon,
  ShoppingCart: ShoppingCartIcon,
  Wallet: WalletIcon,
  Truck: TruckIcon,
  FileOutput: FileOutputIcon,
  Sparkles: SparklesIcon,
  Settings: SettingsIcon,
  ShieldCheck: ShieldCheckIcon,
  Utensils: UtensilsIcon,
};

interface Props {
  item: NavItemData;
}

export function NavItem({ item }: Props) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
  const Icon = ICON_MAP[item.icon] ?? LayoutDashboardIcon;

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
        isActive ? "bg-blue-50 text-blue-600" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800"
      }`}
    >
      <Icon
        size={18}
        strokeWidth={isActive ? 2 : 1.5}
        className={isActive ? "text-blue-600" : "text-zinc-400"}
      />
      <span className="flex-1">{item.label}</span>
      {item.badge &&
        (item.badge.type === "count" ? (
          item.badge.variant === "primary" ? (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
              {item.badge.value}
            </span>
          ) : (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
              {item.badge.value}
            </span>
          )
        ) : (
          <span className="rounded-md bg-blue-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
            {item.badge.value}
          </span>
        ))}
    </Link>
  );
}
