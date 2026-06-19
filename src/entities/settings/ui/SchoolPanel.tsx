import { SectionTitle } from "@/shared/ui";

import { Field } from "./controls";

export function SchoolPanel() {
  return (
    <div className="flex flex-col gap-8">
      <SectionTitle title="학교 정보" description="급식 운영 기본 정보를 관리하세요." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="학교명" value="한빛초등학교" />
        <Field label="교육지원청" value="서울 강서교육지원청" />
        <Field label="급식 인원" value="1,043명" />
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-zinc-600">급식 유형</span>
          <select
            defaultValue="조식·중식·석식"
            className="h-10 w-full rounded-xl bg-zinc-50 px-3 text-sm font-medium text-zinc-800 outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-300"
          >
            <option>조식·중식·석식</option>
            <option>중식</option>
            <option>중식·석식</option>
          </select>
        </label>
      </div>
    </div>
  );
}
