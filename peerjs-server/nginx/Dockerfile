FROM nginx:latest

RUN rm /etc/nginx/conf.d/default.conf

COPY /nginx/nginx.conf /etc/nginx/conf.d/
COPY /nginx/certificate.crt /etc/ssl/certificate.crt
COPY /nginx/private.key /etc/ssl/ssl.key

EXPOSE 80 
EXPOSE 443