"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { requireAdmin } from "@/services/admin";

const PAGE_KEYS = [
  "home_hero",
  "why_us",
  "how_it_works",
  "cta",
  "about",
  "privacy",
  "terms",
] as const;

export async function updatePageContent(pageKey: string, formData: FormData) {
  const admin = await requireAdmin();

  if (!PAGE_KEYS.includes(pageKey as (typeof PAGE_KEYS)[number])) {
    throw new Error("Invalid page key");
  }

  const data: Record<string, unknown> = {};

  if (pageKey === "why_us") {
    const points: { icon: string; titleAr: string; titleEn: string }[] = [];
    const count = Number(formData.get("pointsCount") ?? 0);
    for (let i = 0; i < count; i++) {
      points.push({
        icon: String(formData.get(`point_icon_${i}`) ?? ""),
        titleAr: String(formData.get(`point_titleAr_${i}`) ?? ""),
        titleEn: String(formData.get(`point_titleEn_${i}`) ?? ""),
      });
    }
    data.points = points.filter((p) => p.titleAr || p.titleEn);
  } else {
    for (const [key, value] of formData.entries()) {
      if (key !== "pageKey") {
        data[key] = String(value);
      }
    }
  }

  await prisma.pageContent.upsert({
    where: { pageKey },
    update: { data: data as Prisma.InputJsonValue },
    create: { pageKey, data: data as Prisma.InputJsonValue },
  });

  await logActivity({
    adminId: admin.id,
    action: "UPDATE",
    entity: "PageContent",
    entityId: pageKey,
  });

  revalidatePath("/admin/homepage");
  redirect("/admin/homepage?saved=1");
}
