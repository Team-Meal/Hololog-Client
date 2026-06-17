"use client";

import { useEffect, useRef } from "react";
import { shellUser, topBarActions } from "@/shared/config/navigation";

type TopBarProps = {
  onOpenSidebar: () => void;
};

export function TopBar({ onOpenSidebar }: TopBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  return (
    <header className="flex h-20 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenSidebar}
        className="grid size-10 place-items-center rounded-lg border border-slate-200 text-lg font-semibold text-slate-700 lg:hidden"
        aria-label="Open sidebar"
      >
        =
      </button>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Overview</p>
        <h1 className="truncate text-xl font-semibold text-slate-950 sm:text-2xl">
          {topBarActions.title}
        </h1>
      </div>

      <label className="hidden h-11 w-full max-w-sm items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 transition-within focus-within:border-slate-400 focus-within:bg-white md:flex">
        <span aria-hidden="true">Search</span>
        <input
          ref={searchInputRef}
          type="search"
          placeholder="Search workspace"
          className="min-w-0 flex-1 bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
        />
        <kbd className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-slate-500">
          Cmd K
        </kbd>
      </label>

      <button
        type="button"
        className="hidden h-11 items-center rounded-lg bg-cyan-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 sm:inline-flex"
      >
        {topBarActions.aiLabel}
      </button>

      <button
        type="button"
        className="relative grid size-11 place-items-center rounded-lg border border-slate-200 text-sm font-semibold text-slate-700"
        aria-label="Notifications"
      >
        N
        <span className="absolute right-2 top-2 grid size-4 place-items-center rounded-full bg-rose-500 text-[10px] font-bold leading-none text-white">
          {topBarActions.notificationCount}
        </span>
      </button>

      <button type="button" className="grid size-11 place-items-center rounded-full bg-slate-950 text-sm font-semibold text-white">
        {shellUser.initials}
      </button>
    </header>
  );
}
