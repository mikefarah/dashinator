FROM node:6-slim

RUN mkdir /opt/dashinator
WORKDIR /opt/dashinator

COPY package.json /opt/dashinator/package.json
RUN npm install --loglevel warn

COPY . /opt/dashinator

RUN ./node_modules/.bin/webpack --config webpack.prod.config.js

ENV NODE_ENV production

ENTRYPOINT ["node", "server/index.js"]