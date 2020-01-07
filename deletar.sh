eval $(minikube docker-env)
docker image rm micro-agendamento:v1 micro-pagamento:v1
kubectl delete service ambassador ambassador-admin agendamentobraga agendamentoporto pagamentobraga pagamentoporto
kubectl delete deployment ambassador agendamentobraga agendamentoporto pagamentobraga pagamentoporto
