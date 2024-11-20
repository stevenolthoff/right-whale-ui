# Install dependencies only when needed
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# TODO: Maybe revisit this, as we probably shouldn't be relying on
# legacy-peer-deps
RUN npm ci --force

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
RUN ls -als
# RUN apk --no-cache add curl
WORKDIR /app
COPY public  public
COPY src  src
COPY .eslintrc.json tailwind.config.ts next.config.ts postcss.config.mjs tsconfig.json ./
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# FROM node:14-alpine AS runner
# WORKDIR /app

# ENV NODE_ENV production

# COPY --from=builder /app/next.config.ts ./
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json

# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nextjs -u 1001
# RUN chown -R nextjs:nodejs /app/.next
# USER nextjs

# EXPOSE 3000

# RUN npx next telemetry disable

# CMD ["npm", "start"]

# Production image, copy all the files and run craco
FROM nginx:1.25.1 AS nginx
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/out/ /usr/share/nginx/html

COPY ./docker/nginx/conf.d/* /etc/nginx/conf.d/

EXPOSE 80
