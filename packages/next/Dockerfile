# Step 1: Build the nextjs application

# We'll use a multi-stage build process. Starting with a Node.js image.
FROM node:20 as builder
WORKDIR /app

RUN corepack enable pnpm

# Copy over the necessary files
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ./packages/next/tsconfig.json ./packages/next/tsconfig.json 
COPY ./tsconfig.json ./tsconfig.json 
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./packages/next/package.json ./packages/next/package.json  
COPY ./packages/next ./packages/next
COPY ./packages/components ./packages/components

# Install all the dependencies
WORKDIR /app/packages/next
RUN apt-get update && apt-get install -y libc6
RUN corepack enable && corepack prepare pnpm@8.6.2 --activate
RUN pnpm install typescript @types/node
RUN pnpm install

# Build the nextjs application
RUN pnpm run build

# Remove dev dependencies
RUN pnpm prune --prod

# Step 2: Run the nextjs application
FROM node:20
WORKDIR /app

COPY --from=builder /app/packages/next ./

# Run the application
CMD [ "pnpm", "run", "start" ]