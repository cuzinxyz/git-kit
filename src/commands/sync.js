const ui = require("../ui");
const g = require("../git");

function push() {
  g.requireRepo();
  if (g.hasUpstream()) {
    g.run(["push"]);
  } else {
    ui.hint("No upstream yet — pushing and setting it up for you.");
    g.run(["push", "-u", "origin", "HEAD"]);
  }
}

function register(program) {
  program
    .command("p")
    .description("push (auto-sets upstream on a new branch)")
    .action(() => push());

  program
    .command("pl")
    .description("pull with rebase")
    .action(() => {
      g.requireRepo();
      g.run(["pull", "--rebase"]);
    });

  program
    .command("pf")
    .description("push --force-with-lease (safe force push)")
    .action(() => {
      g.requireRepo();
      g.run(["push", "--force-with-lease"]);
    });

  program
    .command("sync")
    .description("pull --rebase, then push")
    .action(() => {
      g.requireRepo();
      g.run(["pull", "--rebase"]);
      push();
    });

  program
    .command("f")
    .description("fetch with pruning of deleted remote branches")
    .action(() => {
      g.requireRepo();
      g.run(["fetch", "--prune"]);
    });

  program
    .command("del")
    .description("delete a remote branch")
    .argument("<name>", "remote branch to delete")
    .action((name) => {
      g.requireRepo();
      g.run(["push", "origin", `--delete`, name]);
    });
}

module.exports = { register, push };