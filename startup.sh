#!/bin/sh
set -e

echo "[startup] Running Prisma migrate deploy..."
node node_modules/prisma/build/index.js migrate deploy --schema prisma/schema.prisma

echo "[startup] Running database seed..."
node node_modules/tsx/dist/cli.mjs prisma/seed.ts

echo "[startup] Starting server..."
exec node server.js
