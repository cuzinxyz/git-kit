const pc = require("picocolors");

const GROUPS = [
  {
    title: "Commit",
    emoji: "📝",
    rows: [
      ["c \"msg\"", "stage all + commit"],
      ["feat/fix/chore... \"msg\"", "commit with a conventional prefix"],
      ["amend [\"msg\"]", "stage all + amend the last commit"],
      ["undo", "undo last commit, keep changes staged"],
    ],
  },
  {
    title: "Branch",
    emoji: "🌿",
    rows: [
      ["b [name]", "list branches, or create + switch"],
      ["co <target>", "switch branch / commit / path"],
      ["br [old] <new>", "rename a branch"],
      ["bd / bdf <name>", "delete a branch (safe / force)"],
      ["recent [n]", "branches by most recent commit"],
    ],
  },
  {
    title: "Stash & reset",
    emoji: "📦",
    rows: [
      ["s [\"msg\"]", "stash (including untracked)"],
      ["sp / sa [i]", "pop / apply a stash"],
      ["sl / ss [i]", "list stashes / show a stash diff"],
      ["sd [i] / sc", "drop one stash / drop all"],
      ["rh / rhh", "hard-reset to HEAD / HEAD~1"],
      ["cl", "clean untracked files"],
    ],
  },
  {
    title: "Rebase",
    emoji: "🔀",
    rows: [
      ["cp <commits...>", "cherry-pick commits"],
      ["ri <n>", "interactive rebase onto HEAD~n"],
      ["continue / abort", "continue or abort a rebase/merge/cherry-pick"],
    ],
  },
  {
    title: "Sync",
    emoji: "🔄",
    rows: [
      ["p", "push (auto-sets upstream)"],
      ["pl", "pull --rebase"],
      ["pf", "force-push (--force-with-lease)"],
      ["sync", "pull --rebase then push"],
      ["f", "fetch --prune"],
      ["del <name>", "delete a remote branch"],
    ],
  },
  {
    title: "Tag",
    emoji: "🏷️",
    rows: [
      ["tag <name> [msg]", "create a tag"],
      ["tags / last-tag", "list tags / show the latest"],
      ["tagd <name> / tagp", "delete a local tag / push all tags"],
    ],
  },
  {
    title: "Search",
    emoji: "🔎",
    rows: [
      ["who <path>", "who last touched a file"],
      ["find <text>", "search commit messages"],
      ["contrib", "contributors by commit count"],
    ],
  },
  {
    title: "Config",
    emoji: "⚙️",
    rows: [
      ["ignore <pattern>", "add a pattern to .gitignore"],
      ["alias [name] [cmd]", "list git aliases, or set one"],
      ["whoami", "show the active git identity"],
    ],
  },
  {
    title: "View",
    emoji: "👀",
    rows: [
      ["lg [n]", "pretty commit graph"],
      ["st", "short status + branch"],
      ["d / ds", "unstaged / staged diff"],
      ["dstat", "staged diff summary"],
    ],
  },
];

const EXAMPLES = [
  'gk feat "add login form"   → commit as "feat: add login form"',
  "gk b my-feature            → create + switch to a branch",
  "gk sync                    → pull --rebase, then push",
  "gk cp abc123               → cherry-pick a commit",
];

function pad(str, len) {
  return str + " ".repeat(Math.max(0, len - str.length));
}

function print(pkg) {
  const lines = [];
  lines.push(`${pc.bold(pc.cyan("gk"))} ${pc.dim(`v${pkg.version}`)} — short, colorful git commands`);
  lines.push("");

  for (const group of GROUPS) {
    lines.push(`${group.emoji} ${pc.bold(group.title)}`);
    const width = Math.max(...group.rows.map(([cmd]) => cmd.length)) + 2;
    for (const [cmd, desc] of group.rows) {
      lines.push(`  ${pc.green(pad(`gk ${cmd}`, width + 3))} ${pc.dim(desc)}`);
    }
    lines.push("");
  }

  lines.push(pc.bold("Examples"));
  for (const ex of EXAMPLES) lines.push(`  ${pc.dim(ex)}`);
  lines.push("");
  lines.push(pc.dim('Run "gk <command> --help" for details on any command.'));

  process.stdout.write(lines.join("\n") + "\n");
}

module.exports = { print, GROUPS };
