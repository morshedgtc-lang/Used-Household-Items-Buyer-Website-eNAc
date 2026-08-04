"use client";

import { useTransition } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, GripVertical } from "lucide-react";
import { useState } from "react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/services/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  createHeroImage,
  deleteHeroImage,
  toggleHeroImageStatus,
} from "@/features/admin/hero-images/actions";

export const dynamic = "force-dynamic";

function AddImageForm() {
  const [pending, startTransition] = useTransition();
  const [url, setUrl] = useState("");
  const [altAr, setAltAr] = useState("");
  const [altEn, setAltEn] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await createHeroImage(formData);
          setUrl("");
          setAltAr("");
          setAltEn("");
          setSortOrder("0");
        });
      }}
      className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm"
    >
      <p className="mb-4 text-sm font-semibold text-foreground">Add New Hero Image</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="url">Image URL</Label>
          <Input
            id="url"
            name="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/images/hero.svg or https://..."
            className="h-11 rounded-xl border-border/60 bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            name="sortOrder"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="h-11 rounded-xl border-border/60 bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="altAr">Alt Text (AR)</Label>
          <Input
            id="altAr"
            name="altAr"
            value={altAr}
            onChange={(e) => setAltAr(e.target.value)}
            placeholder="صورة البانر"
            className="h-11 rounded-xl border-border/60 bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="altEn">Alt Text (EN)</Label>
          <Input
            id="altEn"
            name="altEn"
            value={altEn}
            onChange={(e) => setAltEn(e.target.value)}
            placeholder="Hero banner image"
            className="h-11 rounded-xl border-border/60 bg-white"
          />
        </div>
      </div>
      <div className="mt-4">
        {url && (
          <div className="relative mb-4 h-32 w-56 overflow-hidden rounded-xl border border-border/60 bg-muted/20">
            <Image src={url} alt="Preview" fill className="object-cover" unoptimized />
          </div>
        )}
        <Button type="submit" disabled={pending} className="gap-1.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-sm">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {pending ? "Adding..." : "Add Image"}
        </Button>
      </div>
    </form>
  );
}

export default async function AdminHeroImagesPage() {
  await requireAdmin();
  const images = await prisma.heroImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hero Images"
        description="Manage the rotating background images on the homepage hero section"
      />

      <AddImageForm />

      {images.length === 0 ? (
        <EmptyState message="No hero images yet. Add your first image above." />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <tr>
              <AdminTableHeaderCell>Order</AdminTableHeaderCell>
              <AdminTableHeaderCell>Image</AdminTableHeaderCell>
              <AdminTableHeaderCell>Alt Text</AdminTableHeaderCell>
              <AdminTableHeaderCell>Status</AdminTableHeaderCell>
              <AdminTableHeaderCell className="text-right">Actions</AdminTableHeaderCell>
            </tr>
          </AdminTableHead>
          <tbody>
            {images.map((image) => (
              <AdminTableRow key={image.id}>
                <AdminTableCell>
                  <span className="text-muted-foreground">{image.sortOrder}</span>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="relative h-16 w-28 overflow-hidden rounded-lg border border-border/60 bg-muted/20">
                    <Image
                      src={image.url}
                      alt={image.altEn || image.altAr}
                      fill
                      className="object-cover"
                      unoptimized={image.url.startsWith("data:")}
                    />
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <p className="text-sm">{image.altEn || "—"}</p>
                  <p className="text-xs text-muted-foreground" dir="rtl">{image.altAr || "—"}</p>
                </AdminTableCell>
                <AdminTableCell>
                  <StatusBadge status={image.status} />
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex items-center justify-end gap-1.5">
                    <ToggleButton
                      action={toggleHeroImageStatus.bind(null, image.id)}
                      label={image.status === "PUBLISHED" ? "Hide" : "Show"}
                      active={image.status === "PUBLISHED"}
                    />
                    <DeleteButton action={deleteHeroImage.bind(null, image.id)} />
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
