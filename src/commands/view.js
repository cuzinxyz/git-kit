const g = require("../git");

const LOG_FORMAT =
  "--pretty=format:%C(yellow)%h%Creset %C(green)%ad%Creset %C(red)%d%Creset %s %C(blue)<%an>%Creset";

function register(program) {
  program
    .command("lg")
    .description("pretty commit graph log")
    .argument("[count]", "number of commits to show (default 20)")
    .action((count) => {
      g.requireRepo();
      const n = parseInt(count || "20", 10);
      g.run(["-c", "color.ui=always", "log", "--graph", LOG_FORMAT, "--date=short", "-n", String(n)]);
    });

  program
    .command("d")
    .description("show unstaged changes")
    .action(() => {
      g.requireRepo();
      g.run(["-c", "color.ui=always", "diff"]);
    });

  program
    .command("ds")
    .description("show staged changes")
    .action(() => {
      g.requireRepo();
      g.run(["-c", "color.ui=always", "diff", "--staged"]);
    });

  program
    .command("st")
    .description("short status with branch and colors")
    .action(() => {
      g.requireRepo();
      g.run(["-c", "color.ui=always", "status", "--short", "--branch"]);
    });

  program
    .command("dstat")
    .description("diff summary (stat) of staged changes")
    .action(() => {
      g.requireRepo();
      g.run(["-c", "color.ui=always", "diff", "--stat", "--staged"]);
    });
}

module.exports = { register };