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

const ERROR_HINTS = [
  [/(no upstream branch|no tracking information)/i, 'This branch has no upstream yet — "gk p" sets it up on push (for pulling, use "git pull origin <branch>" once).'],
  [/CONFLICT/, 'Resolve the conflicts, "gk add" the files, then "gk continue".'],
  [/(non-fast-forward|fetch first|behind its remote)/i, '"gk pl" to rebase on top first, then push again — or "gk pf" if you mean to overwrite.'],
  [/(uncommitted changes|Please commit your changes or stash them|working tree has unstaged)/i, 'Commit or "gk s" your changes first.'],
  [/refusing to merge unrelated histories/i, "These branches don't share history — check you're syncing the right remote/branch."],
  [/not something we can merge|unknown revision/i, '"gk f" to fetch first, or check the name is correct.'],
];

function hintFor(stderr) {
  if (!stderr) return null;
  for (const [pattern, hint] of ERROR_HINTS) {
    if (pattern.test(stderr)) return hint;
  }
  return null;
}

function run(args) {
  const res = git(args, { stdio: ["inherit", "inherit", "pipe"] });
  if (res.stderr) process.stderr.write(res.stderr);
  if (res.status !== 0) {
    const hint = hintFor(res.stderr);
    if (hint) ui.hint(hint);
    process.exit(res.status === null ? 1 : res.status);
  }
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

function gitDir() {
  return out(["rev-parse", "--git-dir"]);
}

module.exports = { git, run, out, ok, isRepo, requireRepo, currentBranch, hasUpstream, hasChanges, gitDir };