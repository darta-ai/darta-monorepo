# syntax=docker/dockerfile:1.4

FROM node:18 AS base

FROM base as deps 
WORKDIR /app

# Copy over the necessary files
COPY ./pnpm-workspace.yaml .
COPY ./tsconfig.json .
COPY ./pnpm-lock.yaml .
COPY ./packages/next ./packages/next
COPY ./packages/darta-types ./packages/darta-types
COPY ./.eslintrc.json ./.eslintrc.json
COPY ./packages/next/package.json ./packages/next/package.json
COPY ./packages/components/src ./packages/components/src
COPY ./packages/components/package.json ./packages/components/package.json

FROM deps AS builder
WORKDIR /app/packages/next
ENV NEXT_BUILD_ENV_TYPECHECK=false
ENV NEXT_BUILD_ENV_LINT=false
ENV NEXT_BUILD_ENV_OUTPUT=standalone
ENV NEXT_BUILD_ENV_SENTRY_ENABLED=false
ENV NEXT_BUILD_ENV_SENTRY_TRACING=false

# Install pnpm, dependencies and build in multiple layers
RUN corepack enable
RUN corepack prepare pnpm@8.6.2 --activate
RUN CYPRESS_INSTALL_BINARY=0 pnpm install
RUN pnpm run build

FROM base AS runner

ENV NODE_ENV production
WORKDIR /app

RUN \
  addgroup --system --gid 1001 nodejs; \
  adduser --system --uid 1001 nextjs

COPY --from=builder --link /app/packages/next/package.json ./

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder --chown=1001:1001 /app/packages/next/next.config.js ./
COPY --from=builder --chown=1001:1001 /app/packages/next/.next/standalone ./
COPY --from=builder --chown=1001:1001 /app/packages/next/.next/static ./packages/next/.next/static
COPY --from=builder --chown=1001:1001 /app/packages/next/public ./packages/next/public

USER nextjs

EXPOSE 1169
ENV PORT 1169
ENV HOSTNAME "0.0.0.0"

CMD ["node", "./packages/next/server.js"]
