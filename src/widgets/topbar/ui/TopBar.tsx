import { Bell, Sparkles } from "lucide-react";
import { PageTitle } from "./PageTitle";
import { SearchField } from "./SearchField";

export function TopBar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-100 bg-white px-6">
      <PageTitle />

      <div className="flex items-center gap-3">
        <SearchField />

        {/* AI 버튼 */}
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <Sparkles size={14} />
          <span>AI에게 물어보기</span>
        </button>

        {/* 알림 */}
        <button
          type="button"
          aria-label="알림"
          className="relative rounded-xl p-2 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600"
        >
          <Bell size={18} />
        </button>

        {/* 유저 아바타 */}
        <button
          type="button"
          aria-label="내 계정"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-300"
        >
          박
        </button>
      </div>
    </header>
  );
}
