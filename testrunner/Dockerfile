FROM node:lts-alpine

RUN mkdir app
WORKDIR /app

COPY package.json ./
COPY jest.config.js ./
COPY setupTests.ts ./
RUN npm install

COPY tsconfig.json ./
COPY ./src ./src

CMD npm run test