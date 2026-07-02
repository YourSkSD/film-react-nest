FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
# Build and fail loudly if the entrypoint was emitted empty (e.g. stale cache).
RUN npm run build && test -s dist/main.js

CMD ["npm", "run", "start:prod"]
