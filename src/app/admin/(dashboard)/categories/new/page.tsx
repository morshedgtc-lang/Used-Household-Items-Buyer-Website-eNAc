import { createCategory } from "@/features/admin/categories/actions";
import { CategoryForm } from "@/components/admin/forms/category-form";

export default function NewCategoryPage() {
  return <CategoryForm action={createCategory} />;
}
