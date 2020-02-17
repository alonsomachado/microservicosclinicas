FROM node:carbon
WORKDIR /usr/src/app
RUN npm install --save express body-parser redis nodemailer
EXPOSE 3000
COPY mailer.js .
ENTRYPOINT chmod 777 -R /usr/src/app
ENTRYPOINT node mailer.js