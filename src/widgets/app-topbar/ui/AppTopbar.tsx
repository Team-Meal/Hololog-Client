import { Button, SearchIcon, BellIcon, SparklesIcon } from "@/shared/ui";

interface AppTopbarProps {
  title?: string;
  subtitle?: string;
}

export function AppTopbar({
  title = "대시보드",
  subtitle = "2026년 6월 12일 금요일 · 한빛초등학교",
}: AppTopbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-gray-100 bg-white px-6">
      {/* Title */}
      <div className="shrink-0">
        <p className="text-lg font-bold tracking-tight text-gray-900">{title}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>

      {/* Search */}
      <div className="relative mx-auto w-full max-w-xl">
        <SearchIcon
          size={16}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
        />
        <input
          type="search"
          placeholder="식자재 · 메뉴 · 공급업체 검색..."
          className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pr-12 pl-9 text-sm text-gray-700 placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:outline-none"
        />
        <kbd className="absolute top-1/2 right-3 -translate-y-1/2 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-gray-400">
          ⌘K
        </kbd>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-3">
        <Button variant="primary">
          <SparklesIcon size={16} />
          AI에게 물어보기
        </Button>

        <button
          type="button"
          aria-label="알림"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100"
        >
          <BellIcon size={18} />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-700">
          박
        </span>
      </div>
    </header>
  );
}
