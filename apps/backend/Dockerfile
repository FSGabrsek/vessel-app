ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production 

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci --omit=dev

COPY dist/apps/backend/ .

EXPOSE 3000

CMD node main.js