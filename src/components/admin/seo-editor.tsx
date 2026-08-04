import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BilingualGrid, LangColumn } from "@/components/admin/shared";
import { TextAreaInput, TextInput } from "@/components/admin/fields";
import { ImageUploadField } from "@/components/admin/image-upload";

export function SeoEditor({
  pageKeys,
  settings,
  action,
}: {
  pageKeys: readonly { pageKey: string; label: string }[];
  settings: Record<
    string,
    {
      metaTitleAr: string;
      metaTitleEn: string;
      metaDescriptionAr: string;
      metaDescriptionEn: string;
      keywords: string;
      ogImage: string | null;
    }
  >;
  action: (pageKey: string, formData: FormData) => Promise<void>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">SEO Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Meta titles, descriptions, and keywords for each page.
        </p>
      </div>

      {pageKeys.map(({ pageKey, label }) => {
        const setting = settings[pageKey];
        return (
          <Card key={pageKey}>
            <CardHeader>
              <CardTitle>{label}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Page key: <span className="font-mono">{pageKey}</span>
              </p>
            </CardHeader>
            <CardContent>
              <form action={action.bind(null, pageKey)} className="space-y-6">
                <BilingualGrid>
                  <LangColumn lang="ar">
                    <TextInput label="Meta Title (Arabic)" name="metaTitleAr" defaultValue={setting?.metaTitleAr ?? ""} />
                    <TextAreaInput
                      label="Meta Description (Arabic)"
                      name="metaDescriptionAr"
                      defaultValue={setting?.metaDescriptionAr ?? ""}
                      rows={2}
                    />
                  </LangColumn>
                  <LangColumn lang="en">
                    <TextInput label="Meta Title (English)" name="metaTitleEn" defaultValue={setting?.metaTitleEn ?? ""} />
                    <TextAreaInput
                      label="Meta Description (English)"
                      name="metaDescriptionEn"
                      defaultValue={setting?.metaDescriptionEn ?? ""}
                      rows={2}
                    />
                  </LangColumn>
                </BilingualGrid>

                <TextInput
                  label="Keywords"
                  name="keywords"
                  defaultValue={setting?.keywords ?? ""}
                  placeholder="comma, separated, keywords"
                />
                <ImageUploadField
                  name="ogImage"
                  label="Open Graph Image"
                  defaultValue={setting?.ogImage ?? ""}
                  folder="seo"
                />

                <Button type="submit">Save</Button>
              </form>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
