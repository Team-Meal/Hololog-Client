"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMemberProfileStore } from "@/entities/member";

export function AdminRouteGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const profile = useMemberProfileStore((s) => s.profile);
  const loaded = useMemberProfileStore((s) => s.loaded);

  useEffect(() => {
    if (!loaded) return;
    if (profile?.role === "ADMIN" && pathname !== "/admin") {
      router.replace("/admin");
    } else if (profile && profile.role !== "ADMIN" && pathname === "/admin") {
      router.replace("/dashboard");
    }
  }, [profile, loaded, pathname, router]);

  return null;
}
