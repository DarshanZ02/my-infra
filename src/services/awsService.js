
const { STSClient, GetCallerIdentityCommand } = require('@aws-sdk/client-sts');


 /* Create an STS client using default credential provider chain.*/
function createStsClient() {
  // If region not set, fallback to 'us-east-1'
  const region = process.env.AWS_REGION || 'us-east-1';

  return new STSClient({
    region,
    // Credentials will be picked automatically from:
    // - env vars
    // - shared credentials file (~/.aws/credentials)
    // - etc.
  });
}


 /* Test AWS connection by calling STS GetCallerIdentity.*/
 
async function testAwsConnection() {
  const client = createStsClient();

  try {
    const command = new GetCallerIdentityCommand({});
    const response = await client.send(command);

    // Example response:
    // { UserId, Account, Arn }
    return {
      success: true,
      accountId: response.Account,
      arn: response.Arn,
      userId: response.UserId,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || String(error),
    };
  }
}

module.exports = {
  testAwsConnection,
};
