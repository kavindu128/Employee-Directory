output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.employee_directory_server.public_ip
}
