import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/contact-form";
import { ConversionButtons } from "@/components/items/conversion-buttons";
import type { Locale } from "@/config/site";
import { getSettings } from "@/services/content";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildPageMetadata("contact", locale as Locale);
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const settings = await getSettings();
  const companyName = locale === "ar" ? settings.companyNameAr : settings.companyNameEn;
  const address = locale === "ar" ? settings.addressAr : settings.addressEn;
  const hours = settings.businessHours as { ar?: string; en?: string };

  return (
    <div className="container-page section-space">
      <h1 className="text-4xl font-bold">{t("Contact")}</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Card className="space-y-4 p-6">
          <div>
            <h2 className="font-semibold">{t("Phone")}</h2>
            <a href={`tel:${settings.phone}`} className="text-primary hover:underline">
              {settings.phone}
            </a>
          </div>
          <div>
            <h2 className="font-semibold">{t("WhatsApp")}</h2>
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {settings.whatsapp}
            </a>
          </div>
          <div>
            <h2 className="font-semibold">Email</h2>
            <a href={`mailto:${settings.email}`} className="text-primary hover:underline">
              {settings.email}
            </a>
          </div>
          <div>
            <h2 className="font-semibold">{t("Address")}</h2>
            <p className="text-muted-foreground">{address}</p>
          </div>
          <div>
            <h2 className="font-semibold">{t("BusinessHours")}</h2>
            <p className="text-muted-foreground">{hours?.[locale] ?? ""}</p>
          </div>
          <ConversionButtons
            phone={settings.phone}
            whatsapp={settings.whatsapp}
            itemName={companyName}
          />
        </Card>
        <Card className="p-6">
          <ContactForm />
        </Card>
      </div>
      {settings.googleMapEmbed ? (
        <div className="mt-10 overflow-hidden rounded-3xl border border-border shadow-soft">
          <iframe
            src={settings.googleMapEmbed}
            title="Google Map"
            className="h-80 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : null}
    </div>
  );
}
