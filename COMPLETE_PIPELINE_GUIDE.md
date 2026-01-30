# 🚀 Complete DevOps Pipeline Guide (From Scratch)

This guide covers everything you need to connect **GitHub -> Jenkins -> Docker Hub -> Terraform -> AWS**.

---

## 🛑 STEP 1: Fix the "Push to Docker Hub" Error
The red "X" in your screenshot happened because Jenkins doesn't have your Docker Hub password yet.

1.  **Go to Docker Hub**:
    *   Log in to [hub.docker.com](https://hub.docker.com/).
    *   Make sure your username is exactly `kavindu128` (or update the `Jenkinsfile` if it's different).
    *   Go to **Account Settings** -> **Security** -> **New Access Token**.
    *   Description: `jenkins-token`.
    *   Permissions: **Read, Write, Delete**.
    *   **Copy the token** (it looks like `dckr_pat_...`).

2.  **Go to Jenkins**:
    *   Navigate to **Dashboard** -> **Manage Jenkins** -> **Credentials**.
    *   Click **System** -> **Global credentials (unrestricted)**.
    *   Click **+ Add Credentials**.
    *   **Kind**: `Username with password`.
    *   **Scope**: `Global`.
    *   **Username**: `kavindu128` (Your Docker Hub ID).
    *   **Password**: Paste the **Access Token** you copied (NOT your login password).
    *   **ID**: `docker-hub-credentials` (This MUST match the Jenkinsfile exactly).
    *   **Description**: `Docker Hub Access`.
    *   Click **Create**.

---

## ☁️ STEP 2: Configure AWS Credentials in Jenkins
Jenkins needs permission to create servers on your AWS account.

1.  **Go to AWS Console**:
    *   Go to **IAM** -> **Users**.
    *   Create a user (e.g., `jenkins-user`) with **AdministratorAccess** (or `AmazonEC2FullAccess`).
    *   Go to **Security Credentials** for that user.
    *   Create an **Access Key**.
    *   Copy the **Access Key ID** and **Secret Access Key**.

2.  **Go to Jenkins**:
    *   Go back to **Manage Jenkins** -> **Credentials** -> **System** -> **Global credentials**.
    *   **Add Credential 1**:
        *   **Kind**: `Secret text`.
        *   **Secret**: (Paste your AWS **Access Key ID**).
        *   **ID**: `aws-access-key-id`.
    *   **Add Credential 2**:
        *   **Kind**: `Secret text`.
        *   **Secret**: (Paste your AWS **Secret Access Key**).
        *   **ID**: `aws-secret-access-key`.

---

## 🛠️ STEP 3: Verify The Code
Ensure your files are correct.

**1. `Jenkinsfile` (Check the top variables)**
Make sure the `DOCKER_HUB_USER` matches yours.
```groovy
environment {
    DOCKER_HUB_USER = 'kavindu128' 
    DOCKER_CREDS_ID = 'docker-hub-credentials'
    AWS_CREDS_ID = 'aws-credentials' // This line is actually unused in my new script, we use specific IDs below
}
```

**2. `terraform/main.tf` (Check the AMI)**
Make sure the `ami` ID is valid for your region (`us-east-1`).
```hcl
resource "aws_instance" "app_server" {
  ami = "ami-024ee5112d03921e2" # Amazon Linux 2023 (us-east-1)
  ...
}
```

---

## 🚀 STEP 4: Trigger the Pipeline
Now that credentials are set:

1.  Go to your **Jenkins Job**.
2.  Click **Build Now**.
3.  Click on the flashing **#Build Number** -> **Console Output**.

### What will happen?
1.  **Build**: Jenkins builds your React and Node apps into Docker images.
2.  **Push**: Jenkins sends them to `hub.docker.com/u/kavindu128`.
3.  **TF Init**: Jenkins downloads the AWS tools.
4.  **TF Apply**: Jenkins calls AWS to create an EC2 server.
5.  **Success**: It prints the `app_url` (Public IP) at the end.

---

## 💻 STEP 5: Access Your App
Wait about 3-5 minutes after the build finishes (the server needs time to start up).

1.  **Find the IP**: Look at the Jenkins logs for `instance_public_ip = "52.90.x.x"`.
2.  **Open Browser**:
    *   Frontend: `http://<IP>:5173`
    *   Backend: `http://<IP>:5000`

---

## 🐞 Troubleshooting a "Permission Denied (publickey)" Error
If you try to SSH into the server and get "Permission Denied", do this **on your local machine** (not Jenkins):

1.  **Navigate to the folder**:
    ```bash
    cd "d:\Acadamic\Semester 5\Devops\Docker\Employee-Directory\terraform"
    ```
2.  **Fix key permissions** (Important!):
    ```bash
    chmod 400 employee-app-key.pem
    ```
3.  **Connect**:
    ```bash
    # Replace 52.90.x.x with your actual new IP from Jenkins
    ssh -i employee-app-key.pem ec2-user@52.90.x.x
    ```
