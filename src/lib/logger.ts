type LogLevel = "info" | "warn" | "error";

function sanitize(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "function") return "[Function]";
  if (typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    result[k] = sanitize(v);
  }
  return result;
}

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const entry = {
    level,
    message,
    time: new Date().toISOString(),
    ...(meta ? (sanitize(meta) as Record<string, unknown>) : {}),
  };

  if (level === "error") {
    console.error(JSON.stringify(entry));
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    if (level === "warn") console.warn(JSON.stringify(entry));
    else console.info(JSON.stringify(entry));
  }
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => log("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log("error", message, meta),
};
