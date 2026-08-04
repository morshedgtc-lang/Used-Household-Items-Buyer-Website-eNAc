import type { Testimonial } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { BilingualGrid, FormActions, LangColumn, PageHeader } from "@/components/admin/shared";
import { NumberInput, StatusSelect, TextAreaInput, TextInput } from "@/components/admin/fields";

export function TestimonialForm({
  action,
  testimonial,
}: {
  action: (formData: FormData) => Promise<void>;
  testimonial?: Testimonial;
}) {
  return (
    <form action={action}>
      <PageHeader
        title={testimonial ? "Edit Testimonial" : "New Testimonial"}
        description={testimonial ? `Editing review by ${testimonial.name}` : "Add a customer review"}
      />

      <div className="space-y-6">
        <Card>
          <CardContent className="grid gap-6 p-6 md:grid-cols-2">
            <TextInput label="Customer Name" name="name" required defaultValue={testimonial?.name} />
            <NumberInput
              label="Rating (1–5)"
              name="rating"
              min={1}
              max={5}
              defaultValue={testimonial?.rating ?? 5}
            />
            <BilingualGrid className="md:col-span-2">
              <LangColumn lang="ar">
                <TextAreaInput label="Message (Arabic)" name="messageAr" required defaultValue={testimonial?.messageAr} />
              </LangColumn>
              <LangColumn lang="en">
                <TextAreaInput label="Message (English)" name="messageEn" required defaultValue={testimonial?.messageEn} />
              </LangColumn>
            </BilingualGrid>
            <StatusSelect defaultValue={testimonial?.status} />
            <NumberInput
              label="Sort Order"
              name="sortOrder"
              defaultValue={testimonial?.sortOrder ?? 0}
            />
          </CardContent>
        </Card>

        <FormActions cancelHref="/admin/testimonials" />
      </div>
    </form>
  );
}
