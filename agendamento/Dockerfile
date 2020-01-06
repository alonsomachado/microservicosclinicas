FROM node:carbon
WORKDIR /usr/src/app
RUN npm install --save express mongoose
EXPOSE 3000
COPY agendamentos.js .
COPY agendamento.js .
ENTRYPOINT chmod 777 -R /usr/src/app
ENTRYPOINT node agendamentos.js