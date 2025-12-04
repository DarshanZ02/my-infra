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
  .option("--framework <name>", "Compliance framework (hipaa, soc2, iso27001)")
  .description("Run Prowler AWS compliance scan")
  .action((options) => scanAwsCommand(options.framework));


// ----------------------------------------------------
// FINDINGS COMMAND
// ----------------------------------------------------
const findingsCmd = program.command("findings").description("View findings from latest scan");
const { findingsListCommand } = require("./commands/findings-list");

findingsCmd
  .command("list")
  .option("--resource <type>", "Filter by resource type (s3, ec2, iam)")
  .description("List parsed findings from the latest scan")
  .action(findingsListCommand);


// ----------------------------------------------------
// FIX COMMANDS
// ----------------------------------------------------
const fixCmd = program.command("fix").description("Fix AWS compliance issues");
const { fixAwsCommand } = require("./commands/fix");
const { fixGenerateCommand } = require("./commands/fix-generate");

fixCmd.command("run")
  .description("Generate AI remediation for ALL failed checks")
  .action(fixAwsCommand);

fixCmd.command("generate")
  .requiredOption("--resource <id>")
  .requiredOption("--issue <keyword>")
  .description("Fix one specific issue")
  .action(fixGenerateCommand);


// ----------------------------------------------------
// DOCS COMMANDS
// ----------------------------------------------------
const docsCmd = program.command("docs").description("Documentation generator");
const { docsGenerateCommand } = require("./commands/docs-generate");

docsCmd.command("generate")
  .requiredOption("--policy <name>")
  .description("Generate documentation from policy template")
  .action(docsGenerateCommand);


// ----------------------------------------------------
// POLICY COMMANDS
// ----------------------------------------------------
const policyCmd = program.command("policy").description("Policy generation");
const { policyExportCommand } = require("./commands/policy-export");

policyCmd.command("export")
  .requiredOption("--from-comp-ai")
  .requiredOption("--type <template>")
  .description("Export policy from Comp AI template")
  .action(policyExportCommand);


// ----------------------------------------------------
// PARSE CLI
// ----------------------------------------------------
program.parse(process.argv);
