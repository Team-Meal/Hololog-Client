"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMemberProfileStore } from "@/entities/member";

const STUDENT_PAGES = ["/student", "/settings"];

export function StudentRouteGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const profile = useMemberProfileStore((s) => s.profile);
  const fetchProfile = useMemberProfileStore((s) => s.fetchProfile);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!profile || profile.role !== "STUDENT") return;
    const allowed = STUDENT_PAGES.some((p) => pathname === p || pathname.startsWith(p + "/"));
    if (!allowed) router.replace("/student");
  }, [profile, pathname, router]);

  return null;
}
