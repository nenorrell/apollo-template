FROM node:14
EXPOSE 3030
RUN apt-get update && apt-get install -y \
    netcat

RUN npm install pm2 -g
COPY . /usr/src/app
WORKDIR /usr/src/app
ENTRYPOINT pm2-runtime config.json