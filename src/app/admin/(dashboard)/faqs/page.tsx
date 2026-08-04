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
import { deleteFaq, toggleFaqStatus } from "@/features/admin/faqs/actions";

export default async function AdminFaqsPage() {
  await requireAdmin();
  const faqs = await prisma.faq.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <PageHeader
        title="FAQs"
        description="Frequently asked questions shown on the homepage and FAQ page"
        action={
          <Button asChild>
            <Link href="/admin/faqs/new">
              <Plus className="h-4 w-4" />
              New FAQ
            </Link>
          </Button>
        }
      />

      {faqs.length === 0 ? (
        <EmptyState message="No FAQs yet. Add common questions customers ask." />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell>Question</AdminTableHeaderCell>
              <AdminTableHeaderCell>Answer</AdminTableHeaderCell>
              <AdminTableHeaderCell>Status</AdminTableHeaderCell>
              <AdminTableHeaderCell>Order</AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-right">Actions</AdminTableHeaderCell>
            </tr>
          </AdminTableHead>
          <tbody>
            {faqs.map((faq) => (
              <AdminTableRow key={faq.id}>
                <AdminTableCell className="max-w-xs">
                  <p className="font-semibold">{faq.questionEn}</p>
                  <p className="text-xs text-muted-foreground" dir="rtl">
                    {faq.questionAr}
                  </p>
                </AdminTableCell>
                <AdminTableCell className="max-w-sm">
                  <p className="line-clamp-2 text-sm text-muted-foreground">{faq.answerEn}</p>
                </AdminTableCell>
                <AdminTableCell>
                  <StatusBadge status={faq.status} />
                </AdminTableCell>
                <AdminTableCell>{faq.sortOrder}</AdminTableCell>
                <AdminTableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/faqs/${faq.id}/edit`}>
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                    </Button>
                    <ToggleButton
                      action={async () => toggleFaqStatus(faq.id)}
                      label={faq.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                      active={faq.status === "PUBLISHED"}
                    />
                    <DeleteButton action={async () => deleteFaq(faq.id)} />
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
