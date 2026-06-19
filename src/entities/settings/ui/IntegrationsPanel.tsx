import { SectionTitle } from "@/shared/ui";

import { RowList, SettingRow, Toggle } from "./controls";
import type { ToggleKey, ToggleValues } from "../model/types";

export function IntegrationsPanel({
  toggleValues,
  onToggle,
}: {
  toggleValues: ToggleValues;
  onToggle: (key: ToggleKey) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title="연동" description="급식 운영에 사용하는 외부 시스템을 연결하세요." />
      <RowList>
        <SettingRow
          title="나이스(NEIS) 급식 시스템"
          description="교육행정정보시스템과 식단을 동기화해요."
          action={
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              연결됨
            </span>
          }
        />
        <SettingRow
          title="엑셀·구글 시트"
          description="재고 시트를 양방향으로 동기화해요."
          action={
            <Toggle enabled={toggleValues.sheetSync} onToggle={() => onToggle("sheetSync")} />
          }
        />
        <SettingRow
          title="공급업체 EDI"
          description="발주서를 공급업체 시스템으로 전송해요."
          action={
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
            >
              연결
            </button>
          }
        />
      </RowList>
    </div>
  );
}
