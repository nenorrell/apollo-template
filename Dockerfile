FROM node:14
EXPOSE 1337
RUN apt-get update && apt-get install -y \
    netcat

COPY ./dist /usr/src/app
COPY ./package*.json /usr/src/app/
COPY ./config.json /usr/src/app
COPY ./bin /entrypoint

WORKDIR /usr/src/app
RUN npm install 
RUN npm install pm2 -g

ENTRYPOINT /entrypoint/wait-for-it.sh token-store:3306 -- pm2-runtime config.json