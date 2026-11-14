FROM node:26.13-alpine3.23@sha256:44a3247313f9bc069a4ec25d01b66254ed7dc4d0408727d8720dc827f0753423 AS builder

WORKDIR /app

# Suppress npm's "new major version available" notice — the node image pins npm
ENV NPM_CONFIG_UPDATE_NOTIFIER=false

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

ARG BUILD_VERSION=LOCAL
ENV BUILD_VERSION=$BUILD_VERSION

# Compile, then remove dev dependencies so the runtime stage copies only what it needs
RUN npx tsc && npm prune --omit=dev

# Production stage
FROM node:26.13-alpine3.23@sha256:44a3247313f9bc069a4ec25d01b66254ed7dc4d0408727d8720dc827f0753423

WORKDIR /app

COPY --from=builder --chown=node:node /app/build ./build
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./

RUN mkdir -p /app/build/server/logs && chown -R node:node /app/build/server/logs

ARG BUILD_VERSION=LOCAL
ENV NODE_ENV=production
ENV BUILD_VERSION=$BUILD_VERSION

USER node

EXPOSE 9500

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:9500/health || exit 1

CMD ["node", "build/server/gamenode/index.js"]
