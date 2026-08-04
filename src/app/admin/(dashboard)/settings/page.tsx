import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/services/admin";
import { PageHeader } from "@/components/admin/shared";
import { BilingualGrid, LangColumn } from "@/components/admin/shared";
import { TextInput, TextAreaInput, Field } from "@/components/admin/fields";
import { FormActions } from "@/components/admin/shared";
import { updateSettings } from "@/features/admin/settings/actions";
import { Settings, Phone, MessageCircle, Mail, MapPin, Globe, Clock } from "lucide-react";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await prisma.setting.findUnique({ where: { id: "default" } });

  const bh = (settings?.businessHours as Record<string, string>) ?? {
    ar: "السبت - الخميس: 9 ص - 9 م",
    en: "Sat - Thu: 9 AM - 9 PM",
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your business contact info, social links, and site settings"
      />

      <form action={updateSettings} className="space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <Settings className="h-4 w-4 text-blue-600" />
            </div>
            Company Name
          </div>
          <BilingualGrid>
            <LangColumn lang="ar">
              <TextInput label="Company Name (AR)" name="companyNameAr" required defaultValue={settings?.companyNameAr} placeholder="مشتري الأثاث المستعمل" />
            </LangColumn>
            <LangColumn lang="en">
              <TextInput label="Company Name (EN)" name="companyNameEn" required defaultValue={settings?.companyNameEn} placeholder="We Buy Used Furniture" />
            </LangColumn>
          </BilingualGrid>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
              <Phone className="h-4 w-4 text-emerald-600" />
            </div>
            Contact Information
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="Phone Number" name="phone" required defaultValue={settings?.phone} placeholder="+966500000000" hint="Include country code" />
            <TextInput label="WhatsApp Number" name="whatsapp" required defaultValue={settings?.whatsapp} placeholder="966500000000" hint="Without + or spaces, e.g. 966500000000" />
            <TextInput label="Email" name="email" required defaultValue={settings?.email} placeholder="info@example.com" />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
              <MapPin className="h-4 w-4 text-purple-600" />
            </div>
            Address
          </div>
          <BilingualGrid>
            <LangColumn lang="ar">
              <TextAreaInput label="Address (AR)" name="addressAr" defaultValue={settings?.addressAr} rows={2} />
            </LangColumn>
            <LangColumn lang="en">
              <TextAreaInput label="Address (EN)" name="addressEn" defaultValue={settings?.addressEn} rows={2} />
            </LangColumn>
          </BilingualGrid>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            Business Hours
          </div>
          <BilingualGrid>
            <LangColumn lang="ar">
              <TextInput label="Business Hours (AR)" name="businessHoursAr" defaultValue={bh.ar} placeholder="السبت - الخميس: 9 ص - 9 م" />
            </LangColumn>
            <LangColumn lang="en">
              <TextInput label="Business Hours (EN)" name="businessHoursEn" defaultValue={bh.en} placeholder="Sat - Thu: 9 AM - 9 PM" />
            </LangColumn>
          </BilingualGrid>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50">
              <Globe className="h-4 w-4 text-rose-600" />
            </div>
            Social Media Links
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="Facebook URL" name="facebook" defaultValue={settings?.facebook} placeholder="https://facebook.com/..." />
            <TextInput label="Instagram URL" name="instagram" defaultValue={settings?.instagram} placeholder="https://instagram.com/..." />
            <TextInput label="Snapchat URL" name="snapchat" defaultValue={settings?.snapchat} placeholder="https://snapchat.com/..." />
            <TextInput label="TikTok URL" name="tiktok" defaultValue={settings?.tiktok} placeholder="https://tiktok.com/..." />
            <TextInput label="YouTube URL" name="youtube" defaultValue={settings?.youtube} placeholder="https://youtube.com/..." />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
              <MapPin className="h-4 w-4 text-gray-600" />
            </div>
            Map & Analytics
          </div>
          <TextAreaInput label="Google Map Embed URL" name="googleMapEmbed" defaultValue={settings?.googleMapEmbed} rows={2} hint="Paste the embed URL from Google Maps" />
          <TextInput label="Google Analytics ID" name="gaId" defaultValue={settings?.gaId} placeholder="G-XXXXXXXXXX" />
        </section>

        <FormActions cancelHref="/admin" />
      </form>
    </div>
  );
}
