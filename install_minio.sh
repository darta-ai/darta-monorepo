# export URLPREFIX=https://raw.githubusercontent.com/arangodb/kube-arangodb/1.22/manifests
# kubectl apply -f $URLPREFIX/arango-crd.yaml
# kubectl apply -f $URLPREFIX/arango-deployment.yaml

# # helm repo add minio https://helm.min.io/

# # helm repo update

# export myaccesskey=tjWetmore
# export mysecretkey=tjWetmore


# helm install minio-release minio/minio

# echo "Port Fowarding"
# kubectl port-forward svc/minio-release 9000:9000


# helm install minio-release minio/minio --set accessKey=$myaccesskey,secretKey=$mysecretkey
# helm install minio-release minio/minio --set persistence.enabled=true,persistence.size=10Gi
# #!/bin/bash

# # Add the MinIO Helm repository
# echo "Adding Minio"
# helm install \ --namespace minio-operator \ --create-namespace \ minio-operator ./charts/minio/operator-5.0.7.tgz

# # adding the service yaml
# echo "adding service.yaml"
# kubectl apply -f service.yaml

# echo "adding operator.yaml"
# kubectl apply -f operator.yaml

# echo "adding console-secret.yaml"
# kubectl apply -f console-secret.yaml
