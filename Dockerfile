FROM node:20-alpine

RUN apk add --no-cache bash

RUN corepack enable pnpm && corepack install -g pnpm@latest

WORKDIR /code

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 4000

CMD ["./start.sh"]
