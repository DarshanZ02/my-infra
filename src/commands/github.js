const { saveGithubConfig, testGitHubConnection } = require("../services/githubService");

function githubConnectCommand(token, repo) {
  if (!token || !repo) {
    console.error("[Fail] -> Missing required params. Use:");
    console.error("   compliance-pilot github connect --token <TOKEN> --repo <owner/repo>");
    return;
  }

  saveGithubConfig(token, repo);
  console.log("[Done] -> GitHub token & repo saved to .env");
}

async function githubTestCommand() {
  console.log("[Test] -> Testing GitHub connection...");

  const result = await testGitHubConnection();

  if (result.success) {
    console.log("[Done] -> GitHub connection successful! Logged in as: ${result.username}");
  } else {
    console.error("[Fail] -> GitHub connection failed.");
    console.error("   Error:", result.error);
  }
}

module.exports = {
  githubConnectCommand,
  githubTestCommand,
};
