import type { Category } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { BilingualGrid, FormActions, LangColumn, PageHeader } from "@/components/admin/shared";
import { NumberInput, StatusSelect, TextAreaInput, TextInput } from "@/components/admin/fields";
import { ImageUploadField } from "@/components/admin/image-upload";

export function CategoryForm({
  action,
  category,
}: {
  action: (formData: FormData) => Promise<void>;
  category?: Category;
}) {
  return (
    <form action={action}>
      <PageHeader
        title={category ? "Edit Category" : "New Category"}
        description={category ? `Editing: ${category.nameEn}` : "Add a new item category"}
      />

      <div className="space-y-6">
        <Card>
          <CardContent className="grid gap-6 p-6">
            <BilingualGrid>
              <LangColumn lang="ar">
                <TextInput
                  label="الاسم (العربية)"
                  name="nameAr"
                  required
                  defaultValue={category?.nameAr}
                />
                <TextAreaInput
                  label="الوصف (العربية)"
                  name="descriptionAr"
                  defaultValue={category?.descriptionAr}
                />
              </LangColumn>
              <LangColumn lang="en">
                <TextInput
                  label="Name (English)"
                  name="nameEn"
                  required
                  defaultValue={category?.nameEn}
                />
                <TextAreaInput
                  label="Description (English)"
                  name="descriptionEn"
                  defaultValue={category?.descriptionEn}
                />
              </LangColumn>
            </BilingualGrid>

            <div className="grid gap-6 md:grid-cols-2">
              <TextInput
                label="Slug"
                name="slug"
                defaultValue={category?.slug}
                placeholder="auto-generated from name"
                hint="URL-friendly identifier. Leave empty to auto-generate."
              />
              <TextInput
                label="Icon"
                name="icon"
                defaultValue={category?.icon}
                placeholder="e.g. sofa"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <StatusSelect defaultValue={category?.status} />
              <NumberInput
                label="Sort Order"
                name="sortOrder"
                defaultValue={category?.sortOrder ?? 0}
                hint="Lower numbers appear first."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-6 p-6">
            <ImageUploadField
              name="image"
              label="Category Image"
              defaultValue={category?.image}
              folder="categories"
            />
          </CardContent>
        </Card>

        <FormActions cancelHref="/admin/categories" />
      </div>
    </form>
  );
}
