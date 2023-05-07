# See the README.md for more information

export NAMESPACE=arango-cluster
export VERSION=1.2.26
export URLPREFIX=https://github.com/arangodb/kube-arangodb/releases/download/$VERSION
helm install kube-arangodb-crd $URLPREFIX/kube-arangodb-crd-$VERSION.tgz --namespace $NAMESPACE
helm install kube-arangodb $URLPREFIX/kube-arangodb-$VERSION.tgz --namespace $NAMESPACE --set "operator.features.storage=true" --set "operator.architectures={amd64,arm64}"
kubectl apply -f ../../charts/arango-dev-cluster.yaml