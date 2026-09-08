const ui = require("../ui");
const g = require("../git");

function register(program) {
  program
    .command("tag")
    .description("create a tag (annotated if a message is given, lightweight otherwise)")
    .argument("<name>", "tag name")
    .argument("[message]", "annotation message; omit for a lightweight tag")
    .action((name, message) => {
      g.requireRepo();
      if (message) g.run(["tag", "-a", name, "-m", message]);
      else g.run(["tag", name]);
      ui.ok(`Tagged: ${name}`);
    });

  program
    .command("tags")
    .description("list tags, most recent first")
    .action(() => {
      g.requireRepo();
      g.run(["-c", "color.ui=always", "tag", "--sort=-creatordate", "--format=%(color:yellow)%(refname:short)%(color:reset) %(color:dim)(%(creatordate:relative))%(color:reset)"]);
    });

  program
    .command("last-tag")
    .description("show the most recent tag")
    .action(() => {
      g.requireRepo();
      g.run(["describe", "--tags", "--abbrev=0"]);
    });

  program
    .command("tagd")
    .description("delete a local tag")
    .argument("<name>", "tag to delete")
    .action((name) => {
      g.requireRepo();
      g.run(["tag", "-d", name]);
    });

  program
    .command("tagp")
    .description("push all tags to origin")
    .action(() => {
      g.requireRepo();
      g.run(["push", "origin", "--tags"]);
      ui.ok("Tags pushed.");
    });
}

module.exports = { register };
