"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ContentStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { requireAdmin } from "@/services/admin";

const faqSchema = z.object({
  questionAr: z.string().min(1),
  questionEn: z.string().min(1),
  answerAr: z.string().min(1),
  answerEn: z.string().min(1),
  status: z.nativeEnum(ContentStatus),
  sortOrder: z.coerce.number().int().default(0),
});

export async function createFaq(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = faqSchema.parse({
    questionAr: formData.get("questionAr"),
    questionEn: formData.get("questionEn"),
    answerAr: formData.get("answerAr"),
    answerEn: formData.get("answerEn"),
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });

  const faq = await prisma.faq.create({ data: parsed });
  await logActivity({
    adminId: admin.id,
    action: "CREATE",
    entity: "Faq",
    entityId: faq.id,
  });
  revalidatePath("/admin/faqs");
  redirect("/admin/faqs");
}

export async function updateFaq(id: string, formData: FormData) {
  const admin = await requireAdmin();
  const parsed = faqSchema.parse({
    questionAr: formData.get("questionAr"),
    questionEn: formData.get("questionEn"),
    answerAr: formData.get("answerAr"),
    answerEn: formData.get("answerEn"),
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });

  await prisma.faq.update({ where: { id }, data: parsed });
  await logActivity({
    adminId: admin.id,
    action: "UPDATE",
    entity: "Faq",
    entityId: id,
  });
  revalidatePath("/admin/faqs");
  redirect("/admin/faqs");
}

export async function deleteFaq(id: string) {
  const admin = await requireAdmin();
  await prisma.faq.delete({ where: { id } });
  await logActivity({
    adminId: admin.id,
    action: "DELETE",
    entity: "Faq",
    entityId: id,
  });
  revalidatePath("/admin/faqs");
}

export async function toggleFaqStatus(id: string) {
  const admin = await requireAdmin();
  const row = await prisma.faq.findUniqueOrThrow({ where: { id } });
  const newStatus =
    row.status === ContentStatus.PUBLISHED ? ContentStatus.DRAFT : ContentStatus.PUBLISHED;
  await prisma.faq.update({ where: { id }, data: { status: newStatus } });
  await logActivity({
    adminId: admin.id,
    action: "TOGGLE_STATUS",
    entity: "Faq",
    entityId: id,
  });
  revalidatePath("/admin/faqs");
}
