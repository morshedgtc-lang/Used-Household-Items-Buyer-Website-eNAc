import { createFaq } from "@/features/admin/faqs/actions";
import { FaqForm } from "@/components/admin/forms/faq-form";

export default function NewFaqPage() {
  return <FaqForm action={createFaq} />;
}
