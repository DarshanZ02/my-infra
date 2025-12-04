import { readFileSync } from "fs";
import path from "path";
import chalk from "chalk";

export const findingsListCommand = async (opts = {}) => {
  try {
    const scanPath = path.join(process.cwd(), "scans/latest-scan.asff.json");

    console.log(chalk.blue("[Findings] -> Loading latest scan results..."));

    const file = readFileSync(scanPath, "utf-8");
    const json = JSON.parse(file);

    const resourceFilter = opts.resource?.toLowerCase();

    // Extract findings
    const findings = json || [];

    const filtered = resourceFilter
      ? findings.filter(f =>
          f?.Resources?.some(r =>
            (r.Type || "").toLowerCase().includes(resourceFilter)
          )
        )
      : findings;

    if (filtered.length === 0) {
      console.log(chalk.yellow("No findings matched your filter."));
      return;
    }

    console.log(chalk.green(`\n=== Findings (${filtered.length}) ===`));

    filtered.forEach((f, idx) => {
      const title = f.Title || "Untitled Issue";
      const severity = f.Severity?.Label || "UNKNOWN";
      const res = f.Resources?.map(r => r.Id).join(", ") || "Unknown Resource";

      console.log(chalk.cyan(`\n${idx + 1}. ${title}`));
      console.log(chalk.white(`   Severity: ${severity}`));
      console.log(chalk.white(`   Resource: ${res}`));
    });

    console.log(chalk.green("\n[Done] -> Findings listed successfully.\n"));
  } catch (err) {
    console.error(chalk.red("[Error] -> Error listing findings: "), err);
  }
};
