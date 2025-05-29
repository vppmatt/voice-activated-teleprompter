FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY build /var/www
