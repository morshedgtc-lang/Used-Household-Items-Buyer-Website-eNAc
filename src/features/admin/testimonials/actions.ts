"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ContentStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { requireAdmin } from "@/services/admin";

const testimonialSchema = z.object({
  name: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  messageAr: z.string().min(1),
  messageEn: z.string().min(1),
  status: z.nativeEnum(ContentStatus),
  sortOrder: z.coerce.number().int().default(0),
});

export async function createTestimonial(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = testimonialSchema.parse({
    name: formData.get("name"),
    rating: formData.get("rating") ?? 5,
    messageAr: formData.get("messageAr"),
    messageEn: formData.get("messageEn"),
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });

  const testimonial = await prisma.testimonial.create({ data: parsed });
  await logActivity({
    adminId: admin.id,
    action: "CREATE",
    entity: "Testimonial",
    entityId: testimonial.id,
  });
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export async function updateTestimonial(id: string, formData: FormData) {
  const admin = await requireAdmin();
  const parsed = testimonialSchema.parse({
    name: formData.get("name"),
    rating: formData.get("rating") ?? 5,
    messageAr: formData.get("messageAr"),
    messageEn: formData.get("messageEn"),
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });

  await prisma.testimonial.update({ where: { id }, data: parsed });
  await logActivity({
    adminId: admin.id,
    action: "UPDATE",
    entity: "Testimonial",
    entityId: id,
  });
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  const admin = await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  await logActivity({
    adminId: admin.id,
    action: "DELETE",
    entity: "Testimonial",
    entityId: id,
  });
  revalidatePath("/admin/testimonials");
}

export async function toggleTestimonialStatus(id: string) {
  const admin = await requireAdmin();
  const row = await prisma.testimonial.findUniqueOrThrow({ where: { id } });
  const newStatus =
    row.status === ContentStatus.PUBLISHED ? ContentStatus.DRAFT : ContentStatus.PUBLISHED;
  await prisma.testimonial.update({ where: { id }, data: { status: newStatus } });
  await logActivity({
    adminId: admin.id,
    action: "TOGGLE_STATUS",
    entity: "Testimonial",
    entityId: id,
  });
  revalidatePath("/admin/testimonials");
}
