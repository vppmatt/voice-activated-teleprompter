def GIT_URL = "https://github.com/vppmatt/voice-activated-teleprompter.git"

pipeline {
    agent any
    options {
        timeout(time: 300, unit: "SECONDS")
    }
    stages {

        stage('GetFromGithub') {
            steps {
                git branch: 'main', credentialsId: 'github', url: GIT_URL
            }
        }
       
        stage("GetDependencies") {
            steps {
                script {
                    sh "npm install"
                }
            }
        }

        stage("Build") {
            steps {
                script {
                    sh "npm run build"
                }
            }
        }

        stage("CreateDockerImage") {
            steps {
                script {
                    sh "docker build -t teleprompter:latest ."
                }
            }
        }

    }
}
