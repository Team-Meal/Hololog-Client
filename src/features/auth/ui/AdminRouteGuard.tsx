"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMemberProfileStore } from "@/entities/member";

export function AdminRouteGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const profile = useMemberProfileStore((s) => s.profile);

  useEffect(() => {
    if (profile?.role === "ADMIN" && pathname !== "/admin") {
      router.replace("/admin");
    }
  }, [profile, pathname, router]);

  return null;
}
