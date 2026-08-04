import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdminSession } from "@/lib/admin";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  return (
    <div className="flex min-h-screen bg-[#f8faf9]">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-border bg-white/80 px-6 py-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Signed in as</p>
            <p className="text-sm font-semibold">{session.user.email}</p>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
