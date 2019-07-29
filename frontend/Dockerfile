FROM node:12.4-alpine

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN npm install -g serve

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

RUN npm run build

CMD [ "npm", "start" ]
