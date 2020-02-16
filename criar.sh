eval $(minikube docker-env)
kubectl apply -f ./confminikube/redis/
docker build -t micro-agendamento:v1 ./agendamento
docker build -t micro-pagamento:v1 ./pagamento
docker build -t micro-checkin:v1 ./checkin
docker build -t micro-front:v1 ./front
minikube addons enable ingress
kubectl apply -f ./confminikube