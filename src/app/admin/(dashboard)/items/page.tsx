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
    <div className="space-y-6">
      <PageHeader
        title="Items"
        description="Manage the items you buy, shown in categories"
        action={
          <Button asChild className="gap-1.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-sm">
            <Link href="/admin/items/new">
              <Plus className="h-4 w-4" />
              New Item
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <form className="flex flex-1 gap-3">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by title..."
            className="h-11 w-full max-w-xs rounded-xl border border-border/60 bg-white px-4 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-400"
          />
          <select
            name="status"
            defaultValue={status ?? "ALL"}
            className="h-11 rounded-xl border border-border/60 bg-white px-4 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-400"
          >
            <option value="ALL">All statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <Button type="submit" variant="outline" className="border-border/60">
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
                    <div className="relative h-10 w-14 overflow-hidden rounded-lg border border-border/60 bg-muted/20">
                      <Image
                        src={item.thumbnail}
                        alt={item.titleEn}
                        fill
                        className="object-cover"
                        unoptimized={item.thumbnail.startsWith("data:")}
                      />
                    </div>
                  ) : (
                    <div className="flex h-10 w-14 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20">
                      <span className="text-xs text-muted-foreground/60">No img</span>
                    </div>
                  )}
                </AdminTableCell>
                <AdminTableCell>
                  <p className="font-semibold text-foreground">{item.titleEn}</p>
                  <p className="text-xs text-muted-foreground" dir="rtl">
                    {item.titleAr}
                  </p>
                </AdminTableCell>
                <AdminTableCell>
                  <span className="rounded-md bg-muted/50 px-2 py-1 text-xs font-medium text-muted-foreground">
                    {item.category.nameEn}
                  </span>
                </AdminTableCell>
                <AdminTableCell>
                  <StatusBadge status={item.status} />
                </AdminTableCell>
                <AdminTableCell>
                  {item.featured ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                      ★ Featured
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </AdminTableCell>
                <AdminTableCell>
                  <span className="text-muted-foreground">{item.sortOrder}</span>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex items-center justify-end gap-1.5">
                    <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                      <Link href={`/admin/items/${item.id}/edit`}>
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                    </Button>
                    <ToggleButton
                      action={toggleItemFeatured.bind(null, item.id)}
                      label={item.featured ? "Unfeature" : "Feature"}
                      active={item.featured}
                    />
                    <DeleteButton action={deleteItem.bind(null, item.id)} />
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
