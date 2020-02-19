Este repositorio do GITHUB é um trabalho de Microserviços em NODE.JS, EXPRESS.JS, EXPRESS HANDLEBARS e REDIS, que está preparado para ser colocado em ambiente KUBERNETES, com script para Minikube -- criar.sh (Create)  e deletar.sh (Delete).

Publisher / Subscriber REDIS 
Dockerfiles DOCKER

Comandos Uteis:

kubectl apply -f ./confminikube/jumpod.yaml
kubectl exec jumpod -- printenv
kubectl exec -it jumpod nslookup pubsub.redis.default.svc.cluster.local
kubectl delete pod jumpod

Resolver problema de rede no minikube // Minikube Network
minikube ssh
sudo rm /etc/resolv.conf
sudo su
echo "nameserver 8.8.8.8"  >> /etc/resolv.conf

eval $(minikube docker-env)

https://github.com/alonsomachado/microservicosclinicas
