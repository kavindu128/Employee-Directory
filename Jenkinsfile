pipeline {
    agent any

    environment {
        // REPLACE WITH YOUR DOCKER HUB USERNAME
        DOCKER_HUB_USER = 'kavindu128' 
        
        // Docker Image Names
        IMAGE_FRONTEND = "${DOCKER_HUB_USER}/employee-frontend"
        IMAGE_BACKEND  = "${DOCKER_HUB_USER}/employee-backend"
        
        // Credentials IDs (Must match Jenkins Dashboard IDs)
        DOCKER_CREDS_ID = 'dockerhub'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Make sure you have folders named 'backend' and 'frontend' in your git repo
                    echo 'building backend...'
                    sh "docker build -t ${IMAGE_BACKEND}:latest ./backend"
                    
                    echo 'building frontend...'
                    sh "docker build -t ${IMAGE_FRONTEND}:latest ./frontend"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDS_ID, passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                        sh "docker push ${IMAGE_BACKEND}:latest"
                        sh "docker push ${IMAGE_FRONTEND}:latest"
                    }
                }
            }
        }

        stage('Provision AWS Infrastructure') {
            steps {
                dir('terraform') {
                    // We use the Secret Text credentials we created earlier
                    withCredentials([
                        string(credentialsId: 'aws-access-key', variable: 'AWS_ACCESS_KEY_ID'),
                        string(credentialsId: 'aws-secret-key', variable: 'AWS_SECRET_ACCESS_KEY')
                    ]) {
                        // Initialize Terraform
                        sh 'terraform init'

                        // Apply Terraform
                        // We pass the Docker User so the EC2 knows which image to pull
                        sh "terraform apply -auto-approve -var='docker_username=${DOCKER_HUB_USER}'"
                    }
                }
            }
        }
    }
}