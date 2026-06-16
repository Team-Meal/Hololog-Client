import { AppTopbar } from "@/widgets/app-topbar";

// TODO: <AppSidebar /> — 다른 팀원이 구현 예정

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#f5f5f7" }}>
      {/* Sidebar slot */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppTopbar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
