minikube ssh
sudo rm /etc/resolv.conf
sudo su
echo "nameserver 8.8.8.8"  >> /etc/resolv.conf
cat /etc/resolv.conf