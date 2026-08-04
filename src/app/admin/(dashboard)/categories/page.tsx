import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Eye } from "lucide-react";
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
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage the item categories shown on your website"
        action={
          <Button asChild className="gap-1.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-sm">
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
                    <div className="relative h-10 w-14 overflow-hidden rounded-lg border border-border/60 bg-muted/20">
                      <Image
                        src={category.image}
                        alt={category.nameEn}
                        fill
                        className="object-cover"
                        unoptimized={category.image.startsWith("data:")}
                      />
                    </div>
                  ) : (
                    <div className="flex h-10 w-14 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20">
                      <span className="text-xs text-muted-foreground/60">No img</span>
                    </div>
                  )}
                </AdminTableCell>
                <AdminTableCell>
                  <p className="font-semibold text-foreground">{category.nameEn}</p>
                  <p className="text-xs text-muted-foreground" dir="rtl">
                    {category.nameAr}
                  </p>
                </AdminTableCell>
                <AdminTableCell>
                  <span className="rounded-md bg-muted/50 px-2 py-1 font-mono text-xs text-muted-foreground">
                    {category.slug}
                  </span>
                </AdminTableCell>
                <AdminTableCell>
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary/10 px-2 text-xs font-semibold text-primary">
                    {category._count.items}
                  </span>
                </AdminTableCell>
                <AdminTableCell>
                  <StatusBadge status={category.status} />
                </AdminTableCell>
                <AdminTableCell>
                  <span className="text-muted-foreground">{category.sortOrder}</span>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex items-center justify-end gap-1.5">
                    <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                      <Link href={`/admin/categories/${category.id}/edit`}>
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                    </Button>
                    <ToggleButton
                      action={async () => toggleCategoryStatus(category.id)}
                      label={category.status === "PUBLISHED" ? "Unpublish" : "Publish"}
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
