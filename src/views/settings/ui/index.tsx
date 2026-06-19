"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  AiPanel,
  INITIAL_TOGGLES,
  IntegrationsPanel,
  NotificationsPanel,
  ProfilePanel,
  SchoolPanel,
  TabNav,
  type Aggressiveness,
  type TabId,
  type ToggleKey,
  type ToggleValues,
} from "@/entities/settings";
import { Button, CheckIcon, PageShell, SurfaceCard } from "@/shared/ui";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [toggleValues, setToggleValues] = useState<ToggleValues>(INITIAL_TOGGLES);
  const [aggressiveness, setAggressiveness] = useState<Aggressiveness>("균형");

  const handleToggle = (key: ToggleKey) => {
    setToggleValues((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <PageShell
      eyebrow="설정"
      title="설정"
      description="프로필, 학교 정보, 알림과 AI 동작 방식을 관리하세요."
      actions={
        <Button
          variant="primary"
          size="md"
          onClick={() => toast.success("변경 사항이 저장되었습니다.")}
        >
          <CheckIcon className="size-4" />
          변경 사항 저장
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
        <TabNav activeTab={activeTab} onSelect={setActiveTab} />

        <SurfaceCard>
          {activeTab === "profile" && <ProfilePanel />}
          {activeTab === "school" && <SchoolPanel />}
          {activeTab === "notifications" && (
            <NotificationsPanel toggleValues={toggleValues} onToggle={handleToggle} />
          )}
          {activeTab === "ai" && (
            <AiPanel
              toggleValues={toggleValues}
              onToggle={handleToggle}
              aggressiveness={aggressiveness}
              onAggressivenessChange={setAggressiveness}
            />
          )}
          {activeTab === "integrations" && (
            <IntegrationsPanel toggleValues={toggleValues} onToggle={handleToggle} />
          )}
        </SurfaceCard>
      </div>
    </PageShell>
  );
}
