"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EyeIcon } from "@/shared/ui";
import { useAuthStore } from "../model/auth.store";

function EyeOffIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-px shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

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

function FloatingInput({
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
          "h-14 w-full rounded-xl border bg-zinc-50/80 pb-2 pl-4 pr-4 pt-5 text-sm text-zinc-900 outline-none transition-all duration-150",
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
          "pointer-events-none absolute left-4 select-none transition-all duration-200",
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

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading, clearError } = useAuthStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    const success = await login({ username, password });
    if (success) {
      router.push("/dashboard");
    } else {
      toast.error(useAuthStore.getState().error ?? "로그인에 실패했습니다.", {
        description: "아이디 또는 비밀번호를 확인해 주세요.",
      });
      clearError();
    }
  };

  const canSubmit = !isLoading && username.trim().length > 0 && password.length > 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
      <FloatingInput
        id="username"
        label="아이디"
        type="text"
        value={username}
        onChange={(v) => {
          clearError();
          setUsername(v);
        }}
        disabled={isLoading}
        autoComplete="username"
      />

      <FloatingInput
        id="password"
        label="비밀번호"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(v) => {
          clearError();
          setPassword(v);
        }}
        disabled={isLoading}
        autoComplete="current-password"
        rightSlot={
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            tabIndex={-1}
            className="text-zinc-400 transition-colors hover:text-zinc-600"
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </button>
        }
      />

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 active:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            로그인 중...
          </>
        ) : (
          "로그인"
        )}
      </button>
    </form>
  );
}
