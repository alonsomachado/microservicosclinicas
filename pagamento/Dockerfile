FROM node:carbon
WORKDIR /usr/src/app
RUN npm install --save express mongoose body-parser
EXPOSE 3000
COPY pagamentos.js .
ENTRYPOINT chmod 777 -R /usr/src/app
ENTRYPOINT node pagamentos.js