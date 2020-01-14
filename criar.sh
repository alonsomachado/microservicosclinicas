eval $(minikube docker-env)
kubectl apply -f ./confminikube/redispubsub.yaml
kubectl apply -f ./confminikube/rediscaduser.yaml
docker build -t micro-agendamento:v1 ./agendamento
docker build -t micro-pagamento:v1 ./pagamento
docker build -t micro-realizar:v1 ./realizar
docker build -t micro-front:v1 ./front
minikube addons enable ingress
kubectl apply -f ./confminikube