const { Command } = require("commander");
const ui = require("./ui");
const g = require("./git");
const help = require("./help");
const updateCheck = require("./update-check");
const commit = require("./commands/commit");
const branch = require("./commands/branch");
const stash = require("./commands/stash");
const reset = require("./commands/reset");
const sync = require("./commands/sync");
const view = require("./commands/view");
const tag = require("./commands/tag");
const search = require("./commands/search");
const rebase = require("./commands/rebase");
const config = require("./commands/config");
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
  tag.register(program);
  search.register(program);
  rebase.register(program);
  config.register(program);

  program
    .command("help")
    .description("show a grouped overview of all commands")
    .action(() => help.print(pkg));

  program.hook("preAction", (thisCommand, actionCommand) => {
    if (actionCommand.name() === "help" || actionCommand === thisCommand) return;
    g.requireRepo();
  });

  program.action(() => help.print(pkg));
  return program;
}

function run() {
  try {
    updateCheck.notify(pkg, ui);
  } catch {
    // best-effort only, never block the actual command
  }
  build().parse(process.argv);
}

module.exports = { build, run };