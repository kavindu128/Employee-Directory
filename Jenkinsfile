pipeline {
    agent any

    environment {
        // YOUR DOCKER HUB USERNAME
        DOCKER_HUB_USER = 'kavindu128' 
        
        // Docker Image Names
        IMAGE_FRONTEND = "${DOCKER_HUB_USER}/employee-frontend"
        IMAGE_BACKEND  = "${DOCKER_HUB_USER}/employee-backend"
        
        // This MUST match the ID in Jenkins -> Manage Jenkins -> Credentials
        DOCKER_CREDS_ID = 'dockerhub'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Login to Docker') {
            steps {
               script {
                     // We LOGIN FIRST to avoid 401 Unauthorized errors when pulling base images
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDS_ID, passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    }
               }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
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
                    sh "docker push ${IMAGE_BACKEND}:latest"
                    sh "docker push ${IMAGE_FRONTEND}:latest"
                }
            }
        }

        stage('Provision AWS Infrastructure') {
            steps {
                dir('terraform') {
                    // Use environment variables directly in the shell context
                    withCredentials([
                        string(credentialsId: 'aws-access-key', variable: 'AWS_ACCESS_KEY_ID'),
                        string(credentialsId: 'aws-secret-key', variable: 'AWS_SECRET_ACCESS_KEY'),
                        file(credentialsId: 'ec2-ssh-key', variable: 'SSH_KEY_FILE')
                    ]) {
                        // Initialize Terraform
                        sh 'terraform init'
                        
                        // Apply Terraform
                        sh """
                            export AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
                            export AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
                            terraform apply -auto-approve -var='docker_username=${DOCKER_HUB_USER}' -var="private_key_path=${SSH_KEY_FILE}"
                        """
                    }
                }
            }
        }
    }
}