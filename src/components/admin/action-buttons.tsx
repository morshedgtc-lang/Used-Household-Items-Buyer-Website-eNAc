"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DeleteButton({
  action,
  label = "Delete",
}: {
  action: () => Promise<void>;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Are you sure you want to ${label.toLowerCase()}?`)) return;
        startTransition(async () => {
          await action();
        });
      }}
      className="gap-1.5"
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      {pending ? "..." : label}
    </Button>
  );
}

export function ToggleButton({
  action,
  label,
  active,
}: {
  action: () => Promise<void>;
  label: string;
  active?: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="sm"
      disabled={pending}
      onClick={() => startTransition(async () => action())}
      className={cn(
        "gap-1.5",
        active && "bg-emerald-500 hover:bg-emerald-600",
      )}
    >
      {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {pending ? "..." : label}
    </Button>
  );
}
