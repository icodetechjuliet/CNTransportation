# Path-based ingress: routes http://${APP_HOST}/${APP_PATH} to this
# deployment. The app itself is built to serve from "/" (hash-mode router,
# publicPath "/" — see quasar.config.js and nginx.conf), so the "/${APP_PATH}"
# prefix is stripped by Traefik before the request reaches the pod; the pod
# never needs to know it's being served under a subpath.
#
# The built index.html references assets with relative paths (e.g.
# "js/app.js", no leading slash). Relative URLs resolve against the browser's
# address bar by dropping everything after the last "/" — so hitting
# "/${APP_PATH}" (no trailing slash) makes the browser resolve those assets
# against the domain root instead of "/${APP_PATH}/", which 404s and leaves
# a blank page. The redirect middleware below forces the trailing slash
# before the strip-prefix middleware runs, so relative asset paths resolve
# correctly.
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: cargonettransportation-redirect-${APP_PATH}
  namespace: ${NAMESPACE}
spec:
  redirectRegex:
    regex: "^(https?)://([^/]+)/${APP_PATH}(\\?.*)?$"
    replacement: "${1}://${2}/${APP_PATH}/${3}"
    permanent: false
---
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
    traefik.ingress.kubernetes.io/router.middlewares: ${NAMESPACE}-cargonettransportation-redirect-${APP_PATH}@kubernetescrd,${NAMESPACE}-cargonettransportation-strip-${APP_PATH}@kubernetescrd
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
