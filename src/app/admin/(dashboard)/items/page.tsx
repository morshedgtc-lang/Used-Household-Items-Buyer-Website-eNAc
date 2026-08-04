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
  deleteItem,
  toggleItemFeatured,
} from "@/features/admin/items/actions";

export const dynamic = "force-dynamic";

export default async function AdminItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requireAdmin();
  const { status, q } = await searchParams;

  const items = await prisma.item.findMany({
    include: {
      category: true,
      _count: { select: { clickEvents: true } },
    },
    where: {
      ...(status && status !== "ALL" ? { status: status as never } : {}),
      ...(q
        ? {
            OR: [
              { titleAr: { contains: q, mode: "insensitive" } },
              { titleEn: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <PageHeader
        title="Items"
        description="Manage the items you buy, shown in categories"
        action={
          <Button asChild>
            <Link href="/admin/items/new">
              <Plus className="h-4 w-4" />
              New Item
            </Link>
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <form className="flex flex-1 gap-3">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by title..."
            className="h-11 w-full max-w-xs rounded-xl border border-border bg-background/80 px-4 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          />
          <select
            name="status"
            defaultValue={status ?? "ALL"}
            className="h-11 rounded-xl border border-border bg-background/80 px-4 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <option value="ALL">All statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <Button type="submit" variant="outline">
            Filter
          </Button>
        </form>
      </div>

      {items.length === 0 ? (
        <EmptyState message="No items found. Create your first item to get started." />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell>Thumbnail</AdminTableHeaderCell>
              <AdminTableHeaderCell>Title</AdminTableHeaderCell>
              <AdminTableHeaderCell>Category</AdminTableHeaderCell>
              <AdminTableHeaderCell>Status</AdminTableHeaderCell>
              <AdminTableHeaderCell>Featured</AdminTableHeaderCell>
              <AdminTableHeaderCell>Order</AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-right">Actions</AdminTableHeaderCell>
            </tr>
          </AdminTableHead>
          <tbody>
            {items.map((item) => (
              <AdminTableRow key={item.id}>
                <AdminTableCell>
                  {item.thumbnail ? (
                    <div className="relative h-10 w-14 overflow-hidden rounded-lg border border-border">
                      <Image
                        src={item.thumbnail}
                        alt={item.titleEn}
                        fill
                        className="object-cover"
                        unoptimized={item.thumbnail.startsWith("data:")}
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </AdminTableCell>
                <AdminTableCell>
                  <p className="font-semibold">{item.titleEn}</p>
                  <p className="text-xs text-muted-foreground" dir="rtl">
                    {item.titleAr}
                  </p>
                </AdminTableCell>
                <AdminTableCell>{item.category.nameEn}</AdminTableCell>
                <AdminTableCell>
                  <StatusBadge status={item.status} />
                </AdminTableCell>
                <AdminTableCell>{item.featured ? "Yes" : "No"}</AdminTableCell>
                <AdminTableCell>{item.sortOrder}</AdminTableCell>
                <AdminTableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/items/${item.id}/edit`}>
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                    </Button>
                    <ToggleButton
                      action={async () => toggleItemFeatured(item.id)}
                      label={item.featured ? "Unfeature" : "Feature"}
                      active={item.featured}
                    />
                    <DeleteButton action={async () => deleteItem(item.id)} />
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
