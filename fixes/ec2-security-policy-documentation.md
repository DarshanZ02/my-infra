# EC2 Security Policy
## Overview
The EC2 Security Hardening Policy, identified as `ec2-security`, is designed to ensure that all EC2 instances within an AWS environment adhere to the highest standards of security as recommended by AWS best practices. This policy encompasses several critical security controls, including the enforcement of IMDSv2, the use of IAM instance profiles, restricted SSH access, controlled public IP assignments, and the enablement of detailed monitoring for enhanced visibility.

## Why this policy exists
This policy exists to mitigate common security risks associated with EC2 instances, such as unauthorized access, data breaches, and lack of visibility into instance activity. By enforcing these security controls, organizations can significantly reduce their exposure to threats and ensure compliance with internal security policies and external regulatory requirements.

## What AWS risks it prevents
The `ec2-security` policy prevents several AWS-related risks, including:
- **Unauthenticated access**: By enforcing IMDSv2 and using IAM instance profiles, the policy minimizes the risk of unauthorized access to EC2 instances.
- **Data breaches**: Restricting SSH access to the internet and controlling public IP assignments reduce the attack surface for potential data breaches.
- **Lack of visibility**: Enabling detailed monitoring provides comprehensive insights into EC2 instance activity, facilitating timely detection and response to security incidents.

## Required AWS services
The implementation of this policy requires the following AWS services:
- **EC2**: For creating and managing instances.
- **IAM**: For creating and managing instance profiles and roles.
- **VPC**: For configuring security groups and network settings.
- **CloudWatch**: For enabling detailed monitoring.

## Implementation summary
To implement this policy, follow these high-level steps:
1. **Configure IMDSv2** on all EC2 instances to ensure secure access to instance metadata.
2. **Assign IAM instance profiles** to EC2 instances to manage access without exposing long-lived credentials.
3. **Restrict security group rules** to prevent SSH access from the internet.
4. **Control public IP assignments** by tagging instances with appropriate justifications.
5. **Enable CloudWatch detailed monitoring** for enhanced visibility into instance activity.

## Audit checklist
The following checklist should be used to audit compliance with the `ec2-security` policy:
- Are all EC2 instances configured to enforce IMDSv2?
- Do all EC2 instances have an assigned IAM instance profile?
- Are security groups configured to restrict SSH access (port 22) from the internet?
- Are EC2 instances with public IPs properly justified and tagged?
- Is detailed monitoring enabled for all EC2 instances?

## Evidence required for auditors
To demonstrate compliance, provide the following evidence:
- Configuration records showing IMDSv2 enforcement on all EC2 instances.
- IAM instance profile assignments for all EC2 instances.
- Security group configurations restricting SSH access.
- Justification tags for EC2 instances with public IPs.
- CloudWatch monitoring settings for all EC2 instances.

## Before vs after compliance comparison
**Before Compliance:**
- EC2 instances may be vulnerable to unauthorized access and data breaches.
- Lack of visibility into instance activity hinders security incident detection and response.
- Non-compliance with security best practices and regulatory requirements may lead to fines and reputational damage.

**After Compliance:**
- EC2 instances are secured with IMDSv2, restricted SSH access, and IAM instance profiles.
- Detailed monitoring provides comprehensive visibility into instance activity.
- Compliance with security best practices and regulatory requirements reduces the risk of fines and reputational damage.

## Reviewer notes
When reviewing this policy, consider the following:
- Ensure that all requirements and controls are relevant and up-to-date with the latest AWS security best practices.
- Evaluate the effectiveness of the policy in reducing security risks and ensuring compliance.
- Consider feedback from stakeholders and incorporate necessary updates to maintain the policy's relevance and efficacy.
- Schedule regular reviews to ensure ongoing compliance and adapt to changing security landscapes.