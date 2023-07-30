# syntax=docker/dockerfile:1.4

FROM node:20-alpine AS base


FROM base as deps 
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy over the necessary files
COPY ./pnpm-workspace.yaml .
COPY ./tsconfig.json .
COPY ./pnpm-lock.yaml .
COPY ./packages/next ./packages/next
COPY ./packages/next/package.json ./packages/next/package.json
COPY ./packages/components/src ./packages/components/src
COPY ./packages/components/package.json ./packages/components/package.json

FROM deps AS builder

WORKDIR /app/packages/next

# Install pnpm, dependencies and build in one layer
RUN corepack enable && corepack prepare pnpm@8.6.2 --activate && \
    pnpm install && \
    pnpm run build && \
    pnpm prune --prod

FROM base AS runner

ENV NODE_ENV production

# Install pnpm in runner stage
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs 

COPY --from=builder --chown=1001:1001 /app/node_modules ./node_modules
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=1001:1001 /app/packages/next/.next/standalone ./
COPY --from=builder --chown=1001:1001 /app/packages/next/.next/static ./.next/static
COPY --from=builder --chown=1001:1001 /app/packages/next/public ./public

USER nextjs

EXPOSE 1169
ENV PORT 1169
ENV HOSTNAME localhost

CMD ["node", "./packages/next/server.js"]

