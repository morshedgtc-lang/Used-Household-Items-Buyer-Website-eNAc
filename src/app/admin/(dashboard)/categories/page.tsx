import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/services/admin";
import { Button } from "@/components/ui/button";
import {
  AdminTable,
  AdminTableHead,
  AdminTableRow,
  AdminTableCell,
  AdminTableHeaderCell,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/admin/shared";
import { DeleteButton, ToggleButton } from "@/components/admin/action-buttons";
import {
  deleteCategory,
  toggleCategoryStatus,
} from "@/features/admin/categories/actions";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
  });

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Manage the item categories shown on your website"
        action={
          <Button asChild>
            <Link href="/admin/categories/new">
              <Plus className="h-4 w-4" />
              New Category
            </Link>
          </Button>
        }
      />

      {categories.length === 0 ? (
        <EmptyState message="No categories yet. Create your first category to get started." />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell>Image</AdminTableHeaderCell>
              <AdminTableHeaderCell>Name</AdminTableHeaderCell>
              <AdminTableHeaderCell>Slug</AdminTableHeaderCell>
              <AdminTableHeaderCell>Items</AdminTableHeaderCell>
              <AdminTableHeaderCell>Status</AdminTableHeaderCell>
              <AdminTableHeaderCell>Order</AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-right">Actions</AdminTableHeaderCell>
            </tr>
          </AdminTableHead>
          <tbody>
            {categories.map((category) => (
              <AdminTableRow key={category.id}>
                <AdminTableCell>
                  {category.image ? (
                    <div className="relative h-10 w-14 overflow-hidden rounded-lg border border-border">
                      <Image
                        src={category.image}
                        alt={category.nameEn}
                        fill
                        className="object-cover"
                        unoptimized={category.image.startsWith("data:")}
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </AdminTableCell>
                <AdminTableCell>
                  <p className="font-semibold">{category.nameEn}</p>
                  <p className="text-xs text-muted-foreground" dir="rtl">
                    {category.nameAr}
                  </p>
                </AdminTableCell>
                <AdminTableCell>
                  <span className="font-mono text-xs">{category.slug}</span>
                </AdminTableCell>
                <AdminTableCell>{category._count.items}</AdminTableCell>
                <AdminTableCell>
                  <StatusBadge status={category.status} />
                </AdminTableCell>
                <AdminTableCell>{category.sortOrder}</AdminTableCell>
                <AdminTableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                    </Button>
                    <ToggleButton
                      action={async () => toggleCategoryStatus(category.id)}
                      label={
                        category.status === "PUBLISHED" ? "Unpublish" : "Publish"
                      }
                      active={category.status === "PUBLISHED"}
                    />
                    <DeleteButton action={async () => deleteCategory(category.id)} />
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}
