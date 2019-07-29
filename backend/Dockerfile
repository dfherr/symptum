FROM node:12.4-alpine

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY package.json /usr/src/app/

RUN apk add --no-cache \
        python \
        make \
        g++ \
    && npm install

COPY . /usr/src/app

CMD [ "npm", "run", "dev" ]
