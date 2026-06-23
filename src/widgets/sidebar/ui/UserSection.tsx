import Link from "next/link";
import { SettingsIcon } from "@/shared/ui";
import { LogoutButton } from "@/features/auth";

export function UserSection() {
  return (
    <div className="p-3">
      <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-3">
        <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white">
          박
          <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white bg-emerald-500" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-900">박지윤 영양교사</p>
          <p className="truncate text-xs text-zinc-400">한빛초등학교</p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Link
            href="/settings"
            aria-label="설정"
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
          >
            <SettingsIcon size={16} />
          </Link>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
