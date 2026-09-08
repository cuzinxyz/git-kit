const ui = require("../ui");
const g = require("../git");

function listBranches() {
  g.requireRepo();
  g.run(["-c", "color.ui=always", "branch", "-vv"]);
}

function createOrCheckout(name) {
  g.requireRepo();
  if (g.ok(["rev-parse", "--verify", `--quiet`, `refs/heads/${name}`])) {
    g.run(["checkout", name]);
    ui.ok(`Checked out existing branch "${name}".`);
  } else {
    g.run(["checkout", "-b", name]);
    ui.ok(`Created and checked out branch "${name}".`);
  }
}

function register(program) {
  program
    .command("b")
    .description("list branches, or create + checkout a new one")
    .argument("[name]", "branch name to create and switch to")
    .action((name) => (name ? createOrCheckout(name) : listBranches()));

  program
    .command("bd")
    .description("delete a branch (safe — refuses to delete unmerged work)")
    .argument("<name>", "branch to delete")
    .action((name) => {
      g.requireRepo();
      g.run(["branch", "-d", name]);
    });

  program
    .command("bdf")
    .description("force-delete a branch (discards unmerged work)")
    .argument("<name>", "branch to delete")
    .option("-y, --yes", "skip the confirmation prompt")
    .action(async (name, opts) => {
      g.requireRepo();
      if (!(await ui.confirmDestructive(opts, `This force-deletes "${name}", even if unmerged. Continue?`))) {
        ui.hint("Aborted.");
        return;
      }
      g.run(["branch", "-D", name]);
    });

  program
    .command("co")
    .description("switch to a branch (or path)")
    .argument("<target>", "branch, commit, or path to check out")
    .action((target) => {
      g.requireRepo();
      g.run(["checkout", target]);
    });

  program
    .command("br")
    .description("rename the current branch (or old → new)")
    .argument("[old]", "current branch name (defaults to HEAD)")
    .argument("[new]", "new branch name")
    .action((oldName, newName) => {
      g.requireRepo();
      if (oldName && newName) g.run(["branch", "-m", oldName, newName]);
      else if (oldName) g.run(["branch", "-m", oldName]);
      else {
        ui.error("Usage: gk br <new> | gk br <old> <new>");
        process.exit(1);
      }
    });

  program
    .command("recent")
    .description("list branches by most recent commit date")
    .argument("[count]", "number of branches to show (default 10)")
    .action((count) => {
      g.requireRepo();
      const n = parseInt(count || "10", 10);
      g.run([
        "for-each-ref",
        "--color=always",
        "--sort=-committerdate",
        "--format=%(HEAD) %(color:cyan)%(refname:short)%(color:reset) %(color:dim)(%(committerdate:relative))%(color:reset)",
        "refs/heads",
        "--count",
        String(n),
      ]);
    });
}

module.exports = { register };