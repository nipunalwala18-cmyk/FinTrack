#!/bin/sh
set -e
# Run Prisma migrations
npx prisma migrate deploy
# Start the NestJS application
exec node dist/server.js
