import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdminSession } from "@/lib/admin";
import { Shield } from "lucide-react";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-white/80 px-6 py-3 backdrop-blur-xl">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              <p className="text-xs font-medium text-emerald-700">{session.user.email}</p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
