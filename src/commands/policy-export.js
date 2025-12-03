const fs = require("fs");
const path = require("path");

/**
 * Handles: compliance-pilot policy export --from-comp-ai --type s3-encryption
 */
async function policyExportCommand(options) {
  console.log("📦 Exporting policy from Comp AI templates...");

  const templateType = options.type;

  console.log(`→ Type: ${templateType}`);

  // Map template types to Comp AI files
  const templatesMap = {
    "s3-encryption": "FrameworkEditorPolicyTemplate.json",
    "iam-role": "FrameworkEditorControlTemplate.json",
    "backup-policy": "FrameworkEditorFramework.json",
  };

  const templateFile = templatesMap[templateType];

  if (!templateFile) {
    console.error("❌ Unknown policy type. Supported types:");
    console.error("- s3-encryption");
    console.error("- iam-role");
    console.error("- backup-policy");
    return;
  }

  // Path to Comp AI seed data (simulated folder)
  const compAiFolder = path.join(process.cwd(), "comp-ai-seed");

  const fullPath = path.join(compAiFolder, templateFile);

  if (!fs.existsSync(fullPath)) {
    console.error("❌ Template file not found:");
    console.error(fullPath);
    console.error("\n📌 Create folder: comp-ai-seed/");
    console.error("And place Comp AI templates inside it.");
    return;
  }

  const outputDir = path.join(process.cwd(), "policies");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const policyOutputFile = path.join(outputDir, `${templateType}-policy.json`);

  const jsonData = fs.readFileSync(fullPath, "utf8");

  fs.writeFileSync(policyOutputFile, jsonData, "utf8");

  console.log(`\n✅ Policy exported successfully!`);
  console.log(`📄 Saved to: ${policyOutputFile}`);
}

module.exports = { policyExportCommand };
