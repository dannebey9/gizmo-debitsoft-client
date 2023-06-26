FROM nginx:stable-alpine

RUN mkdir -p /var/www/html

RUN addgroup -g 1000 node && adduser -G node -g node -s /bin/sh -D node

RUN chown node:node /var/www/html


# RUN apk add --no-cache curl

# RUN mkdir /usr/local/sbin

# ADD ./nginx/default.conf /etc/nginx/sites-available/gizmo.debitsoft.ru.vhost
# ADD ./nginx/nginx.conf /etc/nginx/nginx.conf

# RUN wget https://raw.githubusercontent.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/master/install-ngxblocker -O /usr/local/sbin/install-ngxblocker
# RUN chmod +x /usr/local/sbin/install-ngxblocker

# RUN /usr/local/sbin/install-ngxblocker -x
# RUN chmod +x /usr/local/sbin/setup-ngxblocker
# RUN chmod +x /usr/local/sbin/update-ngxblocker
# RUN /usr/local/sbin/setup-ngxblocker -x


