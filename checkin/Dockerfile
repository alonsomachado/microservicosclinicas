FROM node:carbon
WORKDIR /usr/src/app
RUN npm install --save express mongoose body-parser redis
EXPOSE 3000
COPY checkin.js .
ENTRYPOINT chmod 777 -R /usr/src/app
ENTRYPOINT node checkin.js