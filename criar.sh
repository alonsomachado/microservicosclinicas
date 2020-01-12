eval $(minikube docker-env)
docker build -t micro-agendamento:v1 ./agendamento
docker build -t micro-pagamento:v1 ./pagamento
minikube addons enable ingress
kubectl apply -f ./confminikube
