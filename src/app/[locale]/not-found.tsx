import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations();
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">{t("NotFoundTitle")}</h1>
      <p className="mt-3 text-muted-foreground">{t("NotFoundDesc")}</p>
      <Button asChild className="mt-8">
        <Link href="/ar">{t("BackHome")}</Link>
      </Button>
    </div>
  );
}
