"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { requireAdmin } from "@/services/admin";

const settingsSchema = z.object({
  companyNameAr: z.string().min(1),
  companyNameEn: z.string().min(1),
  phone: z.string().min(1),
  whatsapp: z.string().min(1),
  email: z.string().email(),
  addressAr: z.string().default(""),
  addressEn: z.string().default(""),
  googleMapEmbed: z.string().default(""),
  facebook: z.string().default(""),
  instagram: z.string().default(""),
  snapchat: z.string().default(""),
  tiktok: z.string().default(""),
  youtube: z.string().default(""),
  businessHoursAr: z.string().default(""),
  businessHoursEn: z.string().default(""),
  gaId: z.string().default(""),
});

export async function updateSettings(formData: FormData) {
  const admin = await requireAdmin();

  const parsed = settingsSchema.parse({
    companyNameAr: formData.get("companyNameAr"),
    companyNameEn: formData.get("companyNameEn"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    email: formData.get("email"),
    addressAr: formData.get("addressAr") ?? "",
    addressEn: formData.get("addressEn") ?? "",
    googleMapEmbed: formData.get("googleMapEmbed") ?? "",
    facebook: formData.get("facebook") ?? "",
    instagram: formData.get("instagram") ?? "",
    snapchat: formData.get("snapchat") ?? "",
    tiktok: formData.get("tiktok") ?? "",
    youtube: formData.get("youtube") ?? "",
    businessHoursAr: formData.get("businessHoursAr") ?? "",
    businessHoursEn: formData.get("businessHoursEn") ?? "",
    gaId: formData.get("gaId") ?? "",
  });

  const { businessHoursAr, businessHoursEn, ...data } = parsed;

  await prisma.setting.upsert({
    where: { id: "default" },
    update: {
      ...data,
      businessHours: {
        ar: businessHoursAr,
        en: businessHoursEn,
      },
    },
    create: {
      id: "default",
      ...data,
      businessHours: {
        ar: businessHoursAr,
        en: businessHoursEn,
      },
    },
  });

  await logActivity({
    adminId: admin.id,
    action: "UPDATE",
    entity: "Setting",
    entityId: "default",
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
}
