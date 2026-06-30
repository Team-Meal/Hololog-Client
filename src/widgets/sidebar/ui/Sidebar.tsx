import Link from "next/link";
import { BrandLogo } from "@/shared/ui";
import { RoleAwareNav } from "./RoleAwareNav";
import { UserSection } from "./UserSection";

export function Sidebar() {
  return (
    <aside className="hidden h-full w-68 shrink-0 flex-col bg-white md:flex">
      <Link href="/" className="flex h-18 items-center px-5 transition-opacity hover:opacity-75">
        <BrandLogo />
      </Link>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        <RoleAwareNav />
      </nav>

      <UserSection />
    </aside>
  );
}
