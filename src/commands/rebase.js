const path = require("node:path");
const fs = require("node:fs");
const ui = require("../ui");
const g = require("../git");

function inProgress() {
  const dir = g.gitDir();
  if (fs.existsSync(path.join(dir, "rebase-merge")) || fs.existsSync(path.join(dir, "rebase-apply"))) {
    return "rebase";
  }
  if (fs.existsSync(path.join(dir, "CHERRY_PICK_HEAD"))) return "cherry-pick";
  if (fs.existsSync(path.join(dir, "MERGE_HEAD"))) return "merge";
  return null;
}

function register(program) {
  program
    .command("cp")
    .description("cherry-pick one or more commits")
    .argument("<commits...>", "commit(s) to cherry-pick")
    .action((commits) => {
      g.requireRepo();
      g.run(["cherry-pick", ...commits]);
      ui.ok(`Cherry-picked ${commits.length} commit(s).`);
    });

  program
    .command("ri")
    .description("interactive rebase onto the last <n> commits")
    .argument("<n>", "number of commits back")
    .action((n) => {
      g.requireRepo();
      g.run(["rebase", "-i", `HEAD~${n}`]);
    });

  program
    .command("continue")
    .description("continue an in-progress rebase, merge, or cherry-pick")
    .action(() => {
      g.requireRepo();
      const kind = inProgress();
      if (!kind) {
        ui.hint("Nothing to continue — no rebase, merge, or cherry-pick in progress.");
        return;
      }
      if (kind === "rebase") g.run(["rebase", "--continue"]);
      else if (kind === "cherry-pick") g.run(["cherry-pick", "--continue"]);
      else g.run(["commit"]);
    });

  program
    .command("abort")
    .description("abort an in-progress rebase, merge, or cherry-pick")
    .option("-y, --yes", "skip the confirmation prompt")
    .action(async (opts) => {
      g.requireRepo();
      const kind = inProgress();
      if (!kind) {
        ui.hint("Nothing to abort — no rebase, merge, or cherry-pick in progress.");
        return;
      }
      if (!(await ui.confirmDestructive(opts, `This aborts the in-progress ${kind}. Continue?`))) {
        ui.hint("Aborted.");
        return;
      }
      if (kind === "rebase") g.run(["rebase", "--abort"]);
      else if (kind === "cherry-pick") g.run(["cherry-pick", "--abort"]);
      else g.run(["merge", "--abort"]);
      ui.ok(`${kind} aborted.`);
    });
}

module.exports = { register, inProgress };
