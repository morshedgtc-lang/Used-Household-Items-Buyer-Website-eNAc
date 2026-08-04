import type { Faq } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { BilingualGrid, FormActions, LangColumn, PageHeader } from "@/components/admin/shared";
import { NumberInput, StatusSelect, TextAreaInput } from "@/components/admin/fields";

export function FaqForm({
  action,
  faq,
}: {
  action: (formData: FormData) => Promise<void>;
  faq?: Faq;
}) {
  return (
    <form action={action}>
      <PageHeader
        title={faq ? "Edit FAQ" : "New FAQ"}
        description={faq ? `Editing: ${faq.questionEn}` : "Add a frequently asked question"}
      />

      <div className="space-y-6">
        <Card>
          <CardContent className="grid gap-6 p-6">
            <BilingualGrid>
              <LangColumn lang="ar">
                <TextAreaInput label="السؤال (العربية)" name="questionAr" required defaultValue={faq?.questionAr} />
                <TextAreaInput label="الإجابة (العربية)" name="answerAr" required defaultValue={faq?.answerAr} />
              </LangColumn>
              <LangColumn lang="en">
                <TextAreaInput label="Question (English)" name="questionEn" required defaultValue={faq?.questionEn} />
                <TextAreaInput label="Answer (English)" name="answerEn" required defaultValue={faq?.answerEn} />
              </LangColumn>
            </BilingualGrid>

            <div className="grid gap-6 md:grid-cols-2">
              <StatusSelect defaultValue={faq?.status} />
              <NumberInput
                label="Sort Order"
                name="sortOrder"
                defaultValue={faq?.sortOrder ?? 0}
              />
            </div>
          </CardContent>
        </Card>

        <FormActions cancelHref="/admin/faqs" />
      </div>
    </form>
  );
}
