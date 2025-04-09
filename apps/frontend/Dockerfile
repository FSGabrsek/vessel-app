FROM FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

WORKDIR /usr/src/app

COPY dist/apps/frontend/ .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]