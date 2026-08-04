import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/services/admin";
import { upsertSeo } from "@/features/admin/seo/actions";
import { SEO_PAGE_KEYS } from "@/features/admin/seo/constants";
import { SeoEditor } from "@/components/admin/seo-editor";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  await requireAdmin();
  const settings = await prisma.seoSetting.findMany();
  const byKey: Record<string, (typeof settings)[number]> = {};
  for (const setting of settings) byKey[setting.pageKey] = setting;

  return (
    <SeoEditor
      pageKeys={SEO_PAGE_KEYS}
      settings={byKey}
      action={upsertSeo}
    />
  );
}
