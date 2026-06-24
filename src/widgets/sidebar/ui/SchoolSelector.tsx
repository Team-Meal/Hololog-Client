"use client";

import { ChevronsUpDownIcon } from "@/shared/ui";
import { useMemberProfile } from "@/entities/member";

export function SchoolSelector() {
  const { profile } = useMemberProfile();
  const schoolName = profile?.schoolName ?? "";
  const initial = schoolName.charAt(0) || "·";

  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-xl bg-zinc-50/70 p-3 text-left shadow-sm hover:bg-white"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-sm font-bold text-white">
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-zinc-900">{schoolName || "—"}</p>
        <p className="truncate text-xs text-zinc-400">학교 급식 운영</p>
      </div>
      <ChevronsUpDownIcon size={16} className="shrink-0 text-zinc-400" />
    </button>
  );
}
