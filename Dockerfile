FROM node:12-alpine
ENV PORT=8080
WORKDIR /opt/app
# Extras:
RUN apk --update add make python gcc g++ libtool git autoconf automake

# Globally installed NPMs:
RUN npm install -g pm2
RUN npm install -g pac

# ensure support for node-canvas
RUN apk add --no-cache \
  build-base \
  g++ \
  cairo-dev \
  jpeg-dev \
  pango-dev \
  giflib-dev

RUN apk add --update  --repository http://dl-3.alpinelinux.org/alpine/edge/testing libmount ttf-dejavu ttf-droid ttf-freefont ttf-liberation ttf-ubuntu-font-family fontconfig

RUN echo 'set -e' > /boot.sh # this is the script which will run on start

RUN echo 'nb=`cat package.json | grep start | wc -l` && if test "$nb" = "0" ; then echo "*** Boot issue: No start command found in your package.json in the scripts. See https://docs.npmjs.com/cli/start" ; exit 1 ; fi' >> /boot.sh

RUN echo 'crond' >> /boot.sh

RUN mkdir -p logs

# check install
RUN echo 'yarn' >> /boot.sh
WORKDIR /opt/app

CMD sh /boot.sh && pm2-runtime --output logs/out.log --error logs/error.log start yarn run start