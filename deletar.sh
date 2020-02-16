eval $(minikube docker-env)
kubectl delete service  agendamento rediscadagen pagamento rediscadpag redis rediscaduser checkin rediscadcheckin frontend
kubectl delete deployment agendamento rediscadagen pagamento rediscadpag redis rediscaduser checkin rediscadcheckin frontend
kubectl delete ingress ingress-fanout
docker image rm micro-agendamento:v1 micro-pagamento:v1 micro-checkin:v1 micro-front:v1
