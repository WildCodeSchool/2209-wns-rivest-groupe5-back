# Étape de construction
FROM node:lts-alpine AS builder

RUN apk --no-cache add curl
RUN apk add make g++ python3 git
RUN npm i -g node-pre-gyp

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src src
COPY .env ./

# Étape de production
FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app ./

CMD npm start
