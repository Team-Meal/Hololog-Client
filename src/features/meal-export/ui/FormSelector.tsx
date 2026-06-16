"use client";

import type { ExportFormType } from "@/entities/meal";
import { CheckIcon, TableIcon, UsersIcon, SmileIcon } from "@/shared/ui";
import { useExportStore } from "../model/export.store";

interface FormOption {
  type: ExportFormType;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}

const FORM_OPTIONS: FormOption[] = [
  {
    type: "official",
    icon: <TableIcon size={18} className="text-blue-600" />,
    iconBg: "bg-blue-100",
    title: "학교 공문 양식",
    description: "교육청 제출용 표준 급식 식단표",
  },
  {
    type: "newsletter",
    icon: <UsersIcon size={18} className="text-green-600" />,
    iconBg: "bg-green-100",
    title: "가정통신문 양식",
    description: "학부모 안내 · 알레르기 정보 포함",
  },
  {
    type: "student",
    icon: <SmileIcon size={18} className="text-purple-600" />,
    iconBg: "bg-purple-100",
    title: "학생용 양식",
    description: "교실 게시용 · 일러스트 친화적",
  },
];

export function FormSelector() {
  const { selectedForm, setSelectedForm } = useExportStore();

  return (
    <div className="flex flex-col gap-2">
      {FORM_OPTIONS.map((option) => {
        const isSelected = selectedForm === option.type;
        return (
          <button
            key={option.type}
            onClick={() => setSelectedForm(option.type)}
            className={[
              "flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all",
              isSelected ? "bg-blue-50" : "bg-white hover:bg-gray-50",
            ].join(" ")}
          >
            <span
              className={[
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                option.iconBg,
              ].join(" ")}
            >
              {option.icon}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span
                className={[
                  "text-sm font-medium",
                  isSelected ? "text-blue-700" : "text-gray-800",
                ].join(" ")}
              >
                {option.title}
              </span>
              <span className="text-xs text-gray-500">{option.description}</span>
            </span>
            {isSelected && (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600">
                <CheckIcon size={11} className="text-white" strokeWidth={2.5} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
