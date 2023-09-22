https://min.io/docs/minio/kubernetes/upstream/operations/install-deploy-manage/deploy-operator-helm.html

helm install \
--namespace minio-operator \
--create-namespace \
minio-operator ./operator


helm install \
--namespace minio-tenant \
--create-namespace \
minio-tenant ./tenant