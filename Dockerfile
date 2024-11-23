FROM node:22.11.0-alpine AS base

# Only when needed, set ARG variables for build-time purposes or ENV variables for run-time purposes
# ARG HTTP_PROXY=
# ARG HTTPS_PROXY=
# ARG NO_PROXY=

# Install proxy cert if required to run behind a proxy
# ARG NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt
# COPY myCAcerts.pem /root/ca-certificates.crt
# RUN cat /root/ca-certificates.crt >> /etc/ssl/certs/ca-certificates.crt
# RUN apk --no-cache add ca-certificates && rm -rf /var/cache/apk/*
# COPY myCAcerts.pem /usr/local/share/ca-certificates/
# RUN update-ca-certificates
# RUN apk --no-cache add curl

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* .npmrc* ./
RUN \
  if [ -f package.json ]; then npm install; \
  else echo "package.json not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  if [ -f package.json ]; then npm run build; \
  else echo "package.json not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# EXPOSE 3000

# ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
