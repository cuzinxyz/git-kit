const g = require("../git");

function register(program) {
  program
    .command("who")
    .description("show who last touched a file or path")
    .argument("<path>", "file or path")
    .action((path) => {
      g.requireRepo();
      g.run(["-c", "color.ui=always", "log", "-1", "--pretty=format:%C(yellow)%an%Creset <%ae> %C(dim)%ar%Creset%n%s", "--", path]);
    });

  program
    .command("find")
    .description("search commit messages for text")
    .argument("<text>", "text to search for")
    .action((text) => {
      g.requireRepo();
      g.run(["-c", "color.ui=always", "log", "--oneline", "--color=always", `--grep=${text}`, "-i"]);
    });

  program
    .command("contrib")
    .description("show contributors by commit count")
    .action(() => {
      g.requireRepo();
      g.run(["shortlog", "-sn", "--all"]);
    });
}

module.exports = { register };
