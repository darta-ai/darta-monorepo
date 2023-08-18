#!/bin/bash
export NAMESPACE=arango-cluster-dev
export VERSION=1.2.26
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
fi

# Check if helm chart is already installed
if ! helm list -n "$NAMESPACE" | grep kube-arangodb > /dev/null 2>&1; then
  helm install kube-arangodb "$URLPREFIX/kube-arangodb-$VERSION.tgz" --namespace "$NAMESPACE" --set "operator.features.storage=true" --set "operator.architectures={amd64,arm64}"
fi

# Check if ArangoDB Deployment already exists
if ! kubectl -n "$NAMESPACE" get ArangoDeployment arango-dev-cluster > /dev/null 2>&1; then
  kubectl apply -f charts/arango-dev-cluster.yaml
fi
