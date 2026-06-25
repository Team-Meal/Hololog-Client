"use client";

import { useEffect, useRef, useState } from "react";
import { FloatingInput } from "@/shared/ui";
import { searchSchools, type School } from "@/entities/school";

interface SchoolSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const MIN_QUERY_LENGTH = 2;

export function SchoolSearchField({ value, onChange, disabled }: SchoolSearchFieldProps) {
  const [results, setResults] = useState<School[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleChange = (newValue: string) => {
    onChange(newValue);
    clearTimeout(timerRef.current);

    const query = newValue.trim();
    if (query.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setSearched(false);
      setOpen(false);
      return;
    }

    setLoading(true);
    setOpen(true);
    timerRef.current = setTimeout(async () => {
      const found = await searchSchools(query);
      setResults(found);
      setSearched(true);
      setLoading(false);
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
    onChange(school.name);
    setResults([]);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <FloatingInput
        id="schoolName"
        label="학교명"
        type="text"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        autoComplete="off"
      />

      {open && (
        <div className="absolute z-10 mt-1.5 max-h-60 w-full overflow-auto rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
          {loading && <p className="px-4 py-2.5 text-xs text-zinc-400">검색 중...</p>}

          {!loading && searched && results.length === 0 && (
            <p className="px-4 py-2.5 text-xs text-zinc-400">검색 결과가 없습니다.</p>
          )}

          {!loading &&
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
  );
}
