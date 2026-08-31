const { test } = require("node:test");
const assert = require("node:assert");
const { execFileSync, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const CLI = path.join(__dirname, "..", "bin", "gk.js");

function run(args, cwd, opts = {}) {
  const res = spawnSync(process.execPath, [CLI, ...args], {
    cwd,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });
  if (opts.expectFail) {
    assert.notStrictEqual(res.status, 0, `expected failure for gk ${args.join(" ")}`);
    return { ...res, status: res.status };
  }
  assert.strictEqual(res.status, 0, `gk ${args.join(" ")} failed:\n${res.stderr}`);
  return res;
}

function git(args, cwd) {
  return execFileSync("git", args, { cwd, encoding: "utf8" });
}

function makeRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "gk-test-"));
  git(["init", "-b", "main"], dir);
  git(["config", "user.email", "gk@test.local"], dir);
  git(["config", "user.name", "GK Test"], dir);
  return dir;
}

function writeFile(dir, name, content) {
  fs.writeFileSync(path.join(dir, name), content);
}

test("gk c commits with a plain message", () => {
  const dir = makeRepo();
  writeFile(dir, "a.txt", "hello");
  const res = run(["c", "initial commit"], dir);
  assert.match(res.stdout, /initial commit/);
  assert.match(git(["log", "-1", "--pretty=%s"], dir), /initial commit/);
});

test("gk c with a conventional type prefixes the message", () => {
  const dir = makeRepo();
  writeFile(dir, "b.txt", "x");
  run(["c", "feat", "add widget"], dir);
  assert.match(git(["log", "-1", "--pretty=%s"], dir).trim(), /^feat: add widget$/);
});

test("gk feat <msg> shorthand works", () => {
  const dir = makeRepo();
  writeFile(dir, "c.txt", "y");
  run(["feat", "add feature"], dir);
  assert.match(git(["log", "-1", "--pretty=%s"], dir).trim(), /^feat: add feature$/);
});

test("gk c treats a non-type first arg as the message", () => {
  const dir = makeRepo();
  writeFile(dir, "d.txt", "z");
  run(["c", "just a message"], dir);
  assert.match(git(["log", "-1", "--pretty=%s"], dir).trim(), /^just a message$/);
});

test("gk undo removes the last commit but keeps changes", () => {
  const dir = makeRepo();
  writeFile(dir, "a.txt", "1");
  run(["c", "first"], dir);
  writeFile(dir, "a.txt", "2");
  run(["c", "second"], dir);
  run(["undo"], dir);
  const log = git(["log", "--oneline"], dir);
  assert.doesNotMatch(log, /second/);
  assert.match(log, /first/);
  assert.match(git(["status", "--short"], dir), /M\s+a\.txt/);
});

test("gk amend rewrites the last commit message", () => {
  const dir = makeRepo();
  writeFile(dir, "a.txt", "1");
  run(["c", "first"], dir);
  writeFile(dir, "b.txt", "2");
  run(["amend", "amended"], dir);
  assert.match(git(["log", "-1", "--pretty=%s"], dir), /amended/);
  assert.match(git(["log", "--pretty=%s"], dir), /amended/);
});

test("gk b creates and switches to a new branch", () => {
  const dir = makeRepo();
  writeFile(dir, "a.txt", "1");
  run(["c", "first"], dir);
  run(["b", "feature/x"], dir);
  assert.strictEqual(git(["branch", "--show-current"], dir).trim(), "feature/x");
  run(["b"], dir);
  assert.match(git(["branch"], dir), /feature\/x/);
});

test("gk co switches branches and gk br renames", () => {
  const dir = makeRepo();
  writeFile(dir, "a.txt", "1");
  run(["c", "first"], dir);
  run(["b", "feature/x"], dir);
  run(["co", "main"], dir);
  assert.strictEqual(git(["branch", "--show-current"], dir).trim(), "main");
  run(["co", "feature/x"], dir);
  run(["br", "feature/renamed"], dir);
  assert.match(git(["branch"], dir), /feature\/renamed/);
});

test("gk s / gk sl / gk sp stash roundtrip", () => {
  const dir = makeRepo();
  writeFile(dir, "a.txt", "1");
  run(["c", "first"], dir);
  writeFile(dir, "a.txt", "2");
  run(["s", "wip"], dir);
  assert.match(git(["stash", "list"], dir), /wip/);
  assert.match(git(["status", "--short"], dir), /^$/);
  run(["sp"], dir);
  assert.match(git(["status", "--short"], dir), / M a\.txt/);
});

test("gk p auto-sets upstream on a new branch", () => {
  const remote = fs.mkdtempSync(path.join(os.tmpdir(), "gk-remote-"));
  git(["init", "--bare", "-b", "main"], remote);
  const dir = makeRepo();
  git(["remote", "add", "origin", remote], dir);
  writeFile(dir, "a.txt", "1");
  run(["c", "first"], dir);
  run(["b", "feature/x"], dir);
  writeFile(dir, "a.txt", "2");
  run(["c", "second"], dir);
  run(["p"], dir);
  assert.match(git(["branch", "-vv"], dir), /feature\/x.*origin\/feature\/x/);
});

test("gk lg / gk st / gk d run without errors", () => {
  const dir = makeRepo();
  writeFile(dir, "a.txt", "1");
  run(["c", "first"], dir);
  writeFile(dir, "b.txt", "2");
  run(["lg"], dir);
  run(["st"], dir);
  run(["d"], dir);
  run(["ds"], dir);
});

test("gk --help lists all commands", () => {
  const res = run(["--help"], makeRepo());
  for (const cmd of ["c", "amend", "undo", "b", "bd", "co", "br", "s", "sp", "p", "pl", "sync", "lg", "d", "st"]) {
    assert.ok(res.stdout.includes(cmd), `--help should mention ${cmd}`);
  }
});

test("gk fails cleanly outside a git repository", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "gk-norepo-"));
  const res = run(["c", "msg"], dir, { expectFail: true });
  assert.match(res.stdout + res.stderr, /git repository/i);
});