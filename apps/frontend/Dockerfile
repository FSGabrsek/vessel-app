ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /usr/src/app

ENV PATH /usr/src/node_modules/.bin:$PATH

COPY ./apps .

COPY package*.json .

COPY nx.json .

COPY tsconfig.base.json .

RUN npm ci

FROM build AS prod-build 

WORKDIR /usr/src/app

ARG BACKEND_URL=/api

ENV VITE_API_URL=${BACKEND_URL}

RUN echo "Building with API URL: $VITE_API_URL" \
    && VITE_API_URL=$VITE_API_URL npx nx run frontend:build --disableNxCache --disableRemoteCache

FROM nginx:latest AS prod

RUN rm -rf /usr/share/nginx/html/*

COPY --from=prod-build /usr/src/dist/apps/frontend/ /usr/share/nginx/html

COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]