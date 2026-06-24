"use client";

import { useEffect } from "react";
import { useMemberProfileStore } from "../model/profile.store";

// Loads the logged-in member's profile once and shares it across the app.
export function useMemberProfile() {
  const profile = useMemberProfileStore((s) => s.profile);
  const loading = useMemberProfileStore((s) => s.loading);
  const fetchProfile = useMemberProfileStore((s) => s.fetchProfile);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading };
}
