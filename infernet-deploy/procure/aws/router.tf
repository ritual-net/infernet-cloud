# Infernet Router
resource "aws_instance" "infernet_router" {
  count                  = var.router.deploy ? 1 : 0
  ami                    = var.router.image
  instance_type          = var.router.machine_type
  subnet_id              = aws_subnet.node_subnet[var.router.zone].id
  vpc_security_group_ids = [aws_security_group.security_group.id]

  # Startup script
  user_data = templatefile("${path.module}/scripts/router.tpl", {
    region       = var.region,
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
  count = var.router.deploy ? 1 : 0
  tags = {
    Name = "router-eip-${var.name}"
  }
}

# Use association to break eip -> security group -> router cycle
resource "aws_eip_association" "eip_assoc" {
  count         = var.router.deploy ? 1 : 0
  instance_id   = aws_instance.infernet_router[0].id
  allocation_id = aws_eip.router_eip[0].id
}
