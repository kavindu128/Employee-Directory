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

        stage('Provision AWS..') {
            steps {
                dir('terraform') {
                    withCredentials([
                        file(credentialsId: 'ec2-ssh-key', variable: 'SSH_KEY_FILE')
                    ]) {
                        // Directly and securely SSH into your LIVE instance to update it without destroying it!
                        sh """
                            chmod 400 ${SSH_KEY_FILE}
                            ssh -o StrictHostKeyChecking=no -i "${SSH_KEY_FILE}" ec2-user@44.200.69.194 'cd /home/ec2-user/app && docker-compose pull && docker-compose up -d'
                        """
                    }
                }
            }
        }
    }
}