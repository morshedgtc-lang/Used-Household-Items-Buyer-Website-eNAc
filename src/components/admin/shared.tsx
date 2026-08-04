import Link from "next/link";
import { ContentStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: ContentStatus | string }) {
  const published = status === ContentStatus.PUBLISHED || status === "PUBLISHED";
  const draft = status === ContentStatus.DRAFT || status === "DRAFT";
  return (
    <Badge
      className={cn(
        published && "border-green-200 bg-green-50 text-green-700",
        draft && "border-amber-200 bg-amber-50 text-amber-700",
        !published && !draft && "border-gray-200 bg-gray-50 text-gray-600",
      )}
    >
      {String(status)}
    </Badge>
  );
}

export function BilingualGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("grid gap-4 md:grid-cols-2", className)}>{children}</div>;
}

export function LangColumn({
  lang,
  children,
}: {
  lang: "ar" | "en";
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-background/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        {lang === "ar" ? "العربية" : "English"}
      </p>
      {children}
    </div>
  );
}

export function AdminTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white/80 shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
      </div>
    </div>
  );
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
      {children}
    </thead>
  );
}

export function AdminTableRow({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-border/60 last:border-0 hover:bg-muted/20">{children}</tr>;
}

export function AdminTableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("px-4 py-3 align-middle", className)}>{children}</td>;
}

export function AdminTableHeaderCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <th className={cn("px-4 py-3 font-semibold", className)}>{children}</th>;
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-white/50 p-12 text-center text-muted-foreground">
      {message}
    </div>
  );
}

export function FormActions({ cancelHref }: { cancelHref: string }) {
  return (
    <div className="flex flex-wrap gap-3 pt-4">
      <Button type="submit">Save</Button>
      <Button type="button" variant="outline" asChild>
        <Link href={cancelHref}>Cancel</Link>
      </Button>
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}
