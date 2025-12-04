const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const path = require("path");

function saveGithubConfig(token, repo) {
  const envContent =
    `GITHUB_TOKEN=${token}\n` +
    `GITHUB_REPO=${repo}\n`;

  fs.appendFileSync(".env", envContent, { flag: "a" });
  return true;
}

function createGitHubClient() {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("GitHub token missing. Run: compliance-pilot github connect");
  }

  return new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
}

async function testGitHubConnection() {
  try {
    const client = createGitHubClient();
    const { data } = await client.rest.users.getAuthenticated();

    return {
      success: true,
      username: data.login,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Create a GitHub Pull Request
 */
async function createPullRequest(branchName, filePath, prTitle, prBody) {
  const client = createGitHubClient();
  const [owner, repo] = process.env.GITHUB_REPO.split("/");

  // Get the latest commit SHA from main
  const { data: mainRef } = await client.git.getRef({
    owner,
    repo,
    ref: "heads/main",
  });

  const baseSha = mainRef.object.sha;

  // If branch exists → delete it safely
  try {
    await client.git.getRef({
      owner,
      repo,
      ref: `heads/${branchName}`,
    });

    console.log(`[Branch Deleted] -> Branch already exists. Deleting: ${branchName}`);

    await client.git.deleteRef({
      owner,
      repo,
      ref: `heads/${branchName}`,
    });
  } catch (err) {
    console.log(`[Branch Created] -> Branch does not exist. Creating new one...`);
  }

  // Create the new branch
  await client.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: baseSha,
  });

  // Prepare commit with fix file content
  const fileContent = fs.readFileSync(filePath, "utf8");
  const encoded = Buffer.from(fileContent).toString("base64");

  await client.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: `fixes/${path.basename(filePath)}`,
    message: `Add fix file for ${branchName}`,
    content: encoded,
    branch: branchName,
  });

  // Create PR
  const pr = await client.pulls.create({
    owner,
    repo,
    title: prTitle,
    body: prBody,
    head: branchName,
    base: "main",
  });

  console.log(`[PR Created] -> Pull Request Created: ${pr.data.html_url}`);
}


module.exports = {
  saveGithubConfig,
  testGitHubConnection,
  createPullRequest,
};
