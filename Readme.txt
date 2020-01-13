docker build -t micro-agendamento:v1 ./agendamento
docker build -t micro-pagamento:v1 ./pagamento

kubectl apply -f ./confminikube

docker run -i --name pag -p 30123:30123  micro-pagamento:v1 
docker run -i --name age -p 30123:30123 micro-agendamento:v1

kubectl describe pod redis
kubectl exec redis -- printenv
kubectl exec -it agendamentobraga-c445f986f-ppf7h bash jumpod ping pubsub.redis.default.svc.cluster.local
kubectl exec -it jumpod nslookup pubsub.redis.default.svc.cluster.local

Resolver problema de rede no minikube
sudo rm /etc/resolv.conf
sudo su
echo "nameserver 8.8.8.8"  >> /etc/resolv.conf

eval $(minikube docker-env)

https://github.com/alonsomachado/microservicosclinicas