import { createTestimonial } from "@/features/admin/testimonials/actions";
import { TestimonialForm } from "@/components/admin/forms/testimonial-form";

export default function NewTestimonialPage() {
  return <TestimonialForm action={createTestimonial} />;
}
