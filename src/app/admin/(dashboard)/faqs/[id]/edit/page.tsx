import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/services/admin";
import { updateFaq } from "@/features/admin/faqs/actions";
import { FaqForm } from "@/components/admin/forms/faq-form";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const faq = await prisma.faq.findUnique({ where: { id } });
  if (!faq) notFound();

  return <FaqForm action={updateFaq.bind(null, faq.id)} faq={faq} />;
}
