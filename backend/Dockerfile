# --- build stage: install all deps and compile ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
# Build and fail loudly if the entrypoint was emitted empty (e.g. stale cache).
RUN npm run build && test -s dist/main.js

# --- production stage: only prod deps + compiled output (no sources, no dev deps) ---
FROM node:20-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
CMD ["node", "dist/main"]
