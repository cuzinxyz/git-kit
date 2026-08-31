const { Command } = require("commander");
const ui = require("./ui");
const g = require("./git");
const commit = require("./commands/commit");
const branch = require("./commands/branch");
const stash = require("./commands/stash");
const reset = require("./commands/reset");
const sync = require("./commands/sync");
const view = require("./commands/view");
const pkg = require("../package.json");

function build() {
  const program = new Command();
  program
    .name("gk")
    .description("Short, colorful git commands for your daily developer workflow")
    .version(pkg.version, "-v, --version", "print version");

  commit.register(program);
  branch.register(program);
  stash.register(program);
  reset.register(program);
  sync.register(program);
  view.register(program);

  program.hook("preAction", (thisCommand, actionCommand) => {
    g.requireRepo();
  });

  program.action(() => program.help());
  return program;
}

function run() {
  build().parse(process.argv);
}

module.exports = { build, run };