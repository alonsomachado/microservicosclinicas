FROM node:carbon
WORKDIR /usr/src/app
RUN npm install --save express body-parser redis
COPY agendamento.js .
ENTRYPOINT chmod 777 -R /usr/src/app
ENTRYPOINT node agendamento.js