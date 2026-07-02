"use client";

import { useState } from "react";
import { InfoIcon } from "./icons";

type FormulaHintProps = {
  title: string;
  lines: string[];
};

export function FormulaHint({ title, lines }: FormulaHintProps) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        aria-label={`${title} 산식 보기`}
        className="text-zinc-400 hover:text-blue-600"
      >
        <InfoIcon size={14} />
      </button>
      {open && (
        <div className="absolute top-full left-1/2 z-20 mt-2 w-64 -translate-x-1/2 rounded-xl bg-zinc-900 p-3 text-left shadow-lg">
          <p className="text-xs font-semibold text-white">{title}</p>
          <div className="mt-1.5 flex flex-col gap-1">
            {lines.map((line) => (
              <p key={line} className="font-mono text-[11px] leading-4 text-zinc-300">
                {line}
              </p>
            ))}
          </div>
          <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-zinc-900" />
        </div>
      )}
    </span>
  );
}
