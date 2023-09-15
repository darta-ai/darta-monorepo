### Deployment Guide
Prerequisites:
Ensure you have kubectl and devspace CLI tools installed.
Make sure you have access to your GKE cluster. This typically means you've set the correct context for kubectl.

## Deployment Steps:
Login to Google Cloud SDK:
`gcloud auth login`

## Set your current GKE Cluster:

`gcloud container clusters get-credentials YOUR_CLUSTER_NAME --zone YOUR_ZONE --project YOUR_PROJECT_ID` 

## Deploy your Server Package:

Navigate to your server package directory:
`cd /packages/graphserver`

Then, use devspace to deploy:

`devspace deploy`

## Deploy your Next.js Package:

Navigate to your Next.js package directory:
`cd /packages/next`

Then, use devspace to deploy:
`devspace deploy`

## Setup the TLS Secrets:

# Create: 
`sudo certbot certonly --manual --preferred-challenges "dns-01" --server "https://dv.acme-v02.api.pki.goog/directory" --domains "darta.art,www.darta.art, api.darta.art"`

then run: 

`sudo cat /etc/letsencrypt/live/darta.art/fullchain.pem | base64`

then run:

`sudo cat /etc/letsencrypt/live/darta.works/privkey.pem | base64`

copy and paste those results into the my-tls-secret.yaml file in `charts/production/my-tls-secret.yaml`

then my-tls-secret with tls.cert and tls.key (e.g., `kubectl apply -f ./charts/productionmy-tls-secret.yaml`)

## Deploy LoadBalancer & IngressRoute:

`kubectl apply -f ingress-route.yaml`

## Verify the Deployments:

Check if your deployments, services, and IngressRoute are running:

`kubectl get deployments kubectl get services kubectl get ingressroute`

Ensure the TLS certificate is correctly set:

`kubectl describe secret my-tls-secret`

## Access Your Services:

Visit https://darta.art for the Next.js app.
Visit https://api.darta.art for the API.


Remember, always ensure you're deploying secure applications. Ensure your secrets (like the TLS secret) are safely managed and not hard-coded or checked into source control. Consider using Kubernetes native secrets or other secret management tools for sensitive data.