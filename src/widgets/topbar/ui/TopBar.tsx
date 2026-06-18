import { BellIcon, Button, SparklesIcon } from "@/shared/ui";
import { PageTitle } from "./PageTitle";
import { SearchField } from "./SearchField";

export function TopBar() {
  return (
    <header className="flex h-18 shrink-0 items-center justify-between bg-white/90 px-4 backdrop-blur sm:px-6">
      <PageTitle />

      <div className="flex items-center gap-2 sm:gap-3">
        <SearchField />

        <Button type="button" variant="primary" size="md" className="hidden sm:inline-flex">
          <SparklesIcon size={14} />
          AI에게 묻기
        </Button>

        <button
          type="button"
          aria-label="알림"
          className="relative grid size-10 place-items-center rounded-xl bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
        >
          <BellIcon size={18} />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-blue-600" />
        </button>

        <button
          type="button"
          aria-label="내 계정"
          className="grid size-10 place-items-center rounded-full bg-zinc-950 text-sm font-semibold text-white"
        >
          박
        </button>
      </div>
    </header>
  );
}
