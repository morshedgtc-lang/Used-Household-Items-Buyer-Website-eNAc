"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/config/site";

type SearchResult = {
  categories: { slug: string; nameAr: string; nameEn: string }[];
  items: { slug: string; titleAr: string; titleEn: string }[];
};

export function InstantSearch() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) return;
      const data = (await res.json()) as SearchResult;
      setResults(data);
      setOpen(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground start-4" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={t("SearchPlaceholder")}
          className="h-14 rounded-2xl border-white/50 bg-white/80 pe-4 ps-11 text-base shadow-soft"
          aria-label={t("SearchPlaceholder")}
        />
      </div>
      {open && results ? (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-background/95 shadow-soft backdrop-blur">
          {!results.categories.length && !results.items.length ? (
            <p className="p-4 text-sm text-muted-foreground">{t("NoResults")}</p>
          ) : (
            <ul className="max-h-80 overflow-auto py-2">
              {results.categories.map((category) => (
                <li key={`c-${category.slug}`}>
                  <Link
                    href={`/${locale}/categories/${category.slug}`}
                    className="block px-4 py-2 text-sm hover:bg-muted"
                  >
                    {locale === "ar" ? category.nameAr : category.nameEn}
                  </Link>
                </li>
              ))}
              {results.items.map((item) => (
                <li key={`i-${item.slug}`}>
                  <Link
                    href={`/${locale}/items/${item.slug}`}
                    className="block px-4 py-2 text-sm hover:bg-muted"
                  >
                    {locale === "ar" ? item.titleAr : item.titleEn}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
