import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

let supabaseAdmin: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }
  return supabaseAdmin;
}

export async function compressToWebp(buffer: Buffer, maxWidth = 1600): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
}

export async function uploadImage(
  file: Buffer,
  filename: string,
  folder = "uploads",
): Promise<string> {
  const webp = await compressToWebp(file);
  const path = `${folder}/${Date.now()}-${filename.replace(/\.[^.]+$/, "")}.webp`;
  const client = getSupabase();

  if (!client) {
    const base64 = `data:image/webp;base64,${webp.toString("base64")}`;
    logger.warn("Supabase not configured; returning data URL for local/dev upload");
    return base64;
  }

  const { error } = await client.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .upload(path, webp, { contentType: "image/webp", upsert: false });

  if (error) {
    logger.error("Upload failed", { error: error.message });
    throw new Error(error.message);
  }

  const { data } = client.storage.from(env.SUPABASE_STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
