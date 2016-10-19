FROM node:6-slim

RUN mkdir /opt/dasher
WORKDIR /opt/dasher

COPY package.json /opt/dasher/package.json
RUN npm install --loglevel warn

COPY . /opt/dasher

ENTRYPOINT ["node", "server/index.js"]