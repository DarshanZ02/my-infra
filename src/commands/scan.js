const { runProwlerScan, loadProwlerResults } = require("../services/prowlerService");

 /* Full AWS scan with optional frameworks */
 
async function scanAwsCommand(framework = "default") {
  console.log(`[Scan] -> Running AWS scan using framework: ${framework}`);

  try {
    const output = await runProwlerScan(framework);
    console.log(`[Done] -> Scan completed: ${output}`);

    const results = loadProwlerResults();

    console.log(`\nTotal Findings: ${results.length}`);
  } catch (e) {
    console.log("[Fail] -> Scan failed:", e.message);
  }
}


module.exports = { scanAwsCommand };
