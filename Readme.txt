$ docker build -t micro-agendamento:v1 ./agendamento
$ docker build -t micro-pagamento:v1 ./pagamento

kubectl apply -f ./kube


Resolver problema de rede no minikube
sudo rm /etc/resolv.conf
sudo su
echo "nameserver 8.8.8.8"  >> /etc/resolv.conf
eval $(minikube docker-env)