FROM node:14
EXPOSE 1337
RUN apt-get update && apt-get install -y \
    netcat

RUN npm install pm2 -g
COPY ./build /usr/src/app/build
COPY ./config.json /usr/src/app
WORKDIR /usr/src/app
ENTRYPOINT pm2-runtime config.json