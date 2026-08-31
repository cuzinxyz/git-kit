const ui = require("../ui");
const g = require("../git");

async function confirmDestructive(args, flag) {
  if (flag) return true;
  if (process.stdin.isTTY) {
    return ui.confirm("This discards changes irreversibly. Continue?");
  }
  return false;
}

function register(program) {
  program
    .command("r")
    .description("undo the last commit, keeping changes staged (alias of gk undo)")
    .action(() => {
      g.requireRepo();
      g.run(["reset", "--soft", "HEAD~1"]);
      ui.ok("Last commit undone — changes are staged.");
    });

  program
    .command("rh")
    .description("hard-reset the working tree to HEAD (discard all changes)")
    .option("-y, --yes", "skip the confirmation prompt")
    .action(async (opts) => {
      g.requireRepo();
      if (!(await confirmDestructive(opts, opts.yes))) {
        ui.hint("Aborted.");
        return;
      }
      g.run(["reset", "--hard", "HEAD"]);
      ui.ok("Working tree reset to HEAD.");
    });

  program
    .command("rhh")
    .description("hard-reset to HEAD~1 (discard the last commit and its changes)")
    .option("-y, --yes", "skip the confirmation prompt")
    .action(async (opts) => {
      g.requireRepo();
      if (!(await confirmDestructive(opts, opts.yes))) {
        ui.hint("Aborted.");
        return;
      }
      g.run(["reset", "--hard", "HEAD~1"]);
      ui.ok("Last commit discarded.");
    });

  program
    .command("cl")
    .description("clean untracked files and directories (irreversible)")
    .option("-y, --yes", "skip the confirmation prompt")
    .action(async (opts) => {
      g.requireRepo();
      if (!(await confirmDestructive(opts, opts.yes))) {
        ui.hint("Aborted.");
        return;
      }
      g.run(["clean", "-fd"]);
      ui.ok("Untracked files removed.");
    });
}

module.exports = { register };