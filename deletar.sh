eval $(minikube docker-env)
docker image rm micro-agendamento:v1 micro-pagamento:v1
kubectl delete service  agendamentobraga agendamentoporto pagamentobraga pagamentoporto
kubectl delete deployment agendamentobraga agendamentoporto pagamentobraga pagamentoporto
kubectl delete ingress ingress-fanout
