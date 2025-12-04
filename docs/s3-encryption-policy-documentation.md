# s3-encryption-policy
## Overview
The s3-encryption-policy ensures that all Amazon S3 buckets within an organization have default server-side encryption enabled, using either AES-256 or AWS Key Management Service (KMS). This policy is designed to protect sensitive data stored in S3 buckets by enforcing encryption at rest.

## Why this policy exists
This policy exists to address the security risk of storing unencrypted data in S3 buckets. By enforcing default encryption, organizations can prevent unauthorized access to sensitive data, maintain regulatory compliance, and protect against data breaches.

## What AWS risks it prevents
The s3-encryption-policy prevents the following AWS risks:
* Unauthorized access to sensitive data stored in S3 buckets
* Non-compliance with regulatory requirements for data encryption
* Data breaches due to unencrypted data at rest
* Financial and reputational losses resulting from data breaches

## Required AWS services
The following AWS services are required to implement this policy:
* Amazon S3
* AWS Key Management Service (KMS) (optional)
* IAM (for bucket policy management)

## Implementation summary
To implement this policy, the following steps must be taken:
1. Enable default server-side encryption for all S3 buckets using AES-256 or AWS KMS.
2. Restrict public access to S3 buckets.
3. Update bucket policies to deny unencrypted uploads.
4. Configure bucket-level Block Public Access settings.

## Audit checklist
The following items must be verified during an audit:
1. **Default Encryption**: Verify that default server-side encryption is enabled for all S3 buckets.
2. **Public Access**: Verify that public access is restricted for all S3 buckets.
3. **Bucket Policy**: Verify that bucket policies deny unencrypted uploads.
4. **Block Public Access**: Verify that bucket-level Block Public Access settings are enabled.

## Evidence required for auditors
The following evidence must be provided to auditors:
* S3 bucket configuration files showing default encryption enabled
* Bucket policy documents demonstrating denial of unencrypted uploads
* Screenshots of Block Public Access settings for each bucket
* AWS CloudTrail logs showing encryption and access control activities

## Before vs after compliance comparison
**Before Compliance:**
* S3 buckets may not have default encryption enabled
* Public access may not be restricted
* Bucket policies may not deny unencrypted uploads
* Data at rest may be vulnerable to unauthorized access

**After Compliance:**
* All S3 buckets have default server-side encryption enabled
* Public access is restricted for all S3 buckets
* Bucket policies deny unencrypted uploads
* Data at rest is protected by encryption and access controls

## Reviewer notes
Reviewers should verify that the s3-encryption-policy is implemented correctly and that all requirements are met. The following items should be checked:
* Are all S3 buckets configured with default server-side encryption?
* Are bucket policies updated to deny unencrypted uploads?
* Are Block Public Access settings enabled for all buckets?
* Is evidence provided to demonstrate compliance with the policy?