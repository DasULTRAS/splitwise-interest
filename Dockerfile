FROM node:21-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# RUN yarn build

# If using npm comment out above and use below instead
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Public folder not needed in NextJS 13
# COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cron-Job
# Installiere Cron und curl
RUN apk add --no-cache curl
# Cron-Job Skript
RUN echo '#!/bin/sh' >> crontab.sh \
    && echo 'curl -X GET http://localhost:80/api/friend/cron' >> crontab.sh \
    && chmod +x /app/crontab.sh \
    && echo $(crontab -l; echo "0 * * * * /app/cronjob.sh") | crontab -

USER nextjs

EXPOSE 80

ENV PORT 80
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"
ENV DB_HOST "localhost"
ENV DB_PORT 27017
ENV DB_NAME "app"
ENV DB_USER "splitwise"
ENV DB_PASS "splitwise"
ENV NEXTAUTH_SECRET "secret"

CMD ["node", "server.js"]
