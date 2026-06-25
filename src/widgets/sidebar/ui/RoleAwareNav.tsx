"use client";

import { useEffect } from "react";
import { useMemberProfileStore } from "@/entities/member";
import { ADMIN_NAV_GROUPS, NAV_GROUPS } from "../model/nav.data";
import { NavGroup } from "./NavGroup";

export function RoleAwareNav() {
  const profile = useMemberProfileStore((s) => s.profile);
  const loading = useMemberProfileStore((s) => s.loading);
  const loaded = useMemberProfileStore((s) => s.loaded);
  const fetchProfile = useMemberProfileStore((s) => s.fetchProfile);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (!loaded && loading) return null;

  const groups = profile?.role === "ADMIN" ? ADMIN_NAV_GROUPS : NAV_GROUPS;

  return (
    <>
      {groups.map((group) => (
        <NavGroup key={group.id} group={group} />
      ))}
    </>
  );
}
