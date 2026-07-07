import Link from "next/link";
import { BrandLogo } from "@/shared/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#f5f7fb] px-6 text-center">
      <BrandLogo />
      <div>
        <p className="text-sm font-semibold text-blue-600">404</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-2 text-sm text-zinc-500">주소가 잘못되었거나 삭제된 페이지일 수 있어요.</p>
      </div>
      <Link
        href="/"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 active:scale-[0.97]"
      >
        홈으로 이동
      </Link>
    </div>
  );
}
