"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon, FloatingInput } from "@/shared/ui";
import { useAuthStore } from "../model/auth.store";

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
