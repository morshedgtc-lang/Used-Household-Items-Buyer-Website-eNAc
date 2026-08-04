import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function Field({
  label,
  htmlFor,
  required,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function TextInput({
  label,
  name,
  required,
  defaultValue = "",
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string | null;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <Field label={label} htmlFor={name} required={required} hint={hint}>
      <Input
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="h-11 rounded-xl border-border/60 bg-white focus-visible:ring-emerald-500/20 focus-visible:border-emerald-400"
      />
    </Field>
  );
}

export function TextAreaInput({
  label,
  name,
  required,
  defaultValue = "",
  placeholder,
  rows,
  hint,
}: {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string | null;
  placeholder?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <Field label={label} htmlFor={name} required={required} hint={hint}>
      <Textarea
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        rows={rows}
        className="rounded-xl border-border/60 bg-white focus-visible:ring-emerald-500/20 focus-visible:border-emerald-400"
      />
    </Field>
  );
}

export function StatusSelect({
  defaultValue = "PUBLISHED",
}: {
  defaultValue?: string;
}) {
  const options = [
    { value: "PUBLISHED", label: "Published", dot: "bg-emerald-500" },
    { value: "DRAFT", label: "Draft", dot: "bg-amber-500" },
    { value: "ARCHIVED", label: "Archived", dot: "bg-gray-400" },
  ];
  return (
    <Field label="Status" htmlFor="status" required>
      <select
        id="status"
        name="status"
        defaultValue={defaultValue}
        className="h-11 w-full rounded-xl border border-border/60 bg-white px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function NumberInput({
  label,
  name,
  defaultValue = "0",
  min,
  max,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  min?: number;
  max?: number;
  hint?: string;
}) {
  return (
    <Field label={label} htmlFor={name} hint={hint}>
      <Input
        id={name}
        name={name}
        type="number"
        min={min}
        max={max}
        defaultValue={defaultValue}
        className="h-11 rounded-xl border-border/60 bg-white focus-visible:ring-emerald-500/20 focus-visible:border-emerald-400"
      />
    </Field>
  );
}

export function CheckboxInput({
  label,
  name,
  defaultChecked = false,
  hint,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/60 bg-white p-4 transition-colors hover:bg-emerald-50/30">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 rounded border-border text-emerald-500 focus-visible:ring-emerald-500/20"
      />
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
      </span>
    </label>
  );
}
