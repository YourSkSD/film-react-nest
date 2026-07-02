FROM node:20-alpine AS builder
WORKDIR /app

# Vite inlines VITE_* at build time, so they must be available before `npm run build`.
ARG VITE_BASE_URL=/
ARG VITE_API_URL=/api/afisha
ARG VITE_CDN_URL=/content/afisha
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CDN_URL=$VITE_CDN_URL

COPY package*.json ./
RUN npm ci

COPY . .
# Fail the build if the HTML entry was emitted empty (e.g. stale cache).
RUN npm run build && test -s dist/index.html
