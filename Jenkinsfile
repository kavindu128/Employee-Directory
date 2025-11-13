pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Images') {
      steps {
        sh 'docker compose build'
      }
    }

    stage('Run Containers') {
      steps {
        sh 'docker compose up -d'
      }
    }

    stage('Test') {
      steps {
        sh 'docker ps' // optional: you can add API test scripts here
      }
    }

    stage('Cleanup') {
      steps {
        sh 'docker compose down'
      }
    }
  }

  post {
    failure {
      echo '❌ Build or test failed!'
    }
    success {
      echo '✅ Employee Directory build and deploy succeeded!'
    }
  }
}