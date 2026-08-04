import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingContact } from "@/components/layout/floating-contact";
import { locales, type Locale } from "@/config/site";
import { getSettings } from "@/services/content";
import { Toaster } from "sonner";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!locales.includes(localeParam as Locale)) notFound();
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const messages = await getMessages();
  const settings = await getSettings();
  const companyName = locale === "ar" ? settings.companyNameAr : settings.companyNameEn;
  const address = locale === "ar" ? settings.addressAr : settings.addressEn;
  const hours = settings.businessHours as { ar?: string; en?: string };

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>
        <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen">
          <SiteHeader
            companyName={companyName}
            phone={settings.phone}
            whatsapp={settings.whatsapp}
            logo={settings.logo}
          />
          <main>{children}</main>
          <SiteFooter
            locale={locale}
            companyName={companyName}
            phone={settings.phone}
            whatsapp={settings.whatsapp}
            email={settings.email}
            address={address}
            facebook={settings.facebook}
            instagram={settings.instagram}
            youtube={settings.youtube}
            tiktok={settings.tiktok}
            snapchat={settings.snapchat}
          />
          <FloatingContact phone={settings.phone} whatsapp={settings.whatsapp} />
          <Toaster richColors position="top-center" />
          <span className="sr-only">{hours?.[locale] ?? ""}</span>
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
