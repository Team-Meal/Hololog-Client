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
import {
  roleLabel,
  updateSchoolName,
  useMemberProfile,
  useMemberProfileStore,
} from "@/entities/member";
import { LogoutButton } from "@/features/auth";
import { Button, CheckIcon, PageShell, SurfaceCard } from "@/shared/ui";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [toggleValues, setToggleValues] = useState<ToggleValues>(INITIAL_TOGGLES);
  const [aggressiveness, setAggressiveness] = useState<Aggressiveness>("균형");

  // Shared profile store so school-name edits propagate to the sidebar/topbar.
  const { profile, loading: profileLoading } = useMemberProfile();
  const setProfile = useMemberProfileStore((s) => s.setProfile);
  const [savingSchool, setSavingSchool] = useState(false);

  const handleToggle = (key: ToggleKey) => {
    setToggleValues((current) => ({ ...current, [key]: !current[key] }));
  };

  const handleSaveSchool = async (schoolName: string) => {
    setSavingSchool(true);
    try {
      const updated = await updateSchoolName(schoolName);
      setProfile(updated);
      toast.success("소속 학교가 수정되었습니다.");
    } catch {
      toast.error("소속 학교 수정에 실패했습니다.");
    } finally {
      setSavingSchool(false);
    }
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
          {activeTab === "profile" && (
            <div className="flex flex-col gap-6">
              <ProfilePanel
                name={profile?.name ?? ""}
                roleText={profile ? roleLabel(profile.role) : ""}
                schoolName={profile?.schoolName ?? ""}
                loading={profileLoading}
              />
              <div className="flex justify-end border-t border-zinc-100 pt-6">
                <LogoutButton variant="menu" />
              </div>
            </div>
          )}
          {activeTab === "school" && (
            <SchoolPanel
              key={profile?.schoolName ?? ""}
              schoolName={profile?.schoolName ?? ""}
              loading={profileLoading}
              saving={savingSchool}
              onSave={handleSaveSchool}
            />
          )}
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
