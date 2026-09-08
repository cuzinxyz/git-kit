const fs = require("node:fs");
const path = require("node:path");
const ui = require("../ui");
const g = require("../git");

function ignore(pattern) {
  const file = path.join(process.cwd(), ".gitignore");
  const existing = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const lines = existing.split("\n").map((l) => l.trim());
  if (lines.includes(pattern.trim())) {
    ui.hint(`"${pattern}" is already in .gitignore.`);
    return;
  }
  const needsNewline = existing.length > 0 && !existing.endsWith("\n");
  fs.writeFileSync(file, existing + (needsNewline ? "\n" : "") + pattern + "\n");
  ui.ok(`Added "${pattern}" to .gitignore.`);
}

function register(program) {
  program
    .command("ignore")
    .description("add a pattern to .gitignore")
    .argument("<pattern>", "gitignore pattern")
    .action((pattern) => {
      g.requireRepo();
      ignore(pattern);
    });

  program
    .command("alias")
    .description("list git aliases, or set one")
    .argument("[name]", "alias name")
    .argument("[command]", "git command the alias runs")
    .action((name, command) => {
      g.requireRepo();
      if (!name) {
        g.run(["config", "--get-regexp", "^alias\\."]);
        return;
      }
      if (!command) {
        ui.error("Usage: gk alias <name> <git-command>");
        process.exitCode = 1;
        return;
      }
      g.run(["config", `alias.${name}`, command]);
      ui.ok(`Alias set: git ${name} → ${command}`);
    });

  program
    .command("whoami")
    .description("show the git identity in effect (user.name / user.email)")
    .action(() => {
      g.requireRepo();
      const name = g.out(["config", "user.name"]);
      const email = g.out(["config", "user.email"]);
      ui.info(`${name || "(not set)"} <${email || "not set"}>`);
    });
}

module.exports = { register, ignore };
