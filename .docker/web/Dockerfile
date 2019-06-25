FROM nginx:1.15.6

# Fix settings.
ARG  DOMAIN
ARG  CREDENTIAL
COPY ./default.conf /etc/nginx/conf.d/default.conf
RUN  sed -e "s/DOMAIN/${DOMAIN}/g" -i /etc/nginx/conf.d/default.conf
RUN  sed -e "s/CREDENTIAL/${CREDENTIAL}/g" -i /etc/nginx/conf.d/default.conf
RUN  cat /etc/nginx/conf.d/default.conf

# Run web server.
CMD nginx -g "daemon off;"
