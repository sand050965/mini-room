FROM nginx:latest

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/
COPY certificate.crt /etc/ssl/certificate.crt
COPY private.key /etc/ssl/ssl.key

EXPOSE 80 
EXPOSE 443