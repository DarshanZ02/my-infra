const { runProwlerScan, loadProwlerResults } = require("../services/prowlerService");

/**
 * -------------------------------
 *  FULL AWS ACCOUNT SCAN
 * -------------------------------
 */
async function scanAwsCommand() {
  console.log("🔍 Running Prowler AWS Compliance Scan...");

  try {
    const output = await runProwlerScan();
    console.log(`✅ Scan completed: ${output}`);

    const results = loadProwlerResults();

    if (!results.length) {
      console.log("❌ No findings parsed.");
      return;
    }

    const failed = results.filter(r => r.Status === "FAILED");

    console.log("\n=== 📊 Summary ===");
    console.log(`Total Findings: ${results.length}`);
    console.log(`Failed: ${failed.length}`);

    console.log("\n=== ❌ Top 10 Failed Checks ===");
    failed.slice(0, 10).forEach(f => {
      console.log(`- [${f.Severity}] ${f.CheckTitle} (${f.ResourceId})`);
    });

  } catch (err) {
    console.error("❌ Scan failed:", err.message);
  }
}


/**
 * -------------------------------
 *  RE-SCAN SINGLE AWS RESOURCE
 *  (STEP 5 FROM TASK PDF)
 * -------------------------------
 */
async function scanAwsResourceCommand(resourceId) {
  console.log(`🔍 Re-scanning AWS for resource: ${resourceId}`);

  const results = loadProwlerResults();
  if (!results.length) {
    console.error("❌ No previous scan found. Run: compliance-pilot scan aws");
    return;
  }

  // Filter findings for this resource
  const matches = results.filter(r =>
    r.ResourceId.toLowerCase().includes(resourceId.toLowerCase())
  );

  if (!matches.length) {
    console.log("✅ No findings for this resource. It appears compliant.");
    return;
  }

  const failed = matches.filter(m => m.Status === "FAILED");

  if (!failed.length) {
    console.log("🎉 Resource is now FULLY COMPLIANT ✓");
    return;
  }

  console.log(`\n❌ STILL NON-COMPLIANT (${failed.length} issues):\n`);
  failed.forEach(f => {
    console.log(`- [${f.Severity}] ${f.CheckTitle}`);
  });

  console.log("\n📌 Apply fix again or check GitHub PR.\n");
}


module.exports = {
  scanAwsCommand,
  scanAwsResourceCommand,
};
