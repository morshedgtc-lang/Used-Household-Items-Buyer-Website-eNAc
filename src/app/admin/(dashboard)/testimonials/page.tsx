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
import {
  deleteTestimonial,
  toggleTestimonialStatus,
} from "@/features/admin/testimonials/actions";

export default async function AdminTestimonialsPage() {
  await requireAdmin();
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        description="Customer reviews shown on the homepage"
        action={
          <Button asChild className="gap-1.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-sm">
            <Link href="/admin/testimonials/new">
              <Plus className="h-4 w-4" />
              New Testimonial
            </Link>
          </Button>
        }
      />

      {testimonials.length === 0 ? (
        <EmptyState message="No testimonials yet. Add your first customer review." />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell>Name</AdminTableHeaderCell>
              <AdminTableHeaderCell>Rating</AdminTableHeaderCell>
              <AdminTableHeaderCell>Message</AdminTableHeaderCell>
              <AdminTableHeaderCell>Status</AdminTableHeaderCell>
              <AdminTableHeaderCell>Order</AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-right">Actions</AdminTableHeaderCell>
            </tr>
          </AdminTableHead>
          <tbody>
            {testimonials.map((testimonial) => (
              <AdminTableRow key={testimonial.id}>
                <AdminTableCell>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500">{"★".repeat(testimonial.rating)}</span>
                    <span className="text-xs text-muted-foreground">{testimonial.rating}/5</span>
                  </div>
                </AdminTableCell>
                <AdminTableCell className="max-w-xs">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {testimonial.messageEn}
                  </p>
                </AdminTableCell>
                <AdminTableCell>
                  <StatusBadge status={testimonial.status} />
                </AdminTableCell>
                <AdminTableCell>
                  <span className="text-muted-foreground">{testimonial.sortOrder}</span>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex items-center justify-end gap-1.5">
                    <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                      <Link href={`/admin/testimonials/${testimonial.id}/edit`}>
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                    </Button>
                    <ToggleButton
                      action={async () => toggleTestimonialStatus(testimonial.id)}
                      label={testimonial.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                      active={testimonial.status === "PUBLISHED"}
                    />
                    <DeleteButton action={async () => deleteTestimonial(testimonial.id)} />
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
