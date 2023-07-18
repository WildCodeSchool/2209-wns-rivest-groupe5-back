# Étape de construction
FROM node:lts-alpine AS builder

RUN apk --no-cache add curl make g++ python3 git && \
    npm i -g node-pre-gyp && \
    mkdir /app

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src src

# Étape de production
FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app ./

CMD npm start
