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

## Getting help

```bash
gk           # grouped overview of every command, with examples
gk help      # same as above
gk c --help  # full detail (args, options) for any single command
```

`gk` checks once a day whether a newer version is on npm and prints a
one-line notice when there is one; set `GK_NO_UPDATE_CHECK=1` to disable it.

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

Destructive commands (`rh`, `rhh`, `cl`, `bdf`, `pf`, `abort`) ask for
confirmation. Skip it with `-y`.

## Rebase & cherry-pick

| Command | What it does |
| --- | --- |
| `gk cp sha1 sha2` | cherry-pick one or more commits |
| `gk ri 3` | interactive rebase onto `HEAD~3` |
| `gk continue` | continue an in-progress rebase, merge, or cherry-pick |
| `gk abort` | abort an in-progress rebase, merge, or cherry-pick (confirm prompt) |

## Sync

| Command | What it does |
| --- | --- |
| `gk p` | push — **auto-sets upstream** on a new branch |
| `gk pl` | `pull --rebase` |
| `gk pf` | `push --force-with-lease` (safe force) |
| `gk sync` | `pull --rebase` then push |
| `gk f` | `fetch --prune` |
| `gk del name` | delete a remote branch |

## Tags

| Command | What it does |
| --- | --- |
| `gk tag v1.0.0 "msg"` | create an annotated tag (lightweight if no message) |
| `gk tags` | list tags, most recent first |
| `gk last-tag` | show the most recent tag |
| `gk tagd v1.0.0` | delete a local tag |
| `gk tagp` | push all tags to origin |

## Search

| Command | What it does |
| --- | --- |
| `gk who path/to/file` | who last touched a file, and when |
| `gk find "text"` | search commit messages |
| `gk contrib` | contributors ranked by commit count |

## Config

| Command | What it does |
| --- | --- |
| `gk ignore "*.log"` | add a pattern to `.gitignore` (creates it if missing) |
| `gk alias` | list git aliases |
| `gk alias lol "log --oneline"` | set a git alias |
| `gk whoami` | show the `user.name` / `user.email` in effect |

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
npm test               # make sure everything passes
npm pack --dry-run     # sanity-check which files would be published
npm login              # if not already logged in
npm publish --access public
```

Bump the version first (`npm version patch|minor|major`) for the *next*
release — it's already at the version being shipped in this change.

## License

MIT