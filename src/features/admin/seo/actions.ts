"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { requireAdmin } from "@/services/admin";
import { SEO_PAGE_KEYS } from "@/features/admin/seo/constants";

export async function upsertSeo(pageKey: string, formData: FormData) {
  const admin = await requireAdmin();

  const valid = SEO_PAGE_KEYS.some((page) => page.pageKey === pageKey);
  if (!valid) throw new Error("Invalid page key");

  const data = {
    metaTitleAr: String(formData.get("metaTitleAr") ?? ""),
    metaTitleEn: String(formData.get("metaTitleEn") ?? ""),
    metaDescriptionAr: String(formData.get("metaDescriptionAr") ?? ""),
    metaDescriptionEn: String(formData.get("metaDescriptionEn") ?? ""),
    keywords: String(formData.get("keywords") ?? ""),
    ogImage: String(formData.get("ogImage") ?? "") || null,
  };

  await prisma.seoSetting.upsert({
    where: { pageKey },
    update: data,
    create: { pageKey, ...data },
  });

  await logActivity({
    adminId: admin.id,
    action: "UPDATE",
    entity: "SeoSetting",
    entityId: pageKey,
  });

  revalidatePath("/admin/seo");
}
