# Use the official Node.js image
FROM node:20-slim AS base

ARG ARANGO_URL\
    ARANGO_USER \
    ARANGO_PASSWORD \
    ARANGO_DATABASE \
    FIREBASE_API_KEY \
    FIREBASE_AUTH_DOMAIN \
    PROJECT_ID \
    FIREBASE_STORAGE_BUCKET \
    FIREBASE_SENDER_ID \
    FIREBASE_APP_ID \
    FIREBASE_MEASUREMENT_ID \
    MINIO_PORT \
    MINIO_ACCESS_KEY \
    MINIO_SECRET_KEY \
    MINIO_ENDPOINT \
    MINIO_USE_SSL \
    ADMIN_PASSWORD \
    PORT \
    VERSION \
    SENDGRID_API_KEY \
    SENDGRID_INQUIRE_TEMPLATE_ID \
    ADMIN_UUID \
    ENV \
    EXPO_ACCESS_TOKEN


# Environment variables from .env
ENV ARANGO_URL=$ARANGO_URL \
    ARANGO_USER=$ARANGO_USER \
    ARANGO_PASSWORD=$ARANGO_PASSWORD \
    ARANGO_DATABASE=$ARANGO_DATABASE \
    FIREBASE_API_KEY=$FIREBASE_API_KEY \
    FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN \
    PROJECT_ID=$PROJECT_ID \
    FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET \
    FIREBASE_SENDER_ID=$FIREBASE_SENDER_ID \
    FIREBASE_APP_ID=$FIREBASE_APP_ID \
    FIREBASE_MEASUREMENT_ID=$FIREBASE_MEASUREMENT_ID \
    MINIO_PORT=$MINIO_PORT \
    MINIO_ACCESS_KEY=$MINIO_ACCESS_KEY \
    MINIO_SECRET_KEY=$MINIO_SECRET_KEY \
    MINIO_ENDPOINT=$MINIO_ENDPOINT \
    MINIO_USE_SSL=$MINIO_USE_SSL \
    ADMIN_PASSWORD=$ADMIN_PASSWORD \
    PORT=$PORT \
    VERSION=$VERSION \
    SENDGRID_API_KEY=$SENDGRID_API_KEY \
    SENDGRID_INQUIRE_TEMPLATE_ID=$SENDGRID_INQUIRE_TEMPLATE_ID \
    ADMIN_UUID=$ADMIN_UUID \
    ENV=$ENV \
    EXPO_ACCESS_TOKEN=$EXPO_ACCESS_TOKEN

RUN echo 'hey *******************************' $VERSION

FROM base as deps 
WORKDIR /app
# Copy over necessary files for installation
COPY ./pnpm-workspace.yaml .
COPY ./tsconfig.json .
COPY ./pnpm-lock.yaml .
COPY ./packages/graphserver ./packages/graphserver
COPY ./packages/darta-types ./packages/darta-types

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
COPY --from=deps /app/packages ./packages
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

# Start the app
CMD [ "pnpm", "start:prod" ]
