FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY dist/apps/frontend/ /usr/share/nginx/html

COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]