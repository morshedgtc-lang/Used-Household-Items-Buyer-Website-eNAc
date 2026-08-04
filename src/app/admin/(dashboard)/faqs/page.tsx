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
    <div className="space-y-6">
      <PageHeader
        title="FAQs"
        description="Frequently asked questions shown on the homepage and FAQ page"
        action={
          <Button asChild className="gap-1.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-sm">
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
                  <p className="font-semibold text-foreground">{faq.questionEn}</p>
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
                <AdminTableCell>
                  <span className="text-muted-foreground">{faq.sortOrder}</span>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex items-center justify-end gap-1.5">
                    <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
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
