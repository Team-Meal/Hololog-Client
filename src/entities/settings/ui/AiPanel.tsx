import { SectionTitle } from "@/shared/ui";

import { RowList, SettingRow, Toggle } from "./controls";
import type { Aggressiveness, ToggleKey, ToggleValues } from "../model/types";

const AGGRESSIVENESS_OPTIONS: Aggressiveness[] = ["보수적", "균형", "적극적"];

export function AiPanel({
  toggleValues,
  onToggle,
  aggressiveness,
  onAggressivenessChange,
}: {
  toggleValues: ToggleValues;
  onToggle: (key: ToggleKey) => void;
  aggressiveness: Aggressiveness;
  onAggressivenessChange: (value: Aggressiveness) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title="AI 설정" description="AI가 수행하는 자동화 방식을 조정하세요." />
      <RowList>
        <SettingRow
          title="자동 발주 제안"
          description="수요 예측에 따라 발주를 자동 제안해요."
          action={
            <Toggle enabled={toggleValues.autoOrder} onToggle={() => onToggle("autoOrder")} />
          }
        />
        <SettingRow
          title="선호도 학습"
          description="학생 투표·잔반 데이터로 추천을 개선해요."
          action={
            <Toggle
              enabled={toggleValues.preferenceLearning}
              onToggle={() => onToggle("preferenceLearning")}
            />
          }
        />
        <SettingRow
          title="알레르기 자동 회피"
          description="등록된 알레르기 식품을 식단에서 제외해요."
          action={
            <Toggle
              enabled={toggleValues.allergyAvoidance}
              onToggle={() => onToggle("allergyAvoidance")}
            />
          }
        />
      </RowList>

      {/* 추천 적극성 — 세그먼트 컨트롤 */}
      <div>
        <p className="text-sm font-semibold text-zinc-950">추천 적극성</p>
        <p className="mt-1 text-sm text-zinc-400">
          AI가 새 메뉴를 얼마나 적극적으로 제안할지 정해요.
        </p>
        <div className="mt-3 grid max-w-xs grid-cols-3 gap-1 rounded-xl bg-zinc-100 p-1">
          {AGGRESSIVENESS_OPTIONS.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => onAggressivenessChange(label)}
              className={[
                "h-8 rounded-lg text-sm font-semibold",
                label === aggressiveness
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
