const { saveGithubConfig, testGitHubConnection } = require("../services/githubService");

function githubConnectCommand(token, repo) {
  if (!token || !repo) {
    console.error("❌ Missing required params. Use:");
    console.error("   compliance-pilot github connect --token <TOKEN> --repo <owner/repo>");
    return;
  }

  saveGithubConfig(token, repo);
  console.log("✅ GitHub token & repo saved to .env");
}

async function githubTestCommand() {
  console.log("🔍 Testing GitHub connection...");

  const result = await testGitHubConnection();

  if (result.success) {
    console.log(`✅ GitHub connection successful! Logged in as: ${result.username}`);
  } else {
    console.error("❌ GitHub connection failed.");
    console.error("   Error:", result.error);
  }
}

module.exports = {
  githubConnectCommand,
  githubTestCommand,
};
