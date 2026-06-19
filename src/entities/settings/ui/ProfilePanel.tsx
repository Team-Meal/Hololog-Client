import { SectionTitle } from "@/shared/ui";

import { Field } from "./controls";

export function ProfilePanel() {
  return (
    <div className="flex flex-col gap-8">
      <SectionTitle title="프로필" description="이름, 연락처, 비밀번호를 수정하세요." />

      <div className="flex items-center gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-400 to-blue-600 text-2xl font-bold text-white">
          박
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-zinc-950">박지윤 영양교사</p>
          <p className="mt-0.5 text-sm text-zinc-500">한빛초등학교</p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100"
        >
          사진 변경
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="이름" value="박지윤" />
        <Field label="직책" value="영양교사" />
        <Field label="이메일" value="jiyun.park@hanbit.sc.kr" type="email" />
        <Field label="연락처" value="02-000-0000" />
      </div>
    </div>
  );
}
