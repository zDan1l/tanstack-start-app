FROM node:24-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && \
    pnpm install --frozen-lockfile

COPY ./ ./

RUN pnpm dlx prisma generate && pnpm run build

EXPOSE 3000

CMD ["sh", "-c", "pnpm dlx prisma db push && pnpm start"]