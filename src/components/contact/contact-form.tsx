"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Locale } from "@/config/site";

export function ContactForm() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      message: String(form.get("message") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      toast.success(t("FormSuccess"));
      event.currentTarget.reset();
    } catch {
      toast.error(t("FormError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="space-y-2">
        <Label htmlFor="name">{t("Name")}</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">{t("Phone")}</Label>
        <Input id="phone" name="phone" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">{t("Message")}</Label>
        <Textarea id="message" name="message" required />
      </div>
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? t("Loading") : t("SendMessage")}
      </Button>
    </form>
  );
}
