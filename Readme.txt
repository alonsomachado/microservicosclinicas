docker build -t micro-agendamento:v1 ./agendamento
docker build -t micro-pagamento:v1 ./pagamento
docker build -t micro-realizar:v1 ./realizar
docker build -t micro-front:v1 ./front

kubectl apply -f ./confminikube/jumpod.yaml

docker run -i --name pag -p 30123:30123  micro-pagamento:v1 
docker run -i --name age -p 30123:30123 micro-agendamento:v1

kubectl describe pod redis
kubectl describe ingress ingress-fanout
kubectl apply -f jumpod.yaml
kubectl exec jumpod -- printenv
kubectl exec -it agendamentobraga-c445f986f-ppf7h ping pubsub.redis.default.svc.cluster.local
kubectl exec -it jumpod nslookup pubsub.redis.default.svc.cluster.local
kubectl delete pod jumpod

Resolver problema de rede no minikube
sudo rm /etc/resolv.conf
sudo su
echo "nameserver 8.8.8.8"  >> /etc/resolv.conf

eval $(minikube docker-env)

https://github.com/alonsomachado/microservicosclinicas