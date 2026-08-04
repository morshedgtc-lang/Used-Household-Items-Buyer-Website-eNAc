import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BilingualGrid, LangColumn } from "@/components/admin/shared";
import { TextAreaInput, TextInput } from "@/components/admin/fields";
import { ImageUploadField } from "@/components/admin/image-upload";

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6">{children}</CardContent>
    </Card>
  );
}

export function HomepageEditor({
  action,
  dataByKey,
}: {
  action: (pageKey: string, formData: FormData) => Promise<void>;
  dataByKey: Record<string, Record<string, unknown>>;
}) {
  const hero = dataByKey.home_hero ?? {};
  const why = dataByKey.why_us ?? {};
  const cta = dataByKey.cta ?? {};
  const how = dataByKey.how_it_works ?? {};
  const about = dataByKey.about ?? {};
  const privacy = dataByKey.privacy ?? {};
  const terms = dataByKey.terms ?? {};
  const whyPoints = Array.isArray(why.points)
    ? (why.points as { icon: string; titleAr: string; titleEn: string }[])
    : [];

  const sections: { pageKey: string; title: string; description: string; body: React.ReactNode }[] = [
    {
      pageKey: "home_hero",
      title: "Hero Section",
      description: "Main banner text and background image on the homepage.",
      body: (
        <>
          <BilingualGrid>
            <LangColumn lang="ar">
              <TextInput label="العنوان الرئيسي" name="titleAr" defaultValue={(hero.titleAr as string) ?? ""} />
              <TextAreaInput label="العنوان الفرعي" name="subtitleAr" defaultValue={(hero.subtitleAr as string) ?? ""} />
            </LangColumn>
            <LangColumn lang="en">
              <TextInput label="Main Title" name="titleEn" defaultValue={(hero.titleEn as string) ?? ""} />
              <TextAreaInput label="Subtitle" name="subtitleEn" defaultValue={(hero.subtitleEn as string) ?? ""} />
            </LangColumn>
          </BilingualGrid>
          <ImageUploadField
            name="image"
            label="Hero Background Image"
            defaultValue={(hero.image as string) ?? ""}
            folder="home"
          />
        </>
      ),
    },
    {
      pageKey: "cta",
      title: "Call to Action",
      description: "The closing call-to-action section on the homepage.",
      body: (
        <BilingualGrid>
          <LangColumn lang="ar">
            <TextInput label="العنوان" name="titleAr" defaultValue={(cta.titleAr as string) ?? ""} />
            <TextAreaInput label="الوصف" name="subtitleAr" defaultValue={(cta.subtitleAr as string) ?? ""} />
          </LangColumn>
          <LangColumn lang="en">
            <TextInput label="Title" name="titleEn" defaultValue={(cta.titleEn as string) ?? ""} />
            <TextAreaInput label="Subtitle" name="subtitleEn" defaultValue={(cta.subtitleEn as string) ?? ""} />
          </LangColumn>
        </BilingualGrid>
      ),
    },
    {
      pageKey: "why_us",
      title: "Why Choose Us",
      description: "Value points shown on the homepage. Empty rows are ignored.",
      body: (
        <>
          <input type="hidden" name="pointsCount" value="6" />
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => {
              const point = whyPoints[index];
              return (
                <div
                  key={index}
                  className="grid gap-3 rounded-xl border border-border bg-background/50 p-4 md:grid-cols-3"
                >
                  <TextInput
                    label="Icon"
                    name={`point_icon_${index}`}
                    defaultValue={point?.icon ?? ""}
                    placeholder="e.g. truck"
                  />
                  <TextInput
                    label="Title (Arabic)"
                    name={`point_titleAr_${index}`}
                    defaultValue={point?.titleAr ?? ""}
                  />
                  <TextInput
                    label="Title (English)"
                    name={`point_titleEn_${index}`}
                    defaultValue={point?.titleEn ?? ""}
                  />
                </div>
              );
            })}
          </div>
        </>
      ),
    },
    {
      pageKey: "how_it_works",
      title: "How It Works",
      description: "Intro text for the how-it-works section (the 5 steps use translations).",
      body: (
        <BilingualGrid>
          <LangColumn lang="ar">
            <TextAreaInput label="المقدمة (العربية)" name="introAr" defaultValue={(how.introAr as string) ?? ""} />
          </LangColumn>
          <LangColumn lang="en">
            <TextAreaInput label="Intro (English)" name="introEn" defaultValue={(how.introEn as string) ?? ""} />
          </LangColumn>
        </BilingualGrid>
      ),
    },
    {
      pageKey: "about",
      title: "About Page",
      description: "Content shown on the About page.",
      body: (
        <BilingualGrid>
          <LangColumn lang="ar">
            <TextAreaInput label="قصتنا" name="storyAr" defaultValue={(about.storyAr as string) ?? ""} />
            <TextInput label="رسالتنا" name="missionAr" defaultValue={(about.missionAr as string) ?? ""} />
            <TextInput label="رؤيتنا" name="visionAr" defaultValue={(about.visionAr as string) ?? ""} />
            <TextInput label="خبرتنا" name="experienceAr" defaultValue={(about.experienceAr as string) ?? ""} />
            <TextInput label="مناطق التغطية" name="areasAr" defaultValue={(about.areasAr as string) ?? ""} />
          </LangColumn>
          <LangColumn lang="en">
            <TextAreaInput label="Our Story" name="storyEn" defaultValue={(about.storyEn as string) ?? ""} />
            <TextInput label="Mission" name="missionEn" defaultValue={(about.missionEn as string) ?? ""} />
            <TextInput label="Vision" name="visionEn" defaultValue={(about.visionEn as string) ?? ""} />
            <TextInput label="Experience" name="experienceEn" defaultValue={(about.experienceEn as string) ?? ""} />
            <TextInput label="Coverage Areas" name="areasEn" defaultValue={(about.areasEn as string) ?? ""} />
          </LangColumn>
        </BilingualGrid>
      ),
    },
    {
      pageKey: "privacy",
      title: "Privacy Policy",
      description: "Body text for the privacy policy page.",
      body: (
        <BilingualGrid>
          <LangColumn lang="ar">
            <TextAreaInput label="النص (العربية)" name="bodyAr" defaultValue={(privacy.bodyAr as string) ?? ""} rows={8} />
          </LangColumn>
          <LangColumn lang="en">
            <TextAreaInput label="Body (English)" name="bodyEn" defaultValue={(privacy.bodyEn as string) ?? ""} rows={8} />
          </LangColumn>
        </BilingualGrid>
      ),
    },
    {
      pageKey: "terms",
      title: "Terms & Conditions",
      description: "Body text for the terms page.",
      body: (
        <BilingualGrid>
          <LangColumn lang="ar">
            <TextAreaInput label="النص (العربية)" name="bodyAr" defaultValue={(terms.bodyAr as string) ?? ""} rows={8} />
          </LangColumn>
          <LangColumn lang="en">
            <TextAreaInput label="Body (English)" name="bodyEn" defaultValue={(terms.bodyEn as string) ?? ""} rows={8} />
          </LangColumn>
        </BilingualGrid>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Homepage & Page Content</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit the content of each section. Changes publish immediately.
        </p>
      </div>

      {sections.map((section) => (
        <SectionCard
          key={section.pageKey}
          title={section.title}
          description={section.description}
        >
          <form action={action.bind(null, section.pageKey)}>
            {section.body}
            <div className="mt-6">
              <Button type="submit">Save section</Button>
            </div>
          </form>
        </SectionCard>
      ))}
    </div>
  );
}
