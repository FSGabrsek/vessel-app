ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /usr/src/app

ENV PATH /usr/src/node_modules/.bin:$PATH

COPY ./apps/ ./apps

COPY ./libs/ ./libs

COPY package*.json .

COPY nx.json .

COPY tsconfig.base.json .

RUN npm ci

FROM build AS prod-build 

WORKDIR /usr/src/app

RUN npx nx run backend:build --disableNxCache --disableRemoteCache

FROM node:${NODE_VERSION}-alpine AS prod

WORKDIR /usr/src/app

COPY package*.json .

COPY --from=prod-build /usr/src/app/dist/apps/backend/ .

RUN npm ci --omit=dev

EXPOSE 3000

CMD node main.js