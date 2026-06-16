import { ChevronsUpDown } from "lucide-react";

export function SchoolSelector() {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-zinc-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500 text-sm font-bold text-white">
        한
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-zinc-900">한빛초등학교</p>
        <p className="truncate text-xs text-zinc-400">서울 강서교육지원청</p>
      </div>
      <ChevronsUpDown size={16} className="shrink-0 text-zinc-400" />
    </button>
  );
}
