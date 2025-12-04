locals {
  bucket_name = "${var.name_prefix}-tf-bucket-${random_id.suffix.hex}"
}

resource "random_id" "suffix" {
  byte_length = 2
}

# S3 bucket (secure defaults)
resource "aws_s3_bucket" "test" {
  bucket = local.bucket_name
  tags   = var.tags
}

resource "aws_s3_bucket_public_access_block" "test" {
  bucket                  = aws_s3_bucket.test.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "test" {
  bucket = aws_s3_bucket.test.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "test" {
  bucket = aws_s3_bucket.test.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# IAM user with very limited permissions (no access key created)
resource "aws_iam_user" "readonly" {
  name = "${var.name_prefix}-readonly"
  tags = var.tags
}

resource "aws_iam_policy" "readonly_policy" {
  name        = "${var.name_prefix}-readonly"
  description = "Read-only access to S3 bucket"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect   = "Allow",
      Action   = ["s3:Get*", "s3:List*"],
      Resource = [
        aws_s3_bucket.test.arn,
        "${aws_s3_bucket.test.arn}/*"
      ]
    }]
  })
}

resource "aws_iam_user_policy_attachment" "attach" {
  user       = aws_iam_user.readonly.name
  policy_arn = aws_iam_policy.readonly_policy.arn
}

# Security group (no inbound by default)
resource "aws_security_group" "default" {
  name        = "${var.name_prefix}-sg"
  description = "Default SG with no inbound"
  vpc_id      = data.aws_vpc.default.id
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = var.tags
}

data "aws_vpc" "default" {
  default = true
}

output "s3_bucket_name" {
  value = aws_s3_bucket.test.bucket
}
output "iam_user_name" {
  value = aws_iam_user.readonly.name
}
output "security_group_id" {
  value = aws_security_group.default.id
}