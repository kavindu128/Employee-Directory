variable "aws_region" {
  description = "AWS Region"
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 Instance Type"
  default     = "t3.micro"
}

variable "ami_id" {
  description = "AMI ID for Amazon Linux 2 (Update for your region if not us-east-1)"
  default     = "ami-024ee5112d03921e2" # Amazon Linux 2023 AMI 2023.10.20260120.4 x86_64 HVM kernel-6.12, us-east-1
}

variable "key_name" {
  description = "Name of the SSH key pair to use"
  default     = "employeekeypair" # REPLACE with your actual key pair name in AWS
}

variable "docker_username" {
  description = "Docker Hub username"
  type        = string
}
