# s3-encryption-policy
========================

## Overview
The `s3-encryption-policy` ensures that all S3 buckets enforce server-side encryption using AES-256 or AWS KMS to protect stored data against unauthorized access. This policy aligns with the SOC2 and ISO27001 frameworks, specifically addressing logical and physical access controls, as well as cryptographic controls.

## Why this policy exists
This policy exists to mitigate the risk of data breaches and unauthorized access to sensitive information stored in S3 buckets. By enforcing server-side encryption, we can ensure that data is protected at rest, reducing the risk of data compromise in the event of unauthorized access.

## What AWS risks it prevents
This policy prevents the following AWS risks:

* Unauthorized access to sensitive data stored in S3 buckets
* Data breaches due to unencrypted data at rest
* Non-compliance with regulatory requirements related to data encryption

## Required AWS services
The following AWS services are required to implement this policy:

* Amazon S3
* AWS Key Management Service (KMS) (optional)

## Implementation summary
To implement this policy, follow these steps:

1. Enable server-side encryption on all S3 buckets using AES-256 or AWS KMS.
2. Configure bucket policies to deny uploads of unencrypted objects.
3. Implement automatic flagging of unencrypted S3 buckets during compliance scans.

 Remediation steps can be performed using the AWS CLI or console:

* AWS CLI: `aws s3api put-bucket-encryption --bucket <bucket-name> --server-side-encryption-configuration '{\"Rules\":[{\"ApplyServerSideEncryptionByDefault\":{\"SSEAlgorithm\":\"AES256\"}}]}'`
* AWS Console: Navigate to S3 → Choose Bucket → Properties → Default Encryption → Enable AES-256 or KMS.

## Audit checklist
The following items should be verified during an audit:

1. All S3 buckets have server-side encryption enabled.
2. Buckets enforce encryption using AES-256 or AWS-KMS keys.
3. Unencrypted S3 buckets are auto-flagged during compliance scans.
4. Bucket policies deny uploads of unencrypted objects.

## Evidence required for auditors
The following evidence is required to demonstrate compliance with this policy:

* S3 bucket configuration and encryption settings
* Bucket policies and access controls
* Compliance scan reports showing auto-flagging of unencrypted buckets

## Before vs after compliance comparison
**Before Compliance:**

* S3 buckets may not have server-side encryption enabled, leaving data vulnerable to unauthorized access.
* Unencrypted data may be stored in S3 buckets, increasing the risk of data breaches.

**After Compliance:**

* All S3 buckets have server-side encryption enabled using AES-256 or AWS KMS.
* Unencrypted S3 buckets are auto-flagged during compliance scans, ensuring prompt remediation.
* Bucket policies deny uploads of unencrypted objects, preventing unauthorized access to sensitive data.

## Reviewer notes
Reviewers should verify that all S3 buckets are properly configured with server-side encryption and that bucket policies are in place to deny uploads of unencrypted objects. Additionally, reviewers should confirm that compliance scans are regularly performed to detect and flag unencrypted buckets. Any deviations from this policy should be documented and addressed promptly to ensure ongoing compliance with regulatory requirements.