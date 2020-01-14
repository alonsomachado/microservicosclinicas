FROM node:carbon
WORKDIR /usr/src/app
RUN npm install --save express express-handlebars body-parser path method-override redis axios request
EXPOSE 80
COPY . .
ENTRYPOINT chmod 777 -R /usr/src/app
ENTRYPOINT node app.js