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
    <div>
      <PageHeader
        title="Testimonials"
        description="Customer reviews shown on the homepage"
        action={
          <Button asChild>
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
                  <p className="font-semibold">{testimonial.name}</p>
                </AdminTableCell>
                <AdminTableCell>
                  <span className="text-amber-500">{"★".repeat(testimonial.rating)}</span>
                </AdminTableCell>
                <AdminTableCell className="max-w-xs">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {testimonial.messageEn}
                  </p>
                </AdminTableCell>
                <AdminTableCell>
                  <StatusBadge status={testimonial.status} />
                </AdminTableCell>
                <AdminTableCell>{testimonial.sortOrder}</AdminTableCell>
                <AdminTableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/testimonials/${testimonial.id}/edit`}>
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                    </Button>
                    <ToggleButton
                      action={async () => toggleTestimonialStatus(testimonial.id)}
                      label={
                        testimonial.status === "PUBLISHED" ? "Unpublish" : "Publish"
                      }
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
