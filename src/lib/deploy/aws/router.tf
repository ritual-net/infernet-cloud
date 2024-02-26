# Infernet Router
resource "aws_instance" "infernet_router" {
  count           = var.deploy_router ? 1 : 0
  ami             = "ami-07b36ea9852e986ad"
  instance_type   = "t2.micro"
  subnet_id       = aws_subnet.node_subnet.id
  vpc_security_group_ids = [ aws_security_group.security_group.id ]

  # Startup script
  user_data = templatefile("${path.module}/scripts/router.tpl", {
    region = var.region,
    cluster-name = var.name
  })

  root_block_device {
    volume_size = 200
  }

  # IAM Role
  iam_instance_profile = aws_iam_instance_profile.instance_profile.name

  # Stopping condition
  disable_api_termination = var.is_production ? true : false

  tags = {
    Name = "router-${var.name}"
  }
}

# Router IP
resource "aws_eip" "router_eip" {
  count = var.deploy_router ? 1 : 0
  tags = {
    Name = "router-eip-${var.name}"
  }
}

# Use association to break eip -> security group -> router cycle
resource "aws_eip_association" "eip_assoc" {
  count         = var.deploy_router ? 1 : 0
  instance_id   = aws_instance.infernet_router[0].id
  allocation_id = aws_eip.router_eip[0].id
}
