eval $(minikube docker-env)
docker image rm micro-agendamento:v1 micro-pagamento:v1 micro-realizar:v1
kubectl delete service  agendamentobraga agendamentoporto pagamentobraga pagamentoporto redis realizarbraga realizarporto front
kubectl delete deployment agendamentobraga agendamentoporto pagamentobraga pagamentoporto redis realizarbraga realizarporto mysql front
kubectl delete ingress ingress-fanout
