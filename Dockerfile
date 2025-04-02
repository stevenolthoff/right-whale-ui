# Install dependencies only when needed
FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lockb ./
COPY public  public
COPY src  src
COPY .eslintrc.json tailwind.config.ts next.config.ts postcss.config.mjs tsconfig.json ./
COPY --from=deps /app/node_modules ./node_modules
RUN bun run build

# Production image, copy all the files and run nginx
FROM nginx:1.25.1 AS nginx
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/out/ /usr/share/nginx/html

COPY ./docker/nginx/conf.d/* /etc/nginx/conf.d/

EXPOSE 80
