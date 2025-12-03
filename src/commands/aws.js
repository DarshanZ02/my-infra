// src/commands/aws.js
const { testAwsConnection } = require('../services/awsService');

async function awsTestCommand() {
  console.log('🔍 Testing AWS connection using STS get-caller-identity...');

  const result = await testAwsConnection();

  if (result.success) {
    console.log('✅ AWS connection successful!');
    console.log(`   Account ID: ${result.accountId}`);
    console.log(`   ARN:        ${result.arn}`);
    console.log(`   User ID:    ${result.userId}`);
  } else {
    console.error('❌ AWS connection failed.');
    console.error('   Error:', result.error);
    process.exitCode = 1;
  }
}

module.exports = {
  awsTestCommand,
};
