#!/bin/sh
set -x
kubeadm reset --force
sudo apt-get remove kubeadm kubectl kubelet kubernetes-cni kube* -y
sudo apt-get autoremove -y
[ -e ~/.kube ] && rm -rf ~/.kube
[ -e /etc/kubernetes ] && rm -rf /etc/kubernetes
[ -e /opt/cni ] && rm -rf /opt/cn
