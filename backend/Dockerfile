# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate

COPY tsconfig.json tsconfig.seed.json ./
COPY src ./src
RUN npm run build

# Also compile seed script so it can run without ts-node in production
RUN npx tsc --project tsconfig.seed.json

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma/data ./prisma/data
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Run as non-root for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 -G nodejs
USER nodejs

EXPOSE 5000

ENTRYPOINT ["./entrypoint.sh"]