#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Seeding database (skips existing data)..."
node dist/prisma/seed.js

echo "Starting server..."
exec node dist/server.js
