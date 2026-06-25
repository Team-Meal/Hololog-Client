"use client";

import { create } from "zustand";
import { getMyProfile } from "../api/member.api";
import type { MemberProfile } from "./types";

interface MemberProfileState {
  profile: MemberProfile | null;
  loading: boolean;
  loaded: boolean;
  // Fetches the profile once; subsequent calls are no-ops while loading/loaded.
  fetchProfile: () => Promise<void>;
  // Replaces the cached profile (e.g. after editing the school name).
  setProfile: (profile: MemberProfile) => void;
}

export const useMemberProfileStore = create<MemberProfileState>((set, get) => ({
  profile: null,
  loading: false,
  loaded: false,
  fetchProfile: async () => {
    if (get().loading || get().loaded) return;
    set({ loading: true });
    try {
      const profile = await getMyProfile();
      set({ profile, loaded: true, loading: false });
    } catch {
      set({ loading: false });
    }
  },
  setProfile: (profile) => set({ profile, loaded: true }),
}));
