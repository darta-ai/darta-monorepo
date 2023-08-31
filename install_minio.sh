

# helm repo add minio https://helm.min.io/

# helm repo update

export myaccesskey=tjWetmore
export mysecretkey=tjWetmore


helm install minio-release minio/minio

echo "Port Fowarding"
kubectl port-forward svc/minio-release 9000:9000


helm install minio-release minio/minio --set accessKey=$myaccesskey,secretKey=$mysecretkey
helm install minio-release minio/minio --set persistence.enabled=true,persistence.size=10Gi
#!/bin/bash

# Add the MinIO Helm repository
echo "Adding Minio"
helm repo add minio https://helm.min.io/

# Update Helm repo to get the latest charts
helm repo update

# Install MinIO
# You can add more configurations or use a values.yaml file as needed
helm install my-minio-release minio/minio --set accessKey=$myaccesskey,secretKey=$mysecretkey

# Other commands or configurations can be added as necessary

helm install my-minio-release ./my-minio-chart -f values.yaml -f secrets.yaml
