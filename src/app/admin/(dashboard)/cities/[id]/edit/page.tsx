import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/services/admin";
import { updateCity } from "@/features/admin/cities/actions";
import { CityForm } from "@/components/admin/forms/city-form";

export default async function EditCityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const city = await prisma.city.findUnique({ where: { id } });
  if (!city) notFound();

  return <CityForm action={updateCity.bind(null, city.id)} city={city} />;
}
