"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Locale } from "@/config/site";

type FooterProps = {
  locale: Locale;
  companyName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  snapchat?: string;
};

export function SiteFooter({
  locale,
  companyName,
  phone,
  whatsapp,
  email,
  address,
  facebook,
  instagram,
  youtube,
  tiktok,
  snapchat,
}: FooterProps) {
  const t = useTranslations();

  const links = [
    { href: `/${locale}/about`, label: t("About") },
    { href: `/${locale}/how-it-works`, label: t("HowItWorks") },
    { href: `/${locale}/faq`, label: t("FAQ") },
    { href: `/${locale}/contact`, label: t("Contact") },
    { href: `/${locale}/privacy`, label: t("Privacy") },
    { href: `/${locale}/terms`, label: t("Terms") },
  ];

  const socials = [
    { href: facebook, label: "Facebook" },
    { href: instagram, label: "Instagram" },
    { href: youtube, label: "YouTube" },
    { href: tiktok, label: "TikTok" },
    { href: snapchat, label: "Snapchat" },
  ].filter((s) => s.href);

  return (
    <footer className="mt-10 border-t border-border/70 bg-white/50 dark:bg-slate-950/50">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div>
          <h2 className="text-xl font-bold">{companyName}</h2>
          <p className="mt-3 text-sm text-muted-foreground">{address}</p>
        </div>
        <div>
          <h3 className="font-semibold">{t("Contact")}</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href={`tel:${phone}`} className="hover:text-primary">
                {phone}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                className="hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp: {whatsapp}
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="hover:text-primary">
                {email}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">{t("Categories")}</h3>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {socials.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  {social.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {companyName}
      </div>
    </footer>
  );
}
