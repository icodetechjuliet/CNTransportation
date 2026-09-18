apiVersion: v1
kind: Service
metadata:
  name: cargonettransportation
  namespace: cargonettms
  labels:
    app: cargonettransportation
spec:
  selector:
    app: cargonettransportation
  ports:
    - port: 80
      targetPort: 80
  type: ClusterIP
