const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * Map CLI frameworks → Prowler flags
 */
function getFrameworkFlag(framework) {
  switch (framework.toLowerCase()) {
    case "hipaa":
      return "-f hipaa";

    case "soc2":
      return "-f soc_2";

    case "iso27001":
      return "-f iso_27001_2022";

    default:
      return "--service ec2 iam s3"; // FAST default scan
  }
}


/**
 * Run Prowler scan with optional framework filter
 */
function runProwlerScan(framework = "default") {
  return new Promise((resolve, reject) => {
    console.log(`[Scan] -> Starting Prowler scan (framework: ${framework})`);

    const scansDir = path.join(process.cwd(), "scans");
    if (!fs.existsSync(scansDir)) fs.mkdirSync(scansDir);

    const outputPath = path.join(scansDir, "latest-scan.asff.json");
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

    // Map input framework → Prowler framework names
    const fwMap = {
      hipaa: "hipaa_aws",
      soc2: "soc2_aws",
      iso27001: "iso27001_2022_aws",
      default: null
    };

    const complianceFlag = fwMap[framework] || null;

    const args = [
      "run",
      "--rm",

      "-e", `AWS_ACCESS_KEY_ID=${process.env.AWS_ACCESS_KEY_ID}`,
      "-e", `AWS_SECRET_ACCESS_KEY=${process.env.AWS_SECRET_ACCESS_KEY}`,
      "-e", `AWS_DEFAULT_REGION=us-east-1`,

      "-v", `${scansDir}:/home/prowler/output`,

      "toniblyx/prowler:latest",

      "aws",
      "-M", "json-asff",
      "--no-banner",
      "--output-file", "latest-scan",
    ];

    // Add compliance framework
    if (complianceFlag) {
      args.push("--compliance", complianceFlag);
    } else {
      // Default fast scan
      args.push("--service", "ec2", "iam", "s3");
    }

    const proc = spawn("docker", args);

    proc.stdout.on("data", (d) => console.log(d.toString()));
    proc.stderr.on("data", (d) => console.error(d.toString()));

    proc.on("close", (code) => {
      if (code !== 0 && code !== 3) {
        return reject(new Error(`Prowler exited with ${code}`));
      }

      console.log(`[Done] -> Scan saved to: ${outputPath}`);
      resolve(outputPath);
    });
  });
}



/**
 * Load parsed ASFF results
 */
function loadProwlerResults() {
  const filePath = path.join("scans", "latest-scan.asff.json");

  if (!fs.existsSync(filePath)) {
    console.error("[Fail] -> No scan file found:", filePath);
    return [];
  }

  try {
    let raw = fs.readFileSync(filePath, "utf-8").trim();

    if (!raw.startsWith("[")) {
      raw = "[" + raw.replace(/}\s*{/g, "},{") + "]";
    }

    const data = JSON.parse(raw);

    console.log(`[Done] -> Parsed ${data.length} findings.`);

    return data.map(f => ({
      Severity: f.Severity?.Label || "UNKNOWN",
      Status: f.Compliance?.Status || "UNKNOWN",
      CheckTitle: f.Title || "Unknown",
      ResourceId: f.Resources?.[0]?.Id || "Unknown",
      Description: f.Description || "",
      Raw: f
    }));

  } catch (err) {
    console.error("[Fail] -> Failed to parse ASFF:", err.message);
    return [];
  }
}

module.exports = { runProwlerScan, loadProwlerResults };
