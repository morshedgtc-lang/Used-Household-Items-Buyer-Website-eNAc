# AGENTS.md

## Project Overview

Bilingual (AR/EN, RTL/LTR) Next.js 15 website for a used-furniture buying service in Tabuk, Saudi Arabia. Uses Prisma + PostgreSQL (Supabase), NextAuth 5 (credentials, single admin), next-intl, Tailwind CSS 4, Radix UI.

## Key Commands

```bash
npm run dev              # dev server (Turbopack)
npm run build            # production build (standalone output)
npm run start            # start production server
npm run db:push          # prisma db push (dev schema creation)
npm run db:migrate       # prisma migrate deploy (production schema)
npm run db:seed          # seed demo content + admin account
npm run lint             # eslint
```

**No tests exist** — `vitest` is a dev dependency but no test files are present.

## Architecture

- `src/app/` — Next.js App Router pages (locale-prefixed routes via `[locale]`)
- `src/components/` — shared UI components
- `src/i18n/` — next-intl routing and messages (`messages/ar.json`, `messages/en.json`)
- `src/lib/` — prisma client, auth config, env validation (Zod), supabase client, utilities
- `src/services/` — admin auth helpers, content retrieval
- `src/config/site.ts` — locale config (ar/en, default ar)
- `src/middleware.ts` — auth guard for `/admin/*`, i18n routing, security headers
- `prisma/schema.prisma` — full data model (Admin, Category, Item, ItemImage, ClickEvent, Setting, etc.)
- `prisma/migrations/0_init/` — initial migration

## Critical Environment Variables

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | **Must be Supabase Session pooler URL** (port 6543, `pgbouncer=true`). Not the direct PostgreSQL URL. |
| `AUTH_SECRET` | yes | `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | yes | Production domain |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | no | Only needed for admin image uploads |

**The Dockerfile sets placeholder `DATABASE_URL` during build. The real value must be injected at runtime via env vars.** If `DATABASE_URL` is missing at runtime, the app crashes with P1001 errors.

## Deployment

- **Dockerfile** uses `output: "standalone"` (Next.js standalone). Multi-stage build with `node:24-alpine`.
- **Railway**: New Project → Deploy from repo → auto-detects Dockerfile. Set env vars in Railway service settings. No `railway.toml` exists.
- **Render**: `render.yaml` is present (blueprint). Set env vars in service config.
- **Fly.io**: `fly launch` picks up the Dockerfile.

**Current production issue**: Railway deployment is CRASHED because `DATABASE_URL` is not set in the Railway environment. The `db-region-test.cjs` utility (untracked) can verify Supabase connectivity.

## Supabase Setup

1. Create project at supabase.com
2. Use **Session pooler** URL (port 6543) as `DATABASE_URL` — not the direct connection URL (port 5432)
3. Create a public storage bucket named `media` for admin image uploads
4. The `db-region-test.cjs` has hardcoded credentials for testing connectivity across regions

## Important Patterns

- **Prisma client**: Singleton pattern in `src/lib/prisma.ts` (globalThis caching for dev)
- **Env validation**: `src/lib/env.ts` uses Zod schema; throws in production if invalid, falls back to dev defaults in non-production
- **Auth**: NextAuth 5 with JWT strategy, 8h session, admin route guard in middleware
- **i18n**: `localePrefix: "always"` — all routes prefixed with `/ar/` or `/en/`
- **Security headers**: X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy restricts camera/mic/geolocation

## File Conventions

- `.env` is gitignored (has placeholder values)
- `.env.example` is the template for required env vars
- `render.yaml` and `Dockerfile` are the deployment configs
- `db-region-test.cjs` and `railway-status.json` are untracked utility/debug files