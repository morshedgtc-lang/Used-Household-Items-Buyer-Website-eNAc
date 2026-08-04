import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/services/admin";
import { updateCategory } from "@/features/admin/categories/actions";
import { CategoryForm } from "@/components/admin/forms/category-form";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return <CategoryForm action={updateCategory.bind(null, category.id)} category={category} />;
}
