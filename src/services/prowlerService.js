const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

//
// RUN PROWLER FAST SCAN (EC2 + IAM + S3)
//
function runProwlerScan() {
  return new Promise((resolve, reject) => {
    console.log("🚀 Starting FAST Prowler scan (EC2 + IAM + S3)...");

    const scansDir = path.join(process.cwd(), "scans");
    if (!fs.existsSync(scansDir)) fs.mkdirSync(scansDir);

    const outputName = "latest-scan.asff.json";
    const outputPath = path.join(scansDir, outputName);

    // Delete old output file
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

    const args = [
      "run",
      "--rm",

      "-e", `AWS_ACCESS_KEY_ID=${process.env.AWS_ACCESS_KEY_ID}`,
      "-e", `AWS_SECRET_ACCESS_KEY=${process.env.AWS_SECRET_ACCESS_KEY}`,
      "-e", `AWS_DEFAULT_REGION=us-east-1`,

      "-v", `${scansDir}:/home/prowler/output`,

      "toniblyx/prowler:latest",

      // REAL WORKING FAST SCAN COMMAND
      "aws",
      "--service", "ec2", "iam", "s3",
      "-M", "json-asff",
      "--no-banner",
      "--output-file", "latest-scan"
    ];

    const proc = spawn("docker", args);

    proc.stdout.on("data", (d) => console.log(d.toString()));
    proc.stderr.on("data", (d) => console.error(d.toString()));

    proc.on("close", (code) => {
      // Exit code 3 = scan completed but findings exist → NOT an error
      if (code !== 0 && code !== 3) {
        return reject(new Error(`Prowler exited with ${code}`));
      }

      console.log(`✅ Scan saved to: ${outputPath}`);
      resolve(outputPath);
    });
  });
}

//
// PARSE ASFF OUTPUT
//
function loadProwlerResults() {
  const filePath = path.join("scans", "latest-scan.asff.json");

  if (!fs.existsSync(filePath)) {
    console.error("❌ No scan file found:", filePath);
    return [];
  }

  try {
    let raw = fs.readFileSync(filePath, "utf-8").trim();

    if (!raw.startsWith("[")) {
      console.warn("⚠️ Unexpected ASFF format. Trying to recover…");
      raw = "[" + raw.replace(/}\s*{/g, "},{") + "]";
    }

    const data = JSON.parse(raw);
    console.log(`📄 Parsed ${data.length} ASFF findings.`);

    return data.map((f) => ({
      Severity: f.Severity?.Label || "UNKNOWN",
      Status: f.Compliance?.Status || "UNKNOWN",
      CheckTitle: f.Title || "Unknown",
      ResourceId: f.Resources?.[0]?.Id || "Unknown",
      Description: f.Description || "",
      Raw: f,
    }));

  } catch (err) {
    console.error("❌ Failed to parse ASFF JSON:", err.message);
    return [];
  }
}

module.exports = { runProwlerScan, loadProwlerResults };
