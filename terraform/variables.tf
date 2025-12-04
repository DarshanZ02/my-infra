variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "name_prefix" {
  description = "Prefix for resource names"
  type        = string
  default     = "compliance-pilot"
}

variable "tags" {
  description = "Common resource tags"
  type        = map(string)
  default     = {
    Project = "compliance-pilot"
    Env     = "test"
    Owner   = "cli"
  }
}