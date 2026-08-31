const pc = require("picocolors");

function error(msg) {
  process.stderr.write(pc.red(`✖ ${msg}\n`));
}

function ok(msg) {
  process.stdout.write(pc.green(`✔ ${msg}\n`));
}

function info(msg) {
  process.stdout.write(`${msg}\n`);
}

function hint(msg) {
  process.stdout.write(pc.dim(`  ${msg}\n`));
}

function warn(msg) {
  process.stdout.write(pc.yellow(`⚠ ${msg}\n`));
}

function confirm(question) {
  const { createInterface } = require("node:readline");
  const rl = createInterface({ input: process.stdin, output: process.stderr });
  return new Promise((resolve) => {
    rl.question(`${pc.yellow(question)} [y/N] `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "y");
    });
  });
}

module.exports = { error, ok, info, hint, warn, confirm };