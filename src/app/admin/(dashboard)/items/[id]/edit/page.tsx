import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/services/admin";
import { updateItem } from "@/features/admin/items/actions";
import { ItemForm } from "@/components/admin/forms/item-form";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [item, categories] = await Promise.all([
    prisma.item.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
    }),
  ]);

  if (!item) notFound();

  return <ItemForm action={updateItem.bind(null, item.id)} item={item} categories={categories} />;
}
