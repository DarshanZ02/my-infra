#!/usr/bin/env node

const { Command } = require("commander");
const dotenv = require("dotenv");

// Load env
dotenv.config();

const program = new Command();

program
  .name("compliance-pilot")
  .description("CompliancePilot CLI - AWS compliance helper")
  .version("0.1.0");

// ----------------------------------------------------
// AWS COMMANDS
// ----------------------------------------------------
const awsCmd = program.command("aws").description("AWS related commands");
const { awsTestCommand } = require("./commands/aws");

awsCmd
  .command("test")
  .description("Test AWS connection using STS get-caller-identity")
  .action(awsTestCommand);

// ----------------------------------------------------
// GITHUB COMMANDS
// ----------------------------------------------------
const githubCmd = program.command("github").description("GitHub related commands");
const { githubConnectCommand, githubTestCommand } = require("./commands/github");

githubCmd
  .command("connect")
  .requiredOption("--token <token>")
  .requiredOption("--repo <owner/repo>")
  .description("Store GitHub token and repo")
  .action((options) => githubConnectCommand(options.token, options.repo));

githubCmd
  .command("test")
  .description("Test GitHub API access")
  .action(githubTestCommand);

// ----------------------------------------------------
// SCAN COMMANDS
// ----------------------------------------------------
const scanCmd = program.command("scan").description("Compliance scanning commands");
const { scanAwsCommand } = require("./commands/scan");

scanCmd
  .command("aws")
  .description("Run Prowler AWS compliance scan")
  .action(scanAwsCommand);

// ----------------------------------------------------
// FIX COMMANDS
// ----------------------------------------------------
const fixCmd = program.command("fix").description("Fix AWS compliance issues");

const { fixAwsCommand } = require("./commands/fix");

// → fix run
fixCmd
  .command("run")
  .description("Generate AI remediation steps for all failed checks")
  .action(fixAwsCommand);

// → fix generate
const { fixGenerateCommand } = require("./commands/fix-generate");

fixCmd
  .command("generate")
  .requiredOption("--resource <id>", "Resource ID (EC2, IAM, etc.)")
  .requiredOption("--issue <keyword>", "Issue keyword (ssh, public-ip, encryption)")
  .description("Generate a targeted fix for one resource + issue")
  .action((options) => {
    fixGenerateCommand(options);
  });


  // ------------------- DOCS COMMANDS -------------------
const docsCmd = program.command("docs").description("Documentation generator");

const { docsGenerateCommand } = require("./commands/docs-generate");

docsCmd
  .command("generate")
  .requiredOption("--policy <name>", "Policy name to generate documentation for")
  .description("Generate documentation from Comp AI policy template")
  .action(docsGenerateCommand);


// ------------------- POLICY COMMANDS -------------------
const policyCmd = program.command("policy").description("Policy generation commands");

const { policyExportCommand } = require("./commands/policy-export");

policyCmd
  .command("export")
  .requiredOption("--from-comp-ai", "Export policy from Comp AI template")
  .requiredOption("--type <template>", "Policy template type (e.g., s3-encryption, iam-role, backup-policy)")
  .description("Export a policy JSON file from Comp AI policy templates")
  .action(policyExportCommand);


// ----------------------------------------------------
// PARSE CLI
// ----------------------------------------------------
program.parse(process.argv);
