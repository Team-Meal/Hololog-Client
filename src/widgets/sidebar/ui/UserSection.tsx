import { MoreHorizontal } from "lucide-react";

export function UserSection() {
  return (
    <div className="border-t border-zinc-100 p-3">
      <div className="flex items-center gap-3 rounded-xl p-2">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-600">
          박
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-900">박지윤 영양교사</p>
          <p className="truncate text-xs text-zinc-400">한빛초등학교</p>
        </div>
        <button
          type="button"
          aria-label="더보기"
          className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}
