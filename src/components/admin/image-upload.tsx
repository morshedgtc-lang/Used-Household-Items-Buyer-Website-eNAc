"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ImageEntry = { url: string; altAr: string; altEn: string };

export function ImageUploadField({
  name,
  label,
  defaultValue = "",
  folder = "uploads",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  folder?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input type="hidden" name={name} value={url} />
      <div className="flex flex-wrap items-center gap-3">
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="max-w-xs"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
          }}
        />
        {uploading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : null}
      </div>
      {url ? (
        <div className="relative mt-2 inline-block">
          <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-border">
            <Image src={url} alt="" fill className="object-cover" unoptimized={url.startsWith("data:")} />
          </div>
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

export function MultiImageUpload({
  name,
  defaultImages = [],
}: {
  name: string;
  defaultImages?: ImageEntry[];
}) {
  const [images, setImages] = useState<ImageEntry[]>(defaultImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(file: File) {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "items");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setImages((prev) => [...prev, { url: data.url, altAr: "", altEn: "" }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function updateAlt(index: number, field: "altAr" | "altEn", value: string) {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, [field]: value } : img)),
    );
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(images)} />
      <div className="flex items-center gap-3">
        <Input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            files.forEach((file) => void handleUpload(file));
            e.target.value = "";
          }}
        />
        {uploading ? (
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
          </span>
        ) : (
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Upload className="h-4 w-4" /> Add images
          </span>
        )}
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {images.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {images.map((img, index) => (
            <div key={`${img.url}-${index}`} className="rounded-xl border border-border p-3">
              <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg">
                <Image src={img.url} alt="" fill className="object-cover" unoptimized={img.url.startsWith("data:")} />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input
                  placeholder="Alt AR"
                  value={img.altAr}
                  onChange={(e) => updateAlt(index, "altAr", e.target.value)}
                />
                <Input
                  placeholder="Alt EN"
                  value={img.altEn}
                  onChange={(e) => updateAlt(index, "altEn", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
