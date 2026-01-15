FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Install build dependencies for native modules
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python3 \
        make \
        g++ \
        libzmq3-dev \
        git \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p server/logs && npx tsc

# Production stage
FROM node:22-bookworm-slim

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libzmq5 \
        tini \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Create logs directory and set ownership for node user
RUN mkdir -p /app/build/server/logs && chown -R node:node /app/build/server/logs

ENV NODE_ENV=production

USER node

EXPOSE 9500

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:9500/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))" || exit 1

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "build/server/gamenode/index.js"]
