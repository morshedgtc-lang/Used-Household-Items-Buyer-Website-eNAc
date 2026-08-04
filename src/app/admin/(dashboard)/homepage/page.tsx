import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/services/admin";
import { updatePageContent } from "@/features/admin/homepage/actions";
import { HomepageEditor } from "@/components/admin/homepage-editor";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  await requireAdmin();
  const pageContents = await prisma.pageContent.findMany();

  const dataByKey: Record<string, Record<string, unknown>> = {};
  for (const row of pageContents) {
    dataByKey[row.pageKey] = (row.data ?? {}) as Record<string, unknown>;
  }

  return <HomepageEditor action={updatePageContent} dataByKey={dataByKey} />;
}
