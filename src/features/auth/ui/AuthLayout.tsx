import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo, CheckIcon } from "@/shared/ui";

const FEATURES = [
  "식재료 재고 자동 추적과 알림",
  "AI 기반 식단 생성과 영양 분석",
  "실시간 예산 관리와 비용 리포트",
];

type AuthLayoutProps = {
  title: string;
  description: string;
  headline: ReactNode;
  children: ReactNode;
  footerText: string;
  footerHref: string;
  footerLink: string;
};

export function AuthLayout({
  title,
  description,
  headline,
  children,
  footerText,
  footerHref,
  footerLink,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden overflow-hidden bg-[#060a14] p-12 lg:flex lg:w-1/2 lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-blue-600/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 bottom-16 size-72 rounded-full bg-blue-500/15 blur-3xl"
        />

        <div className="relative z-10">
          <BrandLogo dark />
        </div>

        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-blue-300">
            <span className="size-1.5 rounded-full bg-blue-400" />
            학교 급식 운영 관리 플랫폼
          </div>
          <h1 className="text-4xl leading-tight font-bold tracking-tight text-white">{headline}</h1>
          <p className="mt-4 text-base leading-relaxed text-white/50">
            식재료 재고부터 식단 생성, 예산 분석까지
            <br />
            모든 급식 업무를 하나의 흐름으로 관리하세요.
          </p>

          <ul className="mt-8 flex flex-col gap-3">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                  <CheckIcon size={11} strokeWidth={2.5} />
                </span>
                <span className="text-sm text-white/65">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/25">© 2026 Hololog. All rights reserved.</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12">
        <div className="mb-8 lg:hidden">
          <BrandLogo />
        </div>

        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">{title}</h2>
            <p className="mt-1.5 text-sm text-zinc-500">{description}</p>
          </div>

          {children}

          <p className="mt-6 text-center text-sm text-zinc-500">
            {footerText}{" "}
            <Link href={footerHref} className="font-semibold text-blue-600 hover:text-blue-500">
              {footerLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
