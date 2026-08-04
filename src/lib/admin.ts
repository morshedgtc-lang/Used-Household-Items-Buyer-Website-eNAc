import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/admin/login");
  }
  return session;
}
