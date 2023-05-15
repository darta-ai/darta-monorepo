# Darta Development

## Dev Setup

1. Install [kind](https://kind.sigs.k8s.io/docs/user/quick-start/) (ArangoDB does not seem to work with minikube—YMMV).
    1a. run `kind create cluster`
2. Install [devspace](https://devspace.sh/cli/docs/getting-started/installation).
3. In your cluster, create the correct namespace if it does not already exist: `kubectl create namespace arango-cluster`.
4. Run `./install_arango.sh`, which will install the ArangoDB Kubernetes operators and create a database cluster.

A [NodePort](https://kubernetes.io/docs/concepts/services-networking/service/#type-nodeport) service called `arango-dev-cluster-ea` will have been created. You must find the port that it is exposed on. You can do this by running `kubectl get service arango-dev-cluster-ea -o yaml -n arango-cluster | grep nodePort`, or by examining it in [(Open)](https://github.com/MuhammedKalkan/OpenLens)[Lens](https://docs.k8slens.dev/getting-started/install-lens/). It will be 5 digits like `31420`, not ArangoDB's usual `8529`, which is only used internally within the cluster.

Visit `https://[[node cluster ip]]:[[service external port]]` in your browser (*note the `https`*) to see the ArangoDB web interface. The default credentials are `root` with no password. You can then set up user `darta` and database `darta` (be sure to specify the correct user, NOT `root`).

[Using the ArangoDB Kubernetes Operator](https://www.arangodb.com/docs/stable/deployment-kubernetes-usage.html)

## Development

1. `devspace dev` (remember to create a namespace like `darta` first)
2. `yarn run dev`

The API will be available at [http://localhost:1160](http://localhost:1160), which will probably open automatically when you run `yarn run dev`; cf. `src/index.ts` for current routes.