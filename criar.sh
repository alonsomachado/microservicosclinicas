eval $(minikube docker-env)
docker build -t micro-agendamento:v1 ./agendamento
docker build -t micro-pagamento:v1 ./pagamento
kubectl apply -f ./minikube
