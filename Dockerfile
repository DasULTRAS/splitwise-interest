FROM node:20.14-bookworm-slim AS base

# Define the working directory
WORKDIR /app

#
# 1. Install dependencies and build the application
#
FROM base AS builder

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the source code
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs


# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size (needs standalone build in next.config.mjs)
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 80

ENV PORT=80
ENV HOSTNAME="0.0.0.0"

ENV TZ=Europe/Berlin

# set hostname to localhost
ENV DB_HOST="localhost"
ENV DB_PORT=27017
ENV DB_NAME="app"
ENV DB_USER="splitwise"
ENV DB_PASS="splitwise"

ENV NEXTAUTH_SECRET="secret"
ENV CRON_SECRET="cron"

CMD ["node", "server.js"]
