// ============================================================================
// CargoNet Transportation — build & deploy to k3s
//
// Single-deployment pipeline (one Deployment/Service/Ingress, no per-client
// fan-out) — unlike the sibling cargonetquasar pipeline, this app doesn't
// need the Active Choices multi-region/multi-client machinery, so it's a
// plain declarative pipeline.
//
// Reuses the same Jenkins credentials already configured for the sibling
// project's k3s pipeline:
//   - registry-host          (Secret text, e.g. "<REGISTRY_IP>:5000")
//   - local-registry-creds   (Username with password)
//   - k3s-kubeconfig         (Secret file)
// ============================================================================
pipeline {
    agent any

    parameters {
        string(
            name: 'ROLLBACK_TAG',
            defaultValue: '',
            description: 'Build number to redeploy without rebuilding. Leave blank for a normal build+deploy.'
        )
        string(
            name: 'APP_PATH',
            defaultValue: 'transdemo',
            description: 'URL path segment this deployment is reached at, under the shared host. e.g. "transdemo" -> http://b2.gocargonet.com/transdemo'
        )
    }

    environment {
        REGISTRY_HOST        = credentials('registry-host')          // Secret text
        REGISTRY_CREDENTIALS = credentials('local-registry-creds')   // Username-with-password
        KUBECONFIG            = credentials('k3s-kubeconfig')        // Secret file
        IMAGE_NAME  = "cargonettransportation"
        NAMESPACE   = "cargonettms"
        APP_HOST    = "b2.gocargonet.com"
    }

    stages {

        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Determine Image Tag') {
            steps {
                script {
                    if (params.ROLLBACK_TAG?.trim()) {
                        env.IMAGE_TAG  = params.ROLLBACK_TAG.trim()
                        env.SKIP_BUILD = "true"
                        echo "Rollback requested — reusing image tag ${env.IMAGE_TAG}, skipping build."
                    } else {
                        env.IMAGE_TAG  = "${env.BUILD_NUMBER}"
                        env.SKIP_BUILD = "false"
                    }
                    env.FULL_IMAGE = "${REGISTRY_HOST}/${IMAGE_NAME}:${env.IMAGE_TAG}"
                }
            }
        }

        stage('Build Docker Image') {
            when { environment name: 'SKIP_BUILD', value: 'false' }
            steps {
                sh 'docker build -t ${FULL_IMAGE} .'
            }
        }

        stage('Push to Local Registry') {
            when { environment name: 'SKIP_BUILD', value: 'false' }
            steps {
                sh '''
                    echo "$REGISTRY_CREDENTIALS_PSW" | docker login ${REGISTRY_HOST} -u "$REGISTRY_CREDENTIALS_USR" --password-stdin
                    docker push ${FULL_IMAGE}
                '''
            }
        }

        stage('Apply Manifests') {
            steps {
                withEnv(["IMAGE=${env.FULL_IMAGE}", "APP_PATH=${params.APP_PATH}"]) {
                    sh '''
                        envsubst < k8s/deployment.yaml.tpl   | kubectl apply -f -
                        envsubst < k8s/service.yaml.tpl      | kubectl apply -f -
                        envsubst < k8s/ingress-path.yaml.tpl | kubectl apply -f -
                        kubectl rollout status deployment/cargonettransportation -n ${NAMESPACE} --timeout=120s
                    '''
                }
            }
        }

        stage('Cleanup local image') {
            when { environment name: 'SKIP_BUILD', value: 'false' }
            steps {
                sh 'docker rmi ${FULL_IMAGE} || true'
            }
        }
    }

    post {
        success {
            echo "Deployed ${env.FULL_IMAGE} to namespace ${NAMESPACE} — reachable at http://${env.APP_HOST}/${params.APP_PATH}"
        }
        failure {
            echo "Pipeline failed — check console output above."
        }
    }
}
