import Link from "next/link";
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
import { deleteCity, toggleCityStatus } from "@/features/admin/cities/actions";

export default async function AdminCitiesPage() {
  await requireAdmin();
  const cities = await prisma.city.findMany({
    orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cities"
        description="Cities and areas where you offer pickup service"
        action={
          <Button asChild className="gap-1.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-sm">
            <Link href="/admin/cities/new">
              <Plus className="h-4 w-4" />
              New City
            </Link>
          </Button>
        }
      />

      {cities.length === 0 ? (
        <EmptyState message="No cities yet. Add the areas you serve." />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell>Name</AdminTableHeaderCell>
              <AdminTableHeaderCell>Status</AdminTableHeaderCell>
              <AdminTableHeaderCell>Order</AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-right">Actions</AdminTableHeaderCell>
            </tr>
          </AdminTableHead>
          <tbody>
            {cities.map((city) => (
              <AdminTableRow key={city.id}>
                <AdminTableCell>
                  <p className="font-semibold text-foreground">{city.nameEn}</p>
                  <p className="text-xs text-muted-foreground" dir="rtl">
                    {city.nameAr}
                  </p>
                </AdminTableCell>
                <AdminTableCell>
                  <StatusBadge status={city.status} />
                </AdminTableCell>
                <AdminTableCell>
                  <span className="text-muted-foreground">{city.sortOrder}</span>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex items-center justify-end gap-1.5">
                    <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                      <Link href={`/admin/cities/${city.id}/edit`}>
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                    </Button>
                    <ToggleButton
                      action={toggleCityStatus.bind(null, city.id)}
                      label={city.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                      active={city.status === "PUBLISHED"}
                    />
                    <DeleteButton action={deleteCity.bind(null, city.id)} />
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
