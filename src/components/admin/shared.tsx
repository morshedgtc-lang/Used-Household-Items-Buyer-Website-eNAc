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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: ContentStatus | string }) {
  const published = status === ContentStatus.PUBLISHED || status === "PUBLISHED";
  const draft = status === ContentStatus.DRAFT || status === "DRAFT";
  const archived = status === ContentStatus.ARCHIVED || status === "ARCHIVED";
  return (
    <Badge
      className={cn(
        "gap-1 font-medium",
        published && "border-emerald-200 bg-emerald-50 text-emerald-700",
        draft && "border-amber-200 bg-amber-50 text-amber-700",
        archived && "border-gray-200 bg-gray-50 text-gray-600",
        !published && !draft && !archived && "border-gray-200 bg-gray-50 text-gray-600",
      )}
    >
      <span className={cn(
        "h-1.5 w-1.5 rounded-full",
        published && "bg-emerald-500",
        draft && "bg-amber-500",
        archived && "bg-gray-400",
        !published && !draft && !archived && "bg-gray-400",
      )} />
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
    <div className="space-y-4 rounded-xl border border-border bg-white/80 p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className={cn(
          "flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold text-white",
          lang === "ar" ? "bg-blue-500" : "bg-emerald-500",
        )}>
          {lang.toUpperCase()}
        </span>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {lang === "ar" ? "العربية" : "English"}
        </p>
      </div>
      {children}
    </div>
  );
}

export function AdminTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
      </div>
    </div>
  );
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </thead>
  );
}

export function AdminTableRow({ children }: { children: React.ReactNode }) {
  return (
    <tr className="border-b border-border/40 last:border-0 transition-colors hover:bg-emerald-50/30">
      {children}
    </tr>
  );
}

export function AdminTableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("px-4 py-3.5 align-middle", className)}>{children}</td>;
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
    <div className="rounded-2xl border border-dashed border-border bg-white/60 p-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50">
        <svg className="h-7 w-7 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <p className="mt-4 text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}

export function FormActions({ cancelHref }: { cancelHref: string }) {
  return (
    <div className="flex flex-wrap gap-3 pt-4">
      <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-sm">
        Save
      </Button>
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
