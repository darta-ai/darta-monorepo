#!/bin/bash
export NAMESPACE=arango-cluster-dev
export VERSION=1.2.32
export URLPREFIX=https://github.com/arangodb/kube-arangodb/releases/download/$VERSION

# Check if namespace already exists
if ! kubectl get namespace "$NAMESPACE" > /dev/null 2>&1; then
  echo "Creating namespace $NAMESPACE, version $VERSION"
  kubectl create namespace "$NAMESPACE"
fi

kubectl apply -f https://raw.githubusercontent.com/arangodb/kube-arangodb/$VERSION/manifests/arango-crd.yaml --namespace "$NAMESPACE"
kubectl apply -f https://raw.githubusercontent.com/arangodb/kube-arangodb/$VERSION/manifests/arango-deployment.yaml --namespace "$NAMESPACE"
