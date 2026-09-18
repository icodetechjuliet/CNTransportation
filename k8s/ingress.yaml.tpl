apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: cargonettransportation
  namespace: cargonettms
  annotations:
    # k3s ships Traefik by default. If this cluster's ingress controller is
    # ingress-nginx instead, swap this for: kubernetes.io/ingress.class: nginx
    kubernetes.io/ingress.class: traefik
spec:
  rules:
    - host: ${APP_HOST}
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: cargonettransportation
                port:
                  number: 80
