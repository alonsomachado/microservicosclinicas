FROM node:carbon
WORKDIR /usr/src/app
RUN npm install --save express mongoose body-parser redis
COPY agendamentos.js .
COPY agendamento_model.js .
ENTRYPOINT chmod 777 -R /usr/src/app
ENTRYPOINT node agendamentos.js