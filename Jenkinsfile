pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        DOCKER_IMAGE_BACKEND = 'kavindu128/employee-directory-backend'
        DOCKER_IMAGE_FRONTEND = 'kavindu128/employee-directory-frontend'
        GIT_BRANCH = 'main'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: "${GIT_BRANCH}", url: 'https://github.com/kavindu128/Employee-Directory.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER}", './backend')
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER}", './frontend')
                }
            }
        }

        stage('Run Tests') {
            steps {
                // If you have tests, run them here
                // For example, for backend tests:
                // dir('backend') {
                //     sh 'npm test'
                // }
                // Similarly for frontend
            }
        }

        stage('Push Images to DockerHub') {
            steps {
                script {
                    // Login to DockerHub
                    sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"

                    // Push Backend Image
                    sh "docker push ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER}"

                    // Push Frontend Image
                    sh "docker push ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER}"

                    // Also push as latest
                    sh "docker tag ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER} ${DOCKER_IMAGE_BACKEND}:latest"
                    sh "docker tag ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER} ${DOCKER_IMAGE_FRONTEND}:latest"
                    sh "docker push ${DOCKER_IMAGE_BACKEND}:latest"
                    sh "docker push ${DOCKER_IMAGE_FRONTEND}:latest"
                }
            }
        }

        stage('Deploy') {
            steps {
                // If you have a deployment environment (e.g., a server with Docker Compose)
                // You can add steps to SSH into the server and run `docker-compose up` with the new images.
                // Example:
                // sshagent(['your-ssh-credentials']) {
                //     sh "ssh -o StrictHostKeyChecking=no user@your-server 'cd /path/to/your/project && docker-compose pull && docker-compose up -d'"
                // }
            }
        }
    }

    post {
        always {
            // Clean up Docker images to save space
            sh 'docker system prune -f'
        }
        success {
            // Notifications or other actions on success
        }
        failure {
            // Notifications or other actions on failure
        }
    }
}