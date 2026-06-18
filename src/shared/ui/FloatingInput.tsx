"use client";

import { useState, type ReactNode } from "react";

interface FloatingInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  autoComplete?: string;
  rightSlot?: ReactNode;
}

export function FloatingInput({
  id,
  label,
  type,
  value,
  onChange,
  disabled,
  autoComplete,
  rightSlot,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder=" "
        className={[
          "h-14 w-full rounded-xl border bg-zinc-50/80 pb-2 pl-4 pr-4 pt-5 text-sm text-zinc-900 outline-none",
          rightSlot ? "pr-11" : "",
          focused
            ? "border-blue-500 bg-white ring-3 ring-blue-500/10"
            : "border-zinc-200 hover:border-zinc-300",
          "disabled:cursor-not-allowed disabled:opacity-50",
        ].join(" ")}
      />
      <label
        htmlFor={id}
        className={[
          "pointer-events-none absolute left-4 select-none",
          "transition-all duration-200 ease-spring",
          floated ? "top-2.25 text-[11px] font-medium" : "top-4.25 text-sm",
          focused ? "text-blue-500" : "text-zinc-400",
        ].join(" ")}
      >
        {label}
      </label>
      {rightSlot && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightSlot}</div>
      )}
    </div>
  );
}
