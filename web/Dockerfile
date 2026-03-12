# Stage 1: build
FROM oven/bun:1-alpine AS builder

WORKDIR /usr/src/app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Stage 2: production runtime
FROM oven/bun:1-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 bunjs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /usr/src/app/public ./public
COPY --from=builder --chown=nextjs:bunjs /usr/src/app/.next/standalone ./
COPY --from=builder --chown=nextjs:bunjs /usr/src/app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["bun", "run", "server.js"]
