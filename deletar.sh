eval $(minikube docker-env)
docker image rm micro-agendamento:v1 micro-pagamento:v1
kubectl delete service  agendamentobraga agendamentoporto pagamentobraga pagamentoporto redis-service
kubectl delete deployment agendamentobraga agendamentoporto pagamentobraga pagamentoporto redis
kubectl delete ingress ingress-fanout
