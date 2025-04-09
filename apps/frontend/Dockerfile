ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production 

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci --omit=dev

COPY dist/apps/frontend/ .

EXPOSE 4200

CMD node main.js