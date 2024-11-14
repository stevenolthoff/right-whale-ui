# Install dependencies only when needed
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# TODO: Maybe revisit this, as we probably shouldn't be relying on
# legacy-peer-deps
RUN npm ci

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
RUN ls -als
# RUN apk --no-cache add curl
WORKDIR /app
COPY package.json package-lock.json ./
COPY public  public
COPY src  src
COPY .eslintrc.json tailwind.config.js postcss.config.mjs tsconfig.json ./
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production image, copy all the files and run craco
FROM nginx:1.25.1 AS nginx
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/build/ /usr/share/nginx/html

COPY ./docker/nginx/conf.d/* /etc/nginx/conf.d/

EXPOSE 80
