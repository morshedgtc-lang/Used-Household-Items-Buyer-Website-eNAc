# Used Household Items Buyer Website

Bilingual (AR/EN, RTL/LTR) website for a used-furniture buying service in Tabuk, Saudi Arabia. Built with Next.js 15, Prisma, PostgreSQL (Supabase), and next-intl.

## Features

- Public site: home, categories, item pages, about, how it works, FAQ, contact, privacy, terms
- Instant search across items/categories
- WhatsApp / call conversion buttons with click tracking
- Admin panel at `/admin`: dashboard, categories, items, cities, FAQs, testimonials, homepage editor, SEO editor, backup/restore
- Arabic-first with full English support

## Tech Stack

- Next.js 15 (App Router, Turbopack, standalone output)
- Prisma 5 + PostgreSQL
- NextAuth 5 (credentials, single admin)
- Supabase Storage (admin image uploads; falls back to data URLs in dev)
- next-intl, Tailwind CSS 4, Radix UI, shadcn-style components

## Local Development

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL etc.
npm run db:push        # create schema in your DB
npm run db:seed        # load demo content + admin account
npm run dev
```

Open http://localhost:3000. Admin: http://localhost:3000/admin (login with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string (Supabase Session pooler URL) |
| `AUTH_SECRET` | yes | `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | yes | Production URL (canonical links, sitemap, OG tags) |
| `SUPABASE_URL` | no | Supabase project URL (image uploads) |
| `SUPABASE_SERVICE_ROLE_KEY` | no | Supabase service role key |
| `SUPABASE_STORAGE_BUCKET` | no | Storage bucket name (default `media`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | no | Initial admin account for `npm run db:seed` |

## Deployment

### 1. Create the database (Supabase)

1. Create a free project at [supabase.com](https://supabase.com)
2. Settings → Database → Connection string → copy the **Session pooler** URL (includes `pgbouncer=true` / port 6543). This is `DATABASE_URL`.
3. Create a public storage bucket named `media` (Storage → New bucket → public) if you want admin image uploads.

### 2. Apply schema and seed

From a terminal on your machine, after setting `DATABASE_URL` in `.env`:

```bash
npm run db:migrate   # applies prisma/migrations (creates all tables)
npm run db:seed      # demo categories/items + admin account
```

Or point at your remote DB directly:

```bash
DATABASE_URL="postgresql://..." npx prisma migrate deploy
DATABASE_URL="postgresql://..." npx prisma db seed
```

### 3. Deploy

The repo ships a `Dockerfile` (Next.js standalone output) that works on **Railway**, **Render**, or **Fly.io**.

**Render** (blueprint included): push the repo to GitHub, then New → Blueprint → select repo (`render.yaml` is auto-detected). Set the required env vars in the service, deploy.

**Railway**: New Project → Deploy from repo → Railway auto-detects the Dockerfile. Set env vars in the service settings, deploy.

**Fly.io**:

```bash
fly launch            # picks up the Dockerfile
fly secrets set DATABASE_URL="..." AUTH_SECRET="..." NEXT_PUBLIC_SITE_URL="https://..." SUPABASE_URL="..." SUPABASE_SERVICE_ROLE_KEY="..."
fly deploy
```

Build arg `NEXT_PUBLIC_SITE_URL` is used at build time; set it in your platform's build env if your runtime env isn't available during build.

After the first deploy, open `/admin` and sign in with the seeded admin credentials. Change `ADMIN_PASSWORD` / `ADMIN_EMAIL` via a re-seed or by editing the `Admin` row in Supabase.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Apply migrations (`prisma migrate deploy`) |
| `npm run db:push` | Push schema without migrations |
| `npm run db:seed` | Seed demo content |
| `npm run db:studio` | Prisma Studio |
