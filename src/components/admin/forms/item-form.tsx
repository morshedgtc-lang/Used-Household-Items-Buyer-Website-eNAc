import type { Category, Item, ItemImage } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BilingualGrid, FormActions, LangColumn, PageHeader } from "@/components/admin/shared";
import {
  CheckboxInput,
  NumberInput,
  StatusSelect,
  TextAreaInput,
  TextInput,
} from "@/components/admin/fields";
import { Field } from "@/components/admin/fields";
import { ImageUploadField, MultiImageUpload } from "@/components/admin/image-upload";

export function ItemForm({
  action,
  item,
  categories,
}: {
  action: (formData: FormData) => Promise<void>;
  item?: Item & { images?: ItemImage[] };
  categories: Category[];
}) {
  return (
    <form action={action}>
      <PageHeader
        title={item ? "Edit Item" : "New Item"}
        description={item ? `Editing: ${item.titleEn}` : "Add a new item we buy"}
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Bilingual Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <BilingualGrid>
              <LangColumn lang="ar">
                <TextInput label="العنوان (العربية)" name="titleAr" required defaultValue={item?.titleAr} />
                <TextAreaInput
                  label="الوصف (العربية)"
                  name="descriptionAr"
                  defaultValue={item?.descriptionAr}
                />
                <TextAreaInput
                  label="المزايا (العربية) — سطر لكل ميزة"
                  name="benefitsAr"
                  defaultValue={item?.benefitsAr}
                  rows={4}
                />
                <TextAreaInput
                  label="معلومات الاستلام (العربية)"
                  name="pickupInfoAr"
                  defaultValue={item?.pickupInfoAr}
                  rows={3}
                />
              </LangColumn>
              <LangColumn lang="en">
                <TextInput label="Title (English)" name="titleEn" required defaultValue={item?.titleEn} />
                <TextAreaInput
                  label="Description (English)"
                  name="descriptionEn"
                  defaultValue={item?.descriptionEn}
                />
                <TextAreaInput
                  label="Benefits (English) — one per line"
                  name="benefitsEn"
                  defaultValue={item?.benefitsEn}
                  rows={4}
                />
                <TextAreaInput
                  label="Pickup Info (English)"
                  name="pickupInfoEn"
                  defaultValue={item?.pickupInfoEn}
                  rows={3}
                />
              </LangColumn>
            </BilingualGrid>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <Field label="Category" htmlFor="categoryId" required>
              <select
                id="categoryId"
                name="categoryId"
                required
                defaultValue={item?.categoryId}
                className="h-11 w-full rounded-xl border border-border bg-background/80 px-4 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nameEn} / {category.nameAr}
                  </option>
                ))}
              </select>
            </Field>
            <TextInput
              label="Slug"
              name="slug"
              defaultValue={item?.slug}
              placeholder="auto-generated from title"
              hint="URL-friendly identifier. Leave empty to auto-generate."
            />
            <StatusSelect defaultValue={item?.status} />
            <NumberInput
              label="Sort Order"
              name="sortOrder"
              defaultValue={item?.sortOrder ?? 0}
              hint="Lower numbers appear first."
            />
            <div className="md:col-span-2">
              <CheckboxInput
                label="Featured item"
                name="featured"
                defaultChecked={item?.featured}
                hint="Featured items are highlighted on the homepage."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ImageUploadField
              name="thumbnail"
              label="Thumbnail"
              defaultValue={item?.thumbnail}
              folder="items"
            />
            <MultiImageUpload
              name="images"
              defaultImages={
                item?.images?.map((image) => ({
                  url: image.url,
                  altAr: image.altAr,
                  altEn: image.altEn,
                })) ?? []
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <BilingualGrid>
              <LangColumn lang="ar">
                <TextInput label="Meta Title (Arabic)" name="metaTitleAr" defaultValue={item?.metaTitleAr} />
                <TextAreaInput
                  label="Meta Description (Arabic)"
                  name="metaDescriptionAr"
                  defaultValue={item?.metaDescriptionAr}
                  rows={2}
                />
              </LangColumn>
              <LangColumn lang="en">
                <TextInput label="Meta Title (English)" name="metaTitleEn" defaultValue={item?.metaTitleEn} />
                <TextAreaInput
                  label="Meta Description (English)"
                  name="metaDescriptionEn"
                  defaultValue={item?.metaDescriptionEn}
                  rows={2}
                />
              </LangColumn>
            </BilingualGrid>
          </CardContent>
        </Card>

        <FormActions cancelHref="/admin/items" />
      </div>
    </form>
  );
}
