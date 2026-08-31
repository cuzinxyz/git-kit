# gk — git kit

Short, colorful, developer-friendly git commands. `gk` wraps the daily git
workflow into 1–2 letter commands so you can move faster, on any machine.

> Package name on npm is `gk-dx`; the binary you type is `gk`.

## Install

```bash
npm install -g gk-dx
```

Runs on Node.js ≥ 18. Works for personal and work machines — just install
globally and it's available everywhere.

## Commit workflow

| Command | What it does |
| --- | --- |
| `gk c "message"` | `git add -A` + commit with a message |
| `gk c` | stage everything, write the message in your editor |
| `gk c feat "msg"` | commit as `feat: msg` (conventional prefix) |
| `gk feat "msg"` | shorthand for the above — same for `fix`, `chore`, `docs`, `refactor`, `perf`, `test`, `style`, `build`, `ci`, `revert` |
| `gk amend "msg"` | stage all + amend the last commit (or keep its message) |
| `gk undo` | `reset --soft HEAD~1` — undo last commit, keep changes staged |

## Branch workflow

| Command | What it does |
| --- | --- |
| `gk b` | list branches (colored, with upstream) |
| `gk b my-feature` | create + switch to a new branch (or switch if it exists) |
| `gk co main` | switch branch / commit / path |
| `gk br new-name` | rename current branch |
| `gk br old new` | rename `old` → `new` |
| `gk bd name` | delete a branch (safe) |
| `gk bdf name` | force-delete a branch |
| `gk recent` | branches by most recent commit date |

## Stash & reset

| Command | What it does |
| --- | --- |
| `gk s "msg"` | stash changes **including untracked files** |
| `gk sp` | stash pop |
| `gk sa 1` | stash apply (default index 0) |
| `gk sl` | list stashes |
| `gk ss 0` | show a stash's diff |
| `gk sd 0` / `gk sc` | drop one stash / drop all |
| `gk r` | alias of `gk undo` |
| `gk rh` | `reset --hard HEAD` (confirm prompt) |
| `gk rhh` | `reset --hard HEAD~1` (confirm prompt) |
| `gk cl` | clean untracked files/dirs (confirm prompt) |

Destructive commands (`rh`, `rhh`, `cl`) ask for confirmation. Skip it with `-y`.

## Sync

| Command | What it does |
| --- | --- |
| `gk p` | push — **auto-sets upstream** on a new branch |
| `gk pl` | `pull --rebase` |
| `gk pf` | `push --force-with-lease` (safe force) |
| `gk sync` | `pull --rebase` then push |
| `gk f` | `fetch --prune` |
| `gk del name` | delete a remote branch |

## View

| Command | What it does |
| --- | --- |
| `gk lg [n]` | pretty colored commit graph (default 20 commits) |
| `gk st` | short status + branch, colored |
| `gk d` | unstaged diff |
| `gk ds` | staged diff |
| `gk dstat` | staged diff summary |

## Development

```bash
npm install
npm test        # integration tests against throwaway git repos
npm link        # use `gk` locally while developing
```

## Publish

```bash
npm login
npm version patch
npm publish --access public
```

## License

MIT