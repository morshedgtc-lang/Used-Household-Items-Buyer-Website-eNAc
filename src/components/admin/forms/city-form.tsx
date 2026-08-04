import type { City } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { BilingualGrid, FormActions, LangColumn, PageHeader } from "@/components/admin/shared";
import { NumberInput, StatusSelect, TextInput } from "@/components/admin/fields";

export function CityForm({
  action,
  city,
}: {
  action: (formData: FormData) => Promise<void>;
  city?: City;
}) {
  return (
    <form action={action}>
      <PageHeader
        title={city ? "Edit City" : "New City"}
        description={city ? `Editing: ${city.nameEn}` : "Add a city where you provide pickup"}
      />

      <div className="space-y-6">
        <Card>
          <CardContent className="grid gap-6 p-6">
            <BilingualGrid>
              <LangColumn lang="ar">
                <TextInput label="الاسم (العربية)" name="nameAr" required defaultValue={city?.nameAr} />
              </LangColumn>
              <LangColumn lang="en">
                <TextInput label="Name (English)" name="nameEn" required defaultValue={city?.nameEn} />
              </LangColumn>
            </BilingualGrid>

            <div className="grid gap-6 md:grid-cols-2">
              <StatusSelect defaultValue={city?.status} />
              <NumberInput
                label="Sort Order"
                name="sortOrder"
                defaultValue={city?.sortOrder ?? 0}
              />
            </div>
          </CardContent>
        </Card>

        <FormActions cancelHref="/admin/cities" />
      </div>
    </form>
  );
}
