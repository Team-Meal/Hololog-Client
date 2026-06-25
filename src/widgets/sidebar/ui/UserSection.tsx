"use client";

import Link from "next/link";
import { roleLabel, useMemberProfile } from "@/entities/member";

export function UserSection() {
  const { profile } = useMemberProfile();
  const name = profile?.name ?? "";
  const role = profile ? roleLabel(profile.role) : "";
  const initial = name.charAt(0) || "·";

  return (
    <div className="px-3 pt-3 pb-4">
      <Link
        href="/settings"
        aria-label="프로필 설정"
        className="flex items-center gap-3 rounded-xl bg-zinc-50 p-3 hover:bg-zinc-100"
      >
        <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white">
          {initial}
          <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white bg-emerald-500" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-900">
            {name ? `${name} ${role}`.trim() : "—"}
          </p>
          <p className="truncate text-xs text-zinc-400">{profile?.schoolName ?? ""}</p>
        </div>
      </Link>
    </div>
  );
}
