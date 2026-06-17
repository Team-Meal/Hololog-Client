import Link from "next/link";
import { LoginForm } from "@/features/auth";
import { CheckIcon } from "@/shared/ui";

const FEATURES = ["식재료 재고 자동 추적 및 알림", "AI 기반 식단 생성 및 영양 분석", "실시간 예산 관리 및 비용 리포트"];

export function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* ── Left: brand panel ── */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between bg-[#060a14] p-12">
        {/* dot grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* glow orbs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-16 right-0 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl"
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 shadow-lg">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Hololog</span>
        </div>

        {/* Main copy */}
        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-blue-300">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            학교 급식 스마트 관리 플랫폼
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
            급식 관리의
            <br />
            새로운 기준
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/50">
            식재료 재고부터 식단 생성, 예산 분석까지
            <br />
            모든 급식 업무를 하나의 플랫폼에서.
          </p>

          <ul className="mt-8 flex flex-col gap-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                  <CheckIcon size={11} strokeWidth={2.5} />
                </span>
                <span className="text-sm text-white/65">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-xs text-white/25">© 2025 Hololog. All rights reserved.</p>
      </div>

      {/* ── Right: form panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12">
        {/* Mobile-only logo */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="text-base font-bold text-zinc-900">Hololog</span>
        </div>

        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">로그인</h2>
            <p className="mt-1.5 text-sm text-zinc-500">아이디와 비밀번호를 입력해 주세요</p>
          </div>

          <LoginForm />

          <p className="mt-6 text-center text-sm text-zinc-500">
            아직 계정이 없으신가요?{" "}
            <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-500">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
