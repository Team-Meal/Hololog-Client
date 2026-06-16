import { UtensilsCrossed } from "lucide-react";
import { NAV_GROUPS, SETTINGS_NAV } from "../model/nav.data";
import { NavGroup } from "./NavGroup";
import { NavItem } from "./NavItem";
import { SchoolSelector } from "./SchoolSelector";
import { UserSection } from "./UserSection";

export function Sidebar() {
  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-zinc-100 bg-white md:flex">
      {/* 로고 */}
      <div className="flex h-16 items-center gap-2.5 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
          <UtensilsCrossed size={18} className="text-white" strokeWidth={2} />
        </div>
        <span className="text-base font-bold text-zinc-900">호로록</span>
        <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
          Hororok
        </span>
      </div>

      {/* 학교 셀렉터 */}
      <div className="px-2">
        <SchoolSelector />
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-2 py-3">
        {NAV_GROUPS.map((group) => (
          <NavGroup key={group.id} group={group} />
        ))}
      </nav>

      {/* 설정 */}
      <div className="px-2 pb-2">
        <NavItem item={SETTINGS_NAV} />
      </div>

      {/* 유저 섹션 */}
      <UserSection />
    </aside>
  );
}
