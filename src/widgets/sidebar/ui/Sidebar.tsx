import { BrandLogo } from "@/shared/ui";
import { NAV_GROUPS } from "../model/nav.data";
import { NavGroup } from "./NavGroup";
import { SchoolSelector } from "./SchoolSelector";
import { UserSection } from "./UserSection";

export function Sidebar() {
  return (
    <aside className="hidden h-full w-68 shrink-0 flex-col bg-white md:flex">
      <div className="flex h-18 items-center px-5">
        <BrandLogo />
      </div>

      <div className="px-3">
        <SchoolSelector />
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <NavGroup key={group.id} group={group} />
        ))}
      </nav>

      <UserSection />
    </aside>
  );
}
