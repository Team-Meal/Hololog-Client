import { SectionTitle } from "@/shared/ui";

import { RowList, SettingRow, Toggle } from "./controls";
import type { ToggleKey, ToggleValues } from "../model/types";

export function NotificationsPanel({
  toggleValues,
  onToggle,
}: {
  toggleValues: ToggleValues;
  onToggle: (key: ToggleKey) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title="알림" description="받고 싶은 알림 유형을 켜거나 끄세요." />
      <RowList>
        <SettingRow
          title="재고 부족 알림"
          description="안전 재고 이하로 떨어지면 알려드려요."
          action={
            <Toggle
              enabled={toggleValues.stockShortage}
              onToggle={() => onToggle("stockShortage")}
            />
          }
        />
        <SettingRow
          title="유통기한 임박 알림"
          description="유통기한 3일 전 알림을 받아요."
          action={
            <Toggle
              enabled={toggleValues.expiryReminder}
              onToggle={() => onToggle("expiryReminder")}
            />
          }
        />
        <SettingRow
          title="AI 인사이트 알림"
          description="새로운 절감·최적화 추천을 받아요."
          action={
            <Toggle enabled={toggleValues.aiInsight} onToggle={() => onToggle("aiInsight")} />
          }
        />
        <SettingRow
          title="예산 초과 경고"
          description="예상 집행률이 90%를 넘으면 경고해요."
          action={
            <Toggle
              enabled={toggleValues.budgetWarning}
              onToggle={() => onToggle("budgetWarning")}
            />
          }
        />
      </RowList>
    </div>
  );
}
