"use client";

import { useState } from "react";
import { Button, SectionTitle } from "@/shared/ui";

interface SchoolPanelProps {
  schoolName: string;
  saving?: boolean;
  loading?: boolean;
  // Remount key (the live schoolName) keeps the input seeded after async load.
  onSave: (schoolName: string) => void;
}

export function SchoolPanel({
  schoolName,
  saving = false,
  loading = false,
  onSave,
}: SchoolPanelProps) {
  const [value, setValue] = useState(schoolName);

  const trimmed = value.trim();
  const canSave = !loading && !saving && trimmed.length > 0 && trimmed !== schoolName;

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle title="학교 정보" description="급식 운영 기본 정보를 관리하세요." />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-zinc-600">학교명</span>
          <input
            type="text"
            value={value}
            maxLength={255}
            disabled={loading || saving}
            onChange={(e) => setValue(e.target.value)}
            className="h-10 w-full rounded-xl bg-zinc-50 px-3 text-sm font-medium text-zinc-800 outline-none placeholder:text-zinc-400 focus:bg-blue-50 focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-zinc-600">교육지원청</span>
          <input
            type="text"
            defaultValue="서울 강서교육지원청"
            className="h-10 w-full rounded-xl bg-zinc-50 px-3 text-sm font-medium text-zinc-800 outline-none placeholder:text-zinc-400 focus:bg-blue-50 focus:ring-2 focus:ring-blue-300"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-zinc-600">급식 인원</span>
          <input
            type="text"
            defaultValue="1,043명"
            className="h-10 w-full rounded-xl bg-zinc-50 px-3 text-sm font-medium text-zinc-800 outline-none placeholder:text-zinc-400 focus:bg-blue-50 focus:ring-2 focus:ring-blue-300"
          />
        </label>

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

      <div className="flex justify-end">
        <Button variant="primary" disabled={!canSave} onClick={() => onSave(trimmed)}>
          {saving ? "저장 중..." : "학교명 저장"}
        </Button>
      </div>
    </div>
  );
}
