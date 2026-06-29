import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminRouteGuard } from "@/features/auth";
import { Sidebar } from "@/widgets/sidebar";
import { TopBar } from "@/widgets/topbar";

async function getSessionRole(): Promise<string | null> {
  try {
    const store = await cookies();
    const token = store.get("accessToken")?.value;
    if (!token) return null;
    const raw = token.split(".")[1];
    if (!raw) return null;
    const claims = JSON.parse(Buffer.from(raw, "base64url").toString("utf-8")) as {
      role?: string;
    };
    return claims?.role ?? null;
  } catch {
    return null;
  }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const role = await getSessionRole();

  if (!role) redirect("/login");

  if (role === "ADMIN" || role === "STUDENT") {
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
