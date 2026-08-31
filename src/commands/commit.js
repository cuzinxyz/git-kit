const ui = require("../ui");
const g = require("../git");

const TYPES = [
  "feat",
  "fix",
  "chore",
  "docs",
  "refactor",
  "perf",
  "test",
  "style",
  "build",
  "ci",
  "revert",
];

const TYPE_SET = new Set(TYPES);

function formatMessage(type, message) {
  const clean = (message || "").trim();
  if (!type) return clean;
  return clean ? `${type}: ${clean}` : `${type}: `;
}

function stageAndCommit(message) {
  g.requireRepo();
  if (!g.hasChanges()) {
    ui.hint("Nothing to commit — working tree is clean.");
    return;
  }
  g.run(["add", "-A"]);
  if (message) {
    g.run(["commit", "-m", message]);
    ui.ok(`Committed: ${message}`);
  } else {
    g.run(["commit"]);
  }
}

function runCommit(type, message) {
  if (type && !TYPE_SET.has(type)) {
    message = type;
    type = null;
  }
  stageAndCommit(formatMessage(type, message));
}

function register(program) {
  program
    .command("c")
    .description("stage all changes and commit (with optional conventional prefix)")
    .argument("[type]", "conventional prefix: feat, fix, chore, docs, refactor, perf, test, style, build, ci, revert")
    .argument("[message]", "commit message; omit to write in your editor")
    .action((type, message) => runCommit(type, message));

  for (const type of TYPES) {
    program
      .command(`${type} <message>`)
      .description(`stage all and commit as "${type}: <message>"`)
      .action((message) => stageAndCommit(formatMessage(type, message)));
  }

  program
    .command("amend")
    .description("stage all changes and amend the last commit")
    .argument("[message]", "new message; omit to keep the existing one")
    .action((message) => {
      g.requireRepo();
      if (g.hasChanges()) g.run(["add", "-A"]);
      if (message) g.run(["commit", "--amend", "-m", message]);
      else g.run(["commit", "--amend", "--no-edit"]);
      ui.ok("Last commit amended.");
    });

  program
    .command("undo")
    .description("undo the last commit, keeping changes staged (reset --soft HEAD~1)")
    .action(() => {
      g.requireRepo();
      g.run(["reset", "--soft", "HEAD~1"]);
      ui.ok("Last commit undone — changes are staged.");
    });
}

module.exports = { register, TYPES, TYPE_SET, formatMessage };