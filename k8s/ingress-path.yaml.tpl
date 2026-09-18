# Path-based ingress: routes http://${APP_HOST}/${APP_PATH} to this
# deployment. The app itself is built to serve from "/" (hash-mode router,
# publicPath "/" — see quasar.config.js and nginx.conf), so the "/${APP_PATH}"
# prefix is stripped by Traefik before the request reaches the pod; the pod
# never needs to know it's being served under a subpath.
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: cargonettransportation-strip-${APP_PATH}
  namespace: ${NAMESPACE}
spec:
  stripPrefix:
    prefixes:
      - /${APP_PATH}
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: cargonettransportation
  namespace: ${NAMESPACE}
  annotations:
    kubernetes.io/ingress.class: traefik
    traefik.ingress.kubernetes.io/router.middlewares: ${NAMESPACE}-cargonettransportation-strip-${APP_PATH}@kubernetescrd
spec:
  rules:
    - host: ${APP_HOST}
      http:
        paths:
          - path: /${APP_PATH}
            pathType: Prefix
            backend:
              service:
                name: cargonettransportation
                port:
                  number: 80
