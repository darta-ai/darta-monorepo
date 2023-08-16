export NAMESPACE=arango-deployment-cluster-2
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
  helm install $URLPREFIX/kube-arangodb-crd-$VERSION.tgz --namespace "$NAMESPACE" --generate-name
fi

# Check if helm chart is already installed
if ! helm list -n "$NAMESPACE" | grep kube-arangodb > /dev/null 2>&1; then
    helm install $URLPREFIX/kube-arangodb-$VERSION.tgz --namespace "$NAMESPACE" --generate-name
    helm install $URLPREFIX/kube-arangodb-$VERSION.tgz --set "operator.features.storage=true" --namespace "$NAMESPACE" --generate-name
fi

# Check if ArangoDB Deployment already exists
if ! kubectl -n "$NAMESPACE" get ArangoDeployment $NAMESPACE > /dev/null 2>&1; then
  kubectl apply -f charts/$NAMESPACE.yaml
fi

