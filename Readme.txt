docker build -t micro-agendamento:v1 ./agendamento
docker build -t micro-pagamento:v1 ./pagamento

kubectl apply -f ./confminikube

docker run -it --name pag -p 30123:30123  micro-pagamento:v1 
docker run -dit --name age -p 30123:30123 micro-agendamento:v1

Resolver problema de rede no minikube
sudo rm /etc/resolv.conf
sudo su
echo "nameserver 8.8.8.8"  >> /etc/resolv.conf

eval $(minikube docker-env)

https://github.com/alonsomachado/microservicosclinicas