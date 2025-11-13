pipeline {
  agent any

  environment {
    IMAGE_FRONTEND = "kavindu128/employee-directory-frontend:latest"
    IMAGE_BACKEND = "kavindu128/employee-directory-backend:latest"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build Docker Images') {
      steps {
        sh 'docker compose build'
      }
    }

    stage('Login to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
        }
      }
    }

    stage('Push Docker Images') {
      steps {
        sh 'docker compose push'
      }
    }

    stage('Run Containers') {
      steps {
        sh 'docker compose up -d'
      }
    }

    stage('Test') {
      steps {
        sh 'docker ps'
      }
    }
  }

  post {
    failure { echo '❌ Build or deploy failed!' }
    success { echo '✅ CropMarket build and deploy succeeded!' }
  }
}