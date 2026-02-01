provider "aws" {
  region = var.aws_region
}

# Security Group
resource "aws_security_group" "employee_directory_sg" {
  name        = "employee-directory-sg"
  description = "Allow inbound traffic for SSH, HTTP, Frontend and Backend"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Frontend (React)"
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend (Node/Express)"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "MongoDB"
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

# EC2 Instance
resource "aws_instance" "employee_directory_server" {
  ami           = var.ami_id
  instance_type = var.instance_type
  key_name      = var.key_name

  vpc_security_group_ids = [aws_security_group.employee_directory_sg.id]

  user_data = <<-EOF
              #!/bin/bash
              # Update and install Docker
              dnf update -y
              dnf install -y docker
              systemctl enable docker
              systemctl start docker
              usermod -a -G docker ec2-user

              # Install Docker Compose (Stand-alone binary)
              curl -SL https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
              chmod +x /usr/local/bin/docker-compose
              ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

              # Create application directory
              mkdir -p /home/ec2-user/app
              cd /home/ec2-user/app

              # Create docker-compose.yml
              cat <<EOT > docker-compose.yml
              version: '3.8'
              services:
                mongodb:
                  image: mongo:6.0
                  container_name: mongodb
                  restart: always
                  ports:
                    - "27017:27017" # Exposed for debugging, can be removed for production safety
                  volumes:
                    - mongo-data:/data/db
                  networks:
                    - app-network

                backend:
                  image: ${var.docker_username}/employee-backend:latest
                  container_name: backend
                  restart: always
                  ports:
                    - "5000:5000"
                  environment:
                    - MONGO_URI=mongodb://mongodb:27017/employeeDirectory
                    - PORT=5000
                  depends_on:
                    - mongodb
                  networks:
                    - app-network

                frontend:
                  image: ${var.docker_username}/employee-frontend:latest
                  container_name: frontend
                  restart: always
                  ports:
                    - "5173:5173"
                  depends_on:
                    - backend
                  networks:
                    - app-network

              volumes:
                mongo-data:

              networks:
                app-network:
                  driver: bridge
              EOT

              # Start the application
              docker-compose up -d
              EOF

  tags = {
    Name = "EmployeeDirectory-Server"
  }
}

resource "null_resource" "app_update" {
  triggers = {
    always_run = timestamp()
  }

  depends_on = [aws_instance.employee_directory_server]

  connection {
    type        = "ssh"
    user        = "ec2-user"
    private_key = file("${path.module}/employeekeypair.pem")
    host        = aws_instance.employee_directory_server.public_ip
  }

  provisioner "remote-exec" {
    inline = [
      "cd /home/ec2-user/app",
      "docker-compose pull",
      "docker-compose up -d"
    ]
  }
}
