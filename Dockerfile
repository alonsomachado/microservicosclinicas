FROM node:carbon
WORKDIR /usr/src/app
RUN npm install --save express mongoose request axios
EXPOSE 8080
COPY . .
ENTRYPOINT chmod 777 -R /usr/src/app
ENTRYPOINT node start