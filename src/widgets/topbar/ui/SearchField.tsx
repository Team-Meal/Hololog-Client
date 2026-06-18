"use client";

import { SearchIcon } from "@/shared/ui";
import { useEffect, useRef } from "react";

export function SearchField() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <label className="relative hidden items-center md:flex">
      <SearchIcon size={15} className="pointer-events-none absolute left-3 text-zinc-400" />
      <input
        ref={inputRef}
        type="search"
        placeholder="식재료, 메뉴, 공급업체 검색"
        className="h-10 w-72 rounded-xl bg-zinc-50 pr-16 pl-9 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
      />
      <kbd className="pointer-events-none absolute right-2.5 rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
        Ctrl K
      </kbd>
    </label>
  );
}
