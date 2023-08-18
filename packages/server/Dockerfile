# syntax=docker/dockerfile:1.4

FROM node:20-slim AS base
WORKDIR /app

# Define common dependencies stage
FROM base as deps

# Copy over the necessary files
COPY ./pnpm-workspace.yaml ./tsconfig.json ./pnpm-lock.yaml ./
COPY ./packages/server/package.json ./packages/server/package.json
COPY ./packages/graph/package.json ./packages/graph/package.json
COPY ./packages/server ./packages/server
COPY ./packages/graph ./packages/graph

# Define builder stage for graph package
FROM deps AS graph-builder
WORKDIR /app/packages/graph

RUN corepack enable && \
    corepack prepare pnpm@8.6.10 --activate && \
    pnpm install && \
    pnpm run build

# Define builder stage
FROM deps AS builder
WORKDIR /app/packages/server

# Install pnpm, dependencies, and build in a single layer
RUN corepack enable && \
    corepack prepare pnpm@8.6.10 --activate && \
    pnpm install && \
    pnpm run build

# Define runner stage
FROM base AS runner
ENV NODE_ENV production
WORKDIR /app

# Create a group and user
RUN addgroup --system --gid 1002 nodejs && \
    adduser --system --uid 1002 serveruser

# Copy necessary files from the builder stage
COPY --from=builder --chown=1002:1002 /app/packages/server/package.json ./package.json
COPY --from=builder --chown=1002:1002 /app/packages/server/dist ./dist
COPY --from=graph-builder --chown=1002:1002 /app/packages/graph/dist ./packages/graph/dist

# Install pnpm globally and prune the store
RUN npm install -g pnpm && \
    pnpm install --prod && \
    pnpm store prune

USER serveruser

# Define environment variables and expose the necessary port
EXPOSE 1160
ENV PORT 1160
ENV HOSTNAME localhost

CMD ["pnpm", "start:prod"]
