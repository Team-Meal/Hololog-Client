import { cookies } from "next/headers";
import { AdminRouteGuard } from "@/features/auth";
import { Sidebar } from "@/widgets/sidebar";
import { TopBar } from "@/widgets/topbar";

async function isAdminSession(): Promise<boolean> {
  try {
    const store = await cookies();
    const token = store.get("accessToken")?.value;
    if (!token) return false;
    const raw = token.split(".")[1];
    if (!raw) return false;
    const claims = JSON.parse(Buffer.from(raw, "base64url").toString("utf-8")) as {
      role?: string;
    };
    return claims?.role === "ADMIN";
  } catch {
    return false;
  }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await isAdminSession();

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f7fb]">
      <AdminRouteGuard />
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
