FROM node:carbon
WORKDIR /usr/src/app
RUN npm install --save express mongoose body-parser redis
EXPOSE 3000
COPY realizar.js .
ENTRYPOINT chmod 777 -R /usr/src/app
ENTRYPOINT node realizar.js