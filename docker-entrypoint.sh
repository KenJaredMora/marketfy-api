#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy

# Run seed if RUN_SEED environment variable is set
if [ "$RUN_SEED" = "true" ]; then
  echo "Running database seed..."
  npm run seed
  echo "Database seed completed!"
fi

echo "Starting Marketfy API..."
exec node dist/src/main.js
