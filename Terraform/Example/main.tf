#Terraform and Provider  Configuration
terraform {
  required_version = ">= 0.14.9"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
}

provider "aws" {
  region = "ap-east-1"
}

# 1.1_Define VPC
resource "aws_vpc" "hk_vpc1_devops" {
  cidr_block = "10.32.0.0/16"
  instance_tenancy = "default"
  
  tags = {
    Project = "AppProject1"
    Name    = "hk_vpc1_devops"
  }
}

# 1.2_Define Subnet PUBLIC
resource "aws_subnet" "hk_subnet_public_01" {
  vpc_id     = aws_vpc.hk_vpc1_devops.id
  cidr_block = "10.32.1.0/24"
  availability_zone = "ap-east-1a"
  map_public_ip_on_launch = true
  
  tags = {
    Name        = "hk_subnet_public_01"
    Description = "Subnet for Front-End Web Server, Project App01"
  }
}

# 1.3_Define Subnet PRIVATE
resource "aws_subnet" "hk_subnet_private_01" {
  vpc_id     = aws_vpc.hk_vpc1_devops.id
  cidr_block = "10.32.2.0/24"
  availability_zone = "ap-east-1a"
  map_public_ip_on_launch = false
  
  tags = {
    Name        = "hk_subnet_private_01"
    Description = "Subnet for CoreAPI, DB Server, Project App01"
  }
}

# 2.1 Define AWS Key Pair
resource "aws_key_pair" "devops1" {
  key_name   = "DEVOPS1"
  public_key = tls_private_key.devops1.public_key_openssh
}

# 2.2 Generate a TLS Private Key
resource "tls_private_key" "devops1" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

# 2.3 Output the Private Key to be saved locally
output "private_key_pem" {
  value       = tls_private_key.devops1.private_key_pem
  description = "The private key in PEM format. Save this key to a .pem file to use it for SSH."
  sensitive   = true
}

# 3.1_Define Security Group
resource "aws_security_group" "hk_sg_Default_DEVOPS" {
  vpc_id      = aws_vpc.hk_vpc1_devops.id
  name        = "Default_DEVOPS"
  description = "Default DEVOPS LAB Security Group"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 2375
    to_port     = 2377
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Cluster Management Comm, Docker"
  }

  ingress {
    from_port   = 2380
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "k8s master node, k8s worker node"
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3005
    to_port     = 3005
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 31080
    to_port     = 31080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 4789
    to_port     = 4789
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Overlay network traffic"
  }

  ingress {
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "k8s master node"
  }

  ingress {
    from_port   = 7946
    to_port     = 7946
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Comm among nodes"
  }

  ingress {
    from_port   = 7946
    to_port     = 7946
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Comm among nodes"
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 10250
    to_port     = 10250
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "k8s master/worker node"
  }

  ingress {
    from_port   = 10257
    to_port     = 10259
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "k8s master node"
  }

  ingress {
    from_port   = -1
    to_port     = -1
    protocol    = "icmp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "Default_DEVOPS"
  }
}

# 4.1_Define new EC2 MASTER
resource "aws_instance" "master" {
  ami           = "ami-0f2ea204cd818ce8e"
  instance_type = "t3.micro"
  key_name      = "DEVOPS1"
  ebs_optimized = true
  source_dest_check = false

  subnet_id                   = aws_subnet.hk_subnet_public_01.id
  associate_public_ip_address = true
  vpc_security_group_ids      = [aws_security_group.hk_sg_Default_DEVOPS.id]

  tags = {
    Name = "MASTER"
  }
}

# 4.2_Define new EC2 WORKER1 (t3.medium)
resource "aws_instance" "worker1" {
  ami           = "ami-0f2ea204cd818ce8e"
  instance_type = "t3.medium"
  key_name      = "DEVOPS1"
  ebs_optimized = true
  source_dest_check = false

  subnet_id                   = aws_subnet.hk_subnet_public_01.id
  associate_public_ip_address = true
  vpc_security_group_ids      = [aws_security_group.hk_sg_Default_DEVOPS.id]

  tags = {
    Name = "WORKER1"
  }
}

# 4.3_Define new EC2 JENKINS
resource "aws_instance" "jenkins" {
  ami           = "ami-0f2ea204cd818ce8e"
  instance_type = "t3.micro"
  key_name      = "DEVOPS1"
  ebs_optimized = true
  source_dest_check = false

  subnet_id                   = aws_subnet.hk_subnet_public_01.id
  associate_public_ip_address = true
  vpc_security_group_ids      = [aws_security_group.hk_sg_Default_DEVOPS.id]

  tags = {
    Name = "JENKINS"
  }
}