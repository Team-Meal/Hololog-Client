"use client";

import { useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  EyeIcon,
  EyeOffIcon,
  FloatingInput,
  SmileIcon,
  UsersIcon,
  SparklesIcon,
} from "@/shared/ui";
import type { UserRole } from "@/entities/auth";
import { useAuthStore } from "../model/auth.store";

interface RoleOption {
  value: UserRole;
  label: string;
  Icon: ComponentType<{ size?: number }>;
}

const ROLE_OPTIONS: RoleOption[] = [
  { value: "student", label: "학생", Icon: SmileIcon },
  { value: "teacher", label: "선생님", Icon: UsersIcon },
  { value: "nutritionist", label: "영양사", Icon: SparklesIcon },
];

export function SignupForm() {
  const router = useRouter();
  const { register, isLoading, clearError } = useAuthStore();

  const [role, setRole] = useState<UserRole>("student");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const passwordMismatch =
    passwordConfirm.length > 0 && password !== passwordConfirm;

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다.", {
        description: "비밀번호와 비밀번호 확인을 동일하게 입력해 주세요.",
      });
      return;
    }

    const success = await register({ role, name, username, password });
    if (success) {
      toast.success("회원가입이 완료되었습니다.");
      router.push("/dashboard");
    } else {
      toast.error(useAuthStore.getState().error ?? "회원가입에 실패했습니다.", {
        description: "입력한 정보를 다시 확인해 주세요.",
      });
      clearError();
    }
  };

  const canSubmit =
    !isLoading &&
    name.trim().length > 0 &&
    username.trim().length > 0 &&
    password.length > 0 &&
    passwordConfirm.length > 0 &&
    !passwordMismatch;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
      {/* Role selector */}
      <div>
        <span className="mb-2 block text-[13px] font-medium text-zinc-700">가입 유형</span>
        <div className="grid grid-cols-3 gap-2.5">
          {ROLE_OPTIONS.map(({ value, label, Icon }) => {
            const selected = role === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  clearError();
                  setRole(value);
                }}
                disabled={isLoading}
                aria-pressed={selected}
                className={[
                  "flex flex-col items-center justify-center gap-2 rounded-xl border py-3.5 transition-all duration-150",
                  selected
                    ? "border-blue-500 bg-blue-50 text-blue-600 ring-3 ring-blue-500/10"
                    : "border-zinc-200 bg-zinc-50/80 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                ].join(" ")}
              >
                <Icon size={20} />
                <span className="text-xs font-semibold">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <FloatingInput
        id="name"
        label="이름"
        type="text"
        value={name}
        onChange={(v) => {
          clearError();
          setName(v);
        }}
        disabled={isLoading}
        autoComplete="name"
      />

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
        autoComplete="new-password"
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

      <div>
        <FloatingInput
          id="passwordConfirm"
          label="비밀번호 확인"
          type={showPasswordConfirm ? "text" : "password"}
          value={passwordConfirm}
          onChange={(v) => {
            clearError();
            setPasswordConfirm(v);
          }}
          disabled={isLoading}
          autoComplete="new-password"
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPasswordConfirm((p) => !p)}
              tabIndex={-1}
              className="text-zinc-400 transition-colors hover:text-zinc-600"
              aria-label={showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPasswordConfirm ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            </button>
          }
        />
        {passwordMismatch && (
          <p className="mt-1.5 pl-1 text-xs text-red-500">비밀번호가 일치하지 않습니다.</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 active:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            가입 중...
          </>
        ) : (
          "회원가입"
        )}
      </button>
    </form>
  );
}
