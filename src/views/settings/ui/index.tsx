"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ProfilePanel } from "@/entities/settings";
import {
  roleLabel,
  updateSchoolName,
  useMemberProfile,
  useMemberProfileStore,
} from "@/entities/member";
import { LogoutButton } from "@/features/auth";
import { PageShell, SurfaceCard } from "@/shared/ui";
import { SchoolForm } from "./SchoolForm";

export function SettingsPage() {
  // Shared profile store so school-name edits propagate to the sidebar/topbar.
  const { profile, loading: profileLoading } = useMemberProfile();
  const setProfile = useMemberProfileStore((s) => s.setProfile);
  const [editing, setEditing] = useState(false);
  const [savingSchool, setSavingSchool] = useState(false);

  const handleSaveSchool = async (schoolName: string) => {
    setSavingSchool(true);
    try {
      const updated = await updateSchoolName(schoolName);
      setProfile(updated);
      toast.success("소속 학교가 수정되었습니다.");
      setEditing(false);
    } catch {
      toast.error("소속 학교 수정에 실패했습니다.");
    } finally {
      setSavingSchool(false);
    }
  };

  return (
    <PageShell eyebrow="설정" title="설정" description="프로필과 학교 정보를 관리하세요.">
      <SurfaceCard>
        {editing ? (
          <SchoolForm
            key={profile?.schoolName ?? ""}
            schoolName={profile?.schoolName ?? ""}
            loading={profileLoading}
            saving={savingSchool}
            onSave={handleSaveSchool}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div className="flex flex-col gap-6">
            <ProfilePanel
              name={profile?.name ?? ""}
              roleText={profile ? roleLabel(profile.role) : ""}
              schoolName={profile?.schoolName ?? ""}
              loading={profileLoading}
              onEdit={() => setEditing(true)}
            />
            <div className="flex justify-end border-t border-zinc-100 pt-6">
              <LogoutButton variant="menu" />
            </div>
          </div>
        )}
      </SurfaceCard>
    </PageShell>
  );
}
