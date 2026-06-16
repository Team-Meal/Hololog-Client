"use client";

import { Search } from "lucide-react";
import { useEffect, useRef } from "react";

export function SearchField() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative flex items-center">
      <Search
        size={15}
        className="pointer-events-none absolute left-3 text-zinc-400"
      />
      <input
        ref={inputRef}
        type="text"
        placeholder="식자재 · 메뉴 · 공급업체 검색..."
        className="w-72 rounded-xl border border-zinc-200 bg-zinc-50 py-2 pr-14 pl-9 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:outline-none"
      />
      <kbd className="pointer-events-none absolute right-2.5 rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
        ⌘K
      </kbd>
    </div>
  );
}
