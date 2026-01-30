output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.app_server.public_ip
}

output "ssh_connection_string" {
  description = "Command to SSH into the instance"
  value       = "ssh ec2-user@${aws_instance.app_server.public_ip}"
}

output "app_url" {
  description = "URL to access the frontend"
  value       = "http://${aws_instance.app_server.public_ip}:5173"
}
