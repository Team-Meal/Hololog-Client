"use client";

import { useEffect } from "react";
import { BrandLogo } from "@/shared/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#f5f7fb] px-6 text-center">
      <BrandLogo />
      <div>
        <p className="text-sm font-semibold text-red-500">오류 발생</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
          문제가 발생했습니다
        </h1>
        <p className="mt-2 text-sm text-zinc-500">일시적인 오류일 수 있어요. 다시 시도해 주세요.</p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 active:scale-[0.97]"
      >
        다시 시도
      </button>
    </div>
  );
}
