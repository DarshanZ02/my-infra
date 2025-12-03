const { loadProwlerResults } = require("../services/prowlerService");
const { generateFixForCheck } = require("../services/fixService");

async function fixAwsCommand() {
  console.log("🛠️ Generating AI-based remediation steps...");

  const results = loadProwlerResults();
  if (!results.length) {
    console.log("❌ No scan results found. Run scan first.");
    return;
  }

  const failed = results.filter(r => r.Status === "FAILED");
  console.log(`Found ${failed.length} failed checks.`);

  console.log("\n🔧 Fixing first 5 issues...\n");

  for (let i = 0; i < Math.min(5, failed.length); i++) {
    const issue = failed[i];

    console.log("\n==============================");
    console.log(`➡️ FIX FOR: ${issue.CheckTitle} [${issue.Severity}]`);
    console.log("==============================");

    const fix = await generateFixForCheck(issue);
    console.log(fix);
  }

  console.log("\n🎉 Fix suggestions generated successfully!");
}

module.exports = { fixAwsCommand };
