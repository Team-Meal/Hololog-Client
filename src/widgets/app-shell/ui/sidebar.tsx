"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationGroups, shellUser } from "@/shared/config/navigation";

type SidebarProps = {
  onNavigate?: () => void;
};

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-white text-slate-950">
      <div className="flex h-20 items-center gap-3 px-6">
        <div className="grid size-10 place-items-center rounded-lg bg-slate-950 text-sm font-semibold text-white">
          H
        </div>
        <div>
          <p className="text-base leading-5 font-semibold">Hololog</p>
          <p className="text-xs font-medium text-slate-500">Client Console</p>
        </div>
      </div>

      <nav className="flex-1 space-y-8 overflow-y-auto px-4 py-3">
        {navigationGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
              {group.label}
            </p>
            <div className="mt-3 space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={[
                      "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium",
                      "transition-all duration-150",
                      isActive
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                    ].join(" ")}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span
                      className={[
                        "grid size-7 shrink-0 place-items-center rounded-md text-xs font-bold",
                        "transition-all duration-150",
                        isActive ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badge ? (
                      <span
                        className={[
                          "shrink-0 rounded-full px-2 py-0.5 text-[11px] leading-5 font-bold",
                          item.badge.kind === "count"
                            ? isActive
                              ? "bg-white text-slate-950"
                              : "bg-slate-950 text-white"
                            : "bg-emerald-100 text-emerald-700",
                        ].join(" ")}
                      >
                        {item.badge.value}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
          <div className="grid size-10 place-items-center rounded-full bg-cyan-600 text-sm font-semibold text-white">
            {shellUser.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">{shellUser.name}</p>
            <p className="truncate text-xs font-medium text-slate-500">{shellUser.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
