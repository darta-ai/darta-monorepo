# Use the official Node.js image
FROM node:20-slim AS base
WORKDIR /app

FROM base as deps 
WORKDIR /app
# Copy over necessary files for installation
COPY ./pnpm-workspace.yaml .
COPY ./tsconfig.json .
COPY ./pnpm-lock.yaml .
COPY ./packages/graphserver ./packages/graphserver

FROM deps AS builder
WORKDIR /app/packages/graphserver
# Install pnpm, dependencies and build in a single layer
RUN corepack enable && \
    corepack prepare pnpm@8.6.2 --activate && \
    pnpm install && \
    pnpm run build

FROM base AS runner
ENV NODE_ENV production
WORKDIR /app
# Copy over necessary files for installation
COPY --from=deps /app/pnpm-lock.yaml .
COPY --from=deps /app/pnpm-workspace.yaml .
COPY --from=deps /app/packages/graphserver/package.json ./package.json
COPY --from=builder /app/packages/graphserver/dist ./dist

# Create user
RUN addgroup --system nodejs && \
    adduser --system nodejs

# Install production dependencies
RUN npm install -g pnpm && \
    pnpm install --prod && \
    pnpm store prune

# Expose the port that your app runs on
EXPOSE 1160
ENV PORT 1160
ENV HOSTNAME localhost
# Start the app
CMD [ "pnpm", "start:prod" ]
