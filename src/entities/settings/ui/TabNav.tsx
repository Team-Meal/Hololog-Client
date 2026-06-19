import { SurfaceCard } from "@/shared/ui";

import { SETTINGS_TABS } from "../model/tabs";
import type { TabId } from "../model/types";

/** 설정 패널을 전환하는 탭 내비게이션. */
export function TabNav({
  activeTab,
  onSelect,
}: {
  activeTab: TabId;
  onSelect: (id: TabId) => void;
}) {
  return (
    <SurfaceCard className="p-2">
      <nav
        aria-label="설정 메뉴"
        className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible"
      >
        {SETTINGS_TABS.map((tab) => {
          const selected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelect(tab.id)}
              className={[
                "flex h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold lg:w-full",
                selected
                  ? "bg-blue-50 text-blue-600"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800",
              ].join(" ")}
            >
              <tab.Icon
                className={["size-4 shrink-0", selected ? "text-blue-600" : "text-zinc-400"].join(
                  " ",
                )}
                aria-hidden="true"
              />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </SurfaceCard>
  );
}
