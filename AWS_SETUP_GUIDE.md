# AWS + Terraform + Jenkins + Docker Hub Setup Guide

This guide connects your Request flow: **GitHub -> Jenkins -> Docker Hub -> Terraform -> AWS**.

## 1. Prerequisites (Jenkins Setup)
Ensure your Jenkins server has the following installed:
1.  **Docker**: To build images.
2.  **Terraform**: To provision AWS resources.
3.  **AWS CLI** (optional, but good for debugging).

### 2. Configure Credentials in Jenkins
Go to **Dashboard -> Manage Jenkins -> Credentials -> System -> Global credentials**.
Add the following credentials:

1.  **Docker Hub Credentials**:
    -   **Kind**: Username with password
    -   **ID**: `docker-hub-credentials`
    -   **Username**: Your Docker Hub username.
    -   **Password**: Your Docker Hub password (or Access Token).

2.  **AWS Credentials**:
    You have two options here.
    
    *Option A (Simpler context usage in pipeline)*:
    -   **Kind**: Secret text
    -   **ID**: `aws-access-key-id` (Value: Your AWS Access Key)
    -   **ID**: `aws-secret-access-key` (Value: Your AWS Secret Key)
    
    *Reference in Jenkinsfile*:
    I have updated the `Jenkinsfile` to use these specific IDs. Ensure you use these exact IDs (`aws-access-key-id`, `aws-secret-access-key`).

## 3. Review the Project Files

### `Jenkinsfile`
I have updated it to:
1.  **Build** your Frontend and Backend images.
2.  **Push** them to Docker Hub (using `kavindu128` based on your metadata, change if needed).
3.  **Run Terraform** to provision the EC2 instance.

### `terraform/main.tf`
I have updated it to:
1.  Use the **AWS Provider**.
2.  Create an **EC2 Instance** (t2.micro).
3.  Generate an **SSH Key Pair** (`employee-app-key.pem` will be saved in the terraform folder).
4.  Use a **User Data script** to:
    -   Install Docker & Docker Compose on the EC2.
    -   Create a `docker-compose.yml` file on the server.
    -   Pull your images from Docker Hub.
    -   Start the application automatically.

## 4. How to Run
1.  **Push your code** to GitHub.
2.  **Trigger the Jenkins Job**.
3.  **Wait** for the pipeline to finish.
    -   Terraform will output the `instance_public_ip`.
4.  **Access your App**:
    -   Go to `http://<EC2-PUBLIC-IP>:5173` to see the frontend.
    -   Go to `http://<EC2-PUBLIC-IP>:5000` to see the backend.

## 5. Important Notes
-   **First Run**: Terraform will create the EC2 instance. The `user_data` script runs *only on the first boot*. It takes about 2-3 minutes to install Docker and start the app.
-   **Updates**: If you push new code, Jenkins will rebuild images and push to Docker Hub. However, running `terraform apply` again *will not* automatically update the running containers on the *existing* EC2 instance unless you taint the instance (force recreate) or SSH in to restart it.
    -   *To force a fresh instance*: `terraform taint aws_instance.app_server` before apply.
    -   *Or simple manual update*: SSH into the server (`ssh -i terraform/employee-app-key.pem ec2-user@<IP>`) and run `docker-compose pull && docker-compose up -d`.

## Troubleshooting
-   **"Terraform not found"**: Make sure Terraform is installed on the Jenkins agent.
-   **"Docker permission denied"**: Make sure the `jenkins` user can run docker commands (`sudo usermod -aG docker jenkins`).
