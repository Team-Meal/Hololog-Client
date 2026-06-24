"use client";

import { useEffect, useRef, useState } from "react";
import { SectionTitle } from "@/shared/ui";
import { searchSchools, type School } from "@/entities/school";

interface SchoolFormProps {
  schoolName: string;
  saving?: boolean;
  loading?: boolean;
  onSave: (schoolName: string) => void;
}

const MIN_QUERY_LENGTH = 2;

export function SchoolForm({
  schoolName,
  saving = false,
  loading = false,
  onSave,
}: SchoolFormProps) {
  const [value, setValue] = useState(schoolName);
  const [results, setResults] = useState<School[]>([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // NEIS 조회: 입력값이 바뀌면 디바운스 후 학교를 검색한다.
  const handleChange = (next: string) => {
    setValue(next);
    clearTimeout(timerRef.current);

    const query = next.trim();
    if (query.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setSearched(false);
      setOpen(false);
      return;
    }

    setSearching(true);
    setOpen(true);
    timerRef.current = setTimeout(async () => {
      const found = await searchSchools(query);
      setResults(found);
      setSearched(true);
      setSearching(false);
    }, 300);
  };

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const selectSchool = (school: School) => {
    clearTimeout(timerRef.current);
    setValue(school.name);
    setResults([]);
    setOpen(false);
  };

  const trimmed = value.trim();
  const canSave = !loading && !saving && trimmed.length > 0 && trimmed !== schoolName;

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle title="학교 정보" description="소속 학교를 검색해 설정하세요." />

      <div className="grid gap-4 sm:grid-cols-2">
        <div ref={containerRef} className="relative">
          <span className="mb-1.5 block text-sm font-semibold text-zinc-600">학교명</span>
          <input
            type="text"
            value={value}
            disabled={loading || saving}
            autoComplete="off"
            placeholder="학교명을 검색하세요"
            onChange={(e) => handleChange(e.target.value)}
            className="h-10 w-full rounded-xl bg-zinc-50 px-3 text-sm font-medium text-zinc-800 outline-none placeholder:text-zinc-400 focus:bg-blue-50 focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
          />

          {open && (
            <div className="absolute z-10 mt-1.5 max-h-60 w-full overflow-auto rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
              {searching && <p className="px-4 py-2.5 text-xs text-zinc-400">검색 중...</p>}

              {!searching && searched && results.length === 0 && (
                <p className="px-4 py-2.5 text-xs text-zinc-400">검색 결과가 없습니다.</p>
              )}

              {!searching &&
                results.map((school) => (
                  <button
                    key={school.code}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectSchool(school)}
                    className="flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left hover:bg-zinc-50"
                  >
                    <span className="text-sm font-medium text-zinc-800">{school.name}</span>
                    <span className="text-xs text-zinc-400">
                      {school.region}
                      {school.kind ? ` · ${school.kind}` : ""}
                    </span>
                  </button>
                ))}
            </div>
          )}
        </div>

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
        <button
          type="button"
          disabled={!canSave}
          onClick={() => onSave(trimmed)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:pointer-events-none disabled:opacity-40"
        >
          {saving ? "저장 중..." : "학교 저장"}
        </button>
      </div>
    </div>
  );
}
