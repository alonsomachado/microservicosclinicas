FROM nginxinc/ingress-demo
WORKDIR /usr/src/www
RUN npm install --save express 
EXPOSE 3000
COPY . .
ENTRYPOINT chmod 777 -R /usr/src/www
ENTRYPOINT node agendamentos.js