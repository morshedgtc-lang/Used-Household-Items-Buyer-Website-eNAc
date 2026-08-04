"use client";

import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Phone, Sun, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { buildTelUrl, buildWhatsAppUrl } from "@/utils/whatsapp";
import type { Locale } from "@/config/site";

type HeaderProps = {
  companyName: string;
  phone: string;
  whatsapp: string;
  logo?: string | null;
};

export function SiteHeader({ companyName, phone, whatsapp, logo }: HeaderProps) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const links = [
    { href: `/${locale}`, label: t("Home") },
    { href: `/${locale}/categories`, label: t("Categories") },
    { href: `/${locale}/how-it-works`, label: t("HowItWorks") },
    { href: `/${locale}/about`, label: t("About") },
    { href: `/${locale}/faq`, label: t("FAQ") },
    { href: `/${locale}/contact`, label: t("Contact") },
  ];

  const otherLocale = locale === "ar" ? "en" : "ar";
  const switchedPath = pathname.replace(`/${locale}`, `/${otherLocale}`) || `/${otherLocale}`;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-white/70 backdrop-blur-xl dark:bg-slate-950/70">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={companyName} className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              W
            </span>
          )}
          <span className="max-w-[10rem] truncate text-base font-bold sm:max-w-none sm:text-lg">
            {companyName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href={switchedPath}>{t("Language")}</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={theme === "dark" ? t("LightMode") : t("DarkMode")}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="hidden h-4 w-4 dark:block" />
          </Button>
          <Button asChild variant="call" size="sm" className="hidden md:inline-flex">
            <a href={buildTelUrl(phone)}>
              <Phone className="h-4 w-4" />
              {t("CallNow")}
            </a>
          </Button>
          <Button asChild variant="whatsapp" size="sm" className="hidden md:inline-flex">
            <a
              href={buildWhatsAppUrl(whatsapp, companyName, locale)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("WhatsApp")}
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border/60 bg-background/95 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
            <Link href={switchedPath} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
              {t("Language")}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
