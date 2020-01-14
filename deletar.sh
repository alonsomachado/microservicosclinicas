eval $(minikube docker-env)
kubectl delete service  agendamentobraga agendamentoporto pagamentobraga pagamentoporto redis rediscaduser realizarbraga realizarporto frontend
kubectl delete deployment agendamentobraga agendamentoporto pagamentobraga pagamentoporto redis rediscaduser realizarbraga realizarporto frontend
kubectl delete ingress ingress-fanout
docker image rm micro-agendamento:v1 micro-pagamento:v1 micro-realizar:v1 micro-front:v1
