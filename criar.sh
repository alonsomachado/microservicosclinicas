eval $(minikube docker-env)
kubectl apply -f ./confminikube/redisvolume.yaml
kubectl apply -f ./confminikube/redis.yaml
docker build -t micro-agendamento:v1 ./agendamento
docker build -t micro-pagamento:v1 ./pagamento
docker build -t micro-realizar:v1 ./realizar
minikube addons enable ingress
kubectl apply -f ./confminikube
