import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/services/admin";
import { updateTestimonial } from "@/features/admin/testimonials/actions";
import { TestimonialForm } from "@/components/admin/forms/testimonial-form";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  return (
    <TestimonialForm
      action={updateTestimonial.bind(null, testimonial.id)}
      testimonial={testimonial}
    />
  );
}
