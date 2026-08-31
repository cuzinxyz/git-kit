const { spawnSync } = require("node:child_process");
const ui = require("./ui");

function git(args, opts = {}) {
  const res = spawnSync("git", args, {
    encoding: "utf8",
    stdio: opts.stdio || ["inherit", "pipe", "pipe"],
    cwd: opts.cwd,
  });
  if (res.error) {
    ui.error(`Failed to run git: ${res.error.message}`);
    process.exit(1);
  }
  return res;
}

function run(args) {
  const res = git(args, { stdio: "inherit" });
  if (res.status !== 0) process.exit(res.status === null ? 1 : res.status);
  return res.status;
}

function out(args) {
  return git(args).stdout.trim();
}

function ok(args) {
  return git(args).status === 0;
}

function isRepo() {
  const res = spawnSync("git", ["rev-parse", "--is-inside-work-tree"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return res.status === 0 && res.stdout.trim() === "true";
}

function requireRepo() {
  if (!isRepo()) {
    ui.error("Not inside a git repository.");
    process.exit(1);
  }
}

function currentBranch() {
  return out(["rev-parse", "--abbrev-ref", "HEAD"]);
}

function hasUpstream() {
  return ok(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"]);
}

function hasChanges() {
  return out(["status", "--porcelain"]) !== "";
}

module.exports = { git, run, out, ok, isRepo, requireRepo, currentBranch, hasUpstream, hasChanges };