const g = require("../git");

function stashIndex(idx) {
  const n = idx === undefined ? "0" : idx;
  return `stash@{${n}}`;
}

function register(program) {
  program
    .command("s")
    .description("stash changes (including untracked files)")
    .argument("[message]", "optional stash message")
    .action((message) => {
      g.requireRepo();
      const args = ["stash", "push", "-u"];
      if (message) args.push("-m", message);
      g.run(args);
    });

  program
    .command("sp")
    .description("pop the latest stash")
    .action(() => {
      g.requireRepo();
      g.run(["stash", "pop"]);
    });

  program
    .command("sa")
    .description("apply a stash without removing it")
    .argument("[index]", "stash index (default 0)")
    .action((idx) => {
      g.requireRepo();
      g.run(["stash", "apply", stashIndex(idx)]);
    });

  program
    .command("sl")
    .description("list stashes")
    .action(() => {
      g.requireRepo();
      g.run(["-c", "color.ui=always", "stash", "list"]);
    });

  program
    .command("ss")
    .description("show the contents of a stash")
    .argument("[index]", "stash index (default 0)")
    .action((idx) => {
      g.requireRepo();
      g.run(["-c", "color.ui=always", "stash", "show", "-p", stashIndex(idx)]);
    });

  program
    .command("sd")
    .description("drop a stash")
    .argument("[index]", "stash index (default 0)")
    .action((idx) => {
      g.requireRepo();
      g.run(["stash", "drop", stashIndex(idx)]);
    });

  program
    .command("sc")
    .description("drop all stashes")
    .action(() => {
      g.requireRepo();
      g.run(["stash", "clear"]);
    });
}

module.exports = { register };