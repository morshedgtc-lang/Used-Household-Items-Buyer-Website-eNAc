import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/services/admin";
import { createItem } from "@/features/admin/items/actions";
import { ItemForm } from "@/components/admin/forms/item-form";

export default async function NewItemPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
  });

  return <ItemForm action={createItem} categories={categories} />;
}
