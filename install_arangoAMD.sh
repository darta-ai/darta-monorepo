#!/bin/bash
export NAMESPACE=arango-dev-cluster
export VERSION=1.2.32
export URLPREFIX=https://github.com/arangodb/kube-arangodb/releases/download/$VERSION

# Check if namespace already exists
if ! kubectl get namespace "$NAMESPACE" > /dev/null 2>&1; then
  echo "Creating namespace $NAMESPACE"
  kubectl create namespace "$NAMESPACE"
fi

# Check if helm CRD chart is already installed
if ! helm list -n "$NAMESPACE" | grep kube-arangodb-crd > /dev/null 2>&1; then
  echo "Installing helm ArangoDB CRD chart"
  helm install kube-arangodb-crd "$URLPREFIX/kube-arangodb-crd-$VERSION.tgz" --namespace "$NAMESPACE"
  # helm install kube-arangodb-crd https://github.com/arangodb/kube-arangodb/releases/download/1.2.25/kube-arangodb-crd-1.2.25.tgz --namespace "arango-mvp-cluster"
fi

echo "Installing helm ArangoDB chart"
helm install kube-arangodb "$URLPREFIX/kube-arangodb-$VERSION.tgz" --namespace "$NAMESPACE" 
  # helm install kube-arangodb https://github.com/arangodb/kube-arangodb/releases/download/1.2.25/kube-arangodb-1.2.25.tgz --namespace "arango-mvp-cluster" 


helm install https://github.com/arangodb/kube-arangodb/releases/download/1.2.32/kube-arangodb-1.2.32.tgz
# To use `ArangoLocalStorage`, set field `operator.features.storage` to true
helm install https://github.com/arangodb/kube-arangodb/releases/download/1.2.32/kube-arangodb-1.2.32.tgz 

echo "Creating ArangoDB Deployment"
kubectl apply -f charts/arango-dev-clusterAMD.yaml