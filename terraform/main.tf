terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# 1. Create a Security Group
resource "aws_security_group" "app_sg" {
  name        = "employee-app-sg"
  description = "Allow Web and SSH traffic"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Frontend"
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "MongoDB" # Optional: Open only if you need external access
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 2. Setup SSH Key (Optional: Generates a new key pair for access)
resource "tls_private_key" "example" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "generated_key" {
  key_name   = "Employee"
  public_key = tls_private_key.example.public_key_openssh
}

resource "local_file" "private_key" {
  content  = tls_private_key.example.private_key_pem
  filename = "${path.module}/employee-app-key.pem"
  file_permission = "0400"
}

# 3. Create EC2 Instance
resource "aws_instance" "app_server" {
  ami           = "ami-024ee5112d03921e2" # Amazon Linux 2023 (US-EAST-1) - Update if region changes
  instance_type = "t3.micro"
  key_name      = aws_key_pair.generated_key.key_name

  vpc_security_group_ids = [aws_security_group.app_sg.id]

  user_data = <<-EOF
              #!/bin/bash
              # Update and Install Docker
              yum update -y
              yum install -y docker
              service docker start
              usermod -a -G docker ec2-user
              chkconfig docker on

              # Install Docker Compose
              curl -L "https://github.com/docker/compose/releases/download/v2.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              chmod +x /usr/local/bin/docker-compose

              # Create App Directory & Compose File
              mkdir -p /home/ec2-user/app
              cat <<EOT > /home/ec2-user/app/docker-compose.yml
              version: '3.8'
              services:
                frontend:
                  image: ${var.docker_username}/employee-frontend:latest
                  ports:
                    - "5173:5173"
                  depends_on:
                    - backend
                backend:
                  image: ${var.docker_username}/employee-backend:latest
                  ports:
                    - "5000:5000"
                  environment:
                    - MONGO_URI=mongodb://mongodb:27017/employeeDirectory
                  depends_on:
                    - mongodb
                mongodb:
                  image: mongo:6.0
                  ports:
                    - "27017:27017"
                  volumes:
                    - mongo-data:/data/db
              volumes:
                mongo-data:
              EOT

              # Run the Application
              cd /home/ec2-user/app
              /usr/local/bin/docker-compose up -d
              EOF

  tags = {
    Name = "EmployeeAppServer"
  }
}
