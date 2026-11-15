# Ecosystem plan

This is the coordination point for pyclickplc, laddercodec, pyrung and ClickNick. It holds the work that crosses
repos, written once, and the rules all four share. Work inside one repo lives in that repo's
`scratchpad/roadmap.md`.

Last updated 2026-11-15, after the coordinated release of 2026-11-14 (pyclickplc 0.5.2, laddercodec 0.4.0,
pyrung 0.16.0, ClickNick 0.24.0).

## How to use this file

- **Sessions do not report to the planner.** After the first round (each session answers its handoff
  questions, the planner gives Sam one synthesis), a session works from its own roadmap and talks to Sam
  directly. The planner reads the four roadmaps and release notes at the next planning sitting and updates this
  file then. If a session finds that a ruling here cannot be done as written, or that it changes another
  repo's work, it tells Sam.

- An item is written in one place. If it crosses repos it is here; otherwise it is in the owning repo's roadmap.
- When an item lands, delete it. This file lists what is still to do, not what was done.
- Research findings below were read from code by agents and are marked "unconfirmed" until the owning session
  has checked them.
- These repos are public. Nothing here records where a settled CLICK rule came from, and nothing here comes from
  Sam's own PLC programs.

## Shared rules

- **Branches.** Ordinary feature and refactor branches go into an always-releasable `main`. There is no
  long-lived `dev` trunk in any repo. Work does not wait on Sam: a session pushes its branch, opens the PR
  and squash-merges it itself once CI is green on the last commit and a fresh reviewer has passed that commit.
  A PR whose roadmap label says it needs Sam's judgment, CLICK software or a real PLC waits until that part
  is done. `main` changes only through PRs; no session pushes to it.
- **Releases are Sam's gate.** Nothing is tagged, released or published until Sam says so in that session, or
  does it himself. Publishing the GitHub release is what sends a package to PyPI and, once each repo's docs
  workflow is moved (see "Before new work starts"), what deploys its docs site. Every PR carries its own
  CHANGELOG line, so `main` can be released at any commit.
- **Builds.** BOB arcs stay in every repo as the way a multi-branch job is run. Only pyrung keeps the merge
  train, which now lands on `main`. In laddercodec and ClickNick the queue and trains go and CI is the gate,
  but the hook stays: it gives agent test runs a timeout and a memory cap and keeps reviewer agents
  read-only. ClickNick's CI runs its tests on its Windows runner, not only lint. The BOB skill, the agent
  files, the hook and the queue have one source (item 7); no repo edits its own copy.
- **A branch that needs an unreleased sibling** (a ClickNick branch that needs a new pyrung, say) is tested
  locally against the sibling checkout and merges after the sibling's release.
- **Arc folders stay out of git.** They are working state (ledgers, reviews, logs). When an arc closes, its open
  items move into the repo's roadmap and the folder can be deleted.
- **Labels.** Each roadmap item says what it needs: CLICK software, a real PLC, Sam's judgment, or nothing
  (refactor only). Work that needs nothing is never queued behind work that needs Sam.
- **Less code first.** Deletion and consolidation come before new features. A shared mechanism is kept only if it
  removes more lines than it adds; plain shared functions are an acceptable end state.
- **Addresses.** Accept what CLICK accepts, write canonical. CLICK's dialogs take `x1` and `ds1` and reformat
  them to `X001` and `DS1`; every writer in every repo produces the canonical form.
- **No provenance.** The repo records what a rule is, in code, tests and user docs. The plan records what is
  still in doubt. Nothing records where a settled rule came from.
- **Sam's programs.** No session reads Sam's real PLC programs until he has sanitized them and opened access
  (see "Test corpus").

## Before new work starts

1. pyrung's `scratchpad/` files are committed locally as they were (addcdc4, on the old `dev`). They reach
   GitHub on a branch into `main`.
2. Each repo writes or rewrites its `scratchpad/roadmap.md` from its handoff file in `plan/handoff/`, its own
   reply to it, and the rulings here. The planner removes the handoff files at the next planning sitting.
3. Cruft sweep in every repo: stale memories, branches, worktrees, closed arcs and old plans, so the roadmaps
   are the only live statement of intent. One hold: laddercodec's validation reports and ledgers stay until the
   classifier dry-run list has been sorted with them.
4. Before a session merges its own PRs in a repo, the docs site follows the release, by the one rule below, so
   the public docs keep describing the released version.
5. Done 2026-11-15: `main` in all four repos requires its CI jobs and the docs build to pass, on a branch that
   is up to date, so a red or stale PR cannot be merged. The required names still contain the Python version
   (`build (ubuntu-latest, 3.11)` and so on), so until item 6 is done, a repo does not change its test matrix.
6. Each repo adds one job named `ci` at the end of `ci.yml`, which passes only when every job of the test
   matrix passed. When all four have it on `main`, Sam swaps each ruleset to require two fixed names, `ci` and
   the docs `build`, and a matrix change no longer needs a ruleset edit.

   ```yaml
     ci:
       if: always()
       needs: [build]
       runs-on: ubuntu-latest
       steps:
         - run: test "${{ needs.build.result }}" = "success"
   ```

   `if: always()` is needed: without it the job is skipped when a test fails, and a skipped required check
   counts as passing.
7. In the same PR, `ci.yml` stops running on a push to `main`: its triggers become `pull_request` into `main`
   and `workflow_dispatch`. Since a PR must be up to date to merge, the merged tree is the tree its PR already
   tested, so the run after the merge repeated it (about 85 runner-minutes each time in pyrung). One cost: the
   dependency cache is no longer refreshed from `main`, so a new PR starts with a cold cache.

### Docs deploy: one rule for all four repos

A docs site is deployed in one way only: `docs.yml` is started by hand or by the release, on `main`, and
builds the release's tag.

- **`docs.yml` triggers:** `pull_request` into `main`, which builds and checks and never deploys; and
  `workflow_dispatch` with an optional `ref` input. No `push` trigger and no `release` trigger.
- **What it builds:** on a dispatch it checks out `ref`. An empty `ref` means the latest release's tag
  (`gh release view`). The workflow file is always `main`'s copy, so a broken deploy is repaired on `main` and
  run again without a new release.
- **Who starts it:** `publish.yml` runs on a published release. Its last job, after the PyPI upload and
  anything the docs read from the release (ClickNick's trust report), runs
  `gh workflow run docs.yml --ref main -f ref=<tag>`. It needs `actions: write` and is skipped for a
  pre-release.
- **Details that have bitten:** `concurrency: pages` sits on the deploy job, not on the workflow, or a queued
  PR build can displace a waiting deploy. The cache-busting suffix comes from the commit that was built
  (`git rev-parse`), not from `GITHUB_SHA`. `gh release create --target` needs a full sha.
- **Settings:** the `github-pages` environment allows `main` only. No tag rule is needed.
- **Proof after the change merges:** one run with an empty `ref` redeploys the current release's docs. It is a
  deploy, so it is run on Sam's word.
- **A docs fix between releases** is a run by Sam with `ref` set to a commit on `main`. No session starts a
  deploy with a `ref` that is not a release tag.

## Cross-repo work

### 1. One command path, and recording (pyrung, then ClickNick)

A recording is a text file of console commands. One replayer runs it, called from three places: pytest,
ClickNick on every CLICK save, and the `replay` verb.

Order:

1. **Delete** the April 2026 record machinery in pyrung: condenser, miner, `spec test`, the review verbs, the
   `log` verb and the action log (about 3,400 lines with tests). The capture layer stays; it is the base the
   recording core builds on.
2. **Small core in pyrung:** `replay` fixed and made headless; `assert` as the check, with a tolerance on Reals
   and an error on an unknown tag; `run until <condition> within N` for milestones; `record` saves the raw
   transcript; the pytest plugin collects recordings. A recording carries its scan time.
3. **One door in pyrung:** every action that changes state is a console command, so everything a user does
   can be recorded. The old structured requests for those actions (force, patch, set mode and the rest) are
   deleted, not wrapped. Reads stay as requests. pyrung, ClickNick and the VS Code extension release together.
4. **ClickNick:** the panels send text; recordings run on every CLICK save, off the Tk thread and only in a
   permanent workspace; right-click "Assert this"; starting a recording prompts the workspace setup, so
   recordings land in a workspace that persists.

Also settled:

- Declining the setup prompt means no recording.
- Recordings hold names: the nickname, or the display address where there is none.
- Renames follow into recordings at the build that first carries the new names (a Sync or a CLICK save), not
  at edit time. A name that still exists is left alone, so swapping two names rewrites nothing. A name that
  is gone becomes whatever now names its old address.
- The rename function lives in pyrung, because it has to parse expressions, and ClickNick supplies the
  old-to-new map.

Later, from the `how()` work: a plan from `how()` is written in the same format and run by the same replayer,
so the planned "verdict kernel" is the replayer plus `assert` and not a module of its own.

### 2. Who owns what (pyclickplc, laddercodec, pyrung, ClickNick)

- **pyclickplc owns address facts.** `parse_address` changes in place to accept what CLICK accepts and nothing
  more (lowercase stays; a stray `u` suffix and non-ASCII digits are refused). The XD/YD display-unit range is
  a new field beside `max_addr`.
- **ClickNick's duplicates move into pyclickplc:** the nickname CSV reader, a function that formats the CSV
  text (ClickNick keeps writing the file), the reader for CLICK's `Address.csv`, and the smaller items in the
  ClickNick session's inventory. This also fixes a live bug: ClickNick's own reader misreads a Text initial
  value that is a comma or a quote.
- **pyclickplc's reader behaviour changes with the move,** together with the `parse_address` change, so a row
  that stops parsing is reported and not silently lost: raise on a bad row with its line number; keep
  nickname and comment as written; accept true and 1 for Retentive; do not fail the read on a repeated
  nickname; report which columns were present. pyrung's tag map reads through the same function.
- **laddercodec owns the CLICK ladder format and its field rules.** It stays dependency-free at runtime and
  keeps a small private copy of the bank facts. A parity test in laddercodec, with pyclickplc as a dev-only
  dependency, keeps the copy honest.
- **pyrung takes laddercodec as a dependency,** in three steps: dev-only, to pass pyrung's CSV export through
  laddercodec's `read_csv` and list the disagreements; runtime, when the first duplicated rule table is
  deleted; last, pyrung's CLICK codegen reads laddercodec's objects (about 7,500 lines to delete,
  unconfirmed). Where the two disagree, laddercodec's rule wins by default.
- **laddercodec's field-rule restructure** skips the engine and goes to plain shared functions. Verdicts must
  stay identical; message wording may change. The dry run found about five real disagreements, which go in an
  expected-diff file. `FieldError.field` stays and becomes explicit at every raise site, because pyrung needs
  to know which field was refused.
- **Canonical constants** (`005`, `+5`, `0ffh`) are their own laddercodec branch after the restructure, once
  CLICK has been asked what it turns them into. Addresses are already canonical.
- **Provenance leftovers in laddercodec:** CLICK's own error ids such as "(OBJ-023)" stay in messages, since
  that is what CLICK shows the user. The two tracked `arc.md` files and the helper scripts beside them are deleted
  from the tip; history is left alone.
- The pyrung-specific sections of laddercodec's `csv-format.md` move to pyrung.
- **An undecodable rung no longer fails the whole program, and it fails loudly.** The unit is the rung,
  because its rows share wires. laddercodec replaces the rung with a marker rung: the comment
  `UNDECODED: rung N, row R: <error>` and one `Undecoded` instruction that acts as End in the main program
  and Return in a subroutine. It round-trips through CSV, `check()` reports it, and `encode()` refuses it, so
  it is never pasted back into CLICK. After a framing error, one marker stands for the rest of the program.
  pyrung runs it as a stop that says why. ClickNick drops its empty stand-in rung, its Simulator runs up to
  the marker instead of refusing to run, and Check Program lists it.

### 3. pyrung's public surface (pyrung, ClickNick)

`pyrung`, `pyrung.click` and `pyrung.circuitpy` are public. Everything under `pyrung.core` and `pyrung.dap` is
internal. The few names users need move to the top level, validation gets one public module, and ClickNick
moves onto named imports with a test that fails when one disappears. This rides pyrung's deletions release.

### 4. CLICK sandbox runner (ClickNick; used by laddercodec and pyrung)

A runner that drives the CLICK software unattended, so work that needs CLICK no longer needs Sam. It lives in
ClickNick's `devtools/`; the other repos call it as a command.

It starts inside Windows Sandbox, because driving the desktop CLICK takes over the keyboard and puts Sam's own
CLICK windows at risk. The desktop is the fallback if the Sandbox fails, in a time slot Sam picks and only on
a CLICK the runner started. The first milestone: CLICK installs and launches unattended; a known laddercodec
fixture is pasted, copied back and matches byte for byte; the project saves.

It leans on the clipboard and ClickNick's window code, not on pixel positions. It does not replace readings
from a real PLC. Early jobs once it works: what CLICK writes on Open, New and Save As; what CLICK turns
constants into; the three small checks under "Only Sam can do these".

### 5. Test corpus (pyrung first; later all four)

- **Now:** small programs written fresh, each around one PLC idiom (integer steppers, seal-in latches,
  one-shot chains, cascaded timers, gated counters, drums, pointers, handshakes, alarm and reset, shift
  registers, first-scan setup). Each case is a program, a goal, and a hand-written recording that reaches the
  goal. Idiom-led, not a generated grid.
- **Later:** Sam's `click-plc-cookbook`, a folder of real programs each with its own pyrung workspace.
  Sanitizing it is Sam's task alone, and no session has access before he opens it. Real programs then also
  exercise laddercodec's decoder, pyrung's import and ClickNick's Check Program.

### 6. Prover search removal (pyrung, this site)

pyrung removes its exhaustive search, the `Proven` verdict, lock files, the `pyrung lock` command and the
`prove` console verb. The static facts stay, because `how()` and validation use them. This site's blog post
"Gradual typing for ladder logic" and `overview.md` lose their claims in the same release.

The search was the only soundness check the facts had. Its replacement is part of the deletion: the facts are
checked against real runs over the corpus and the conformance programs.

### 7. One source for the agent tooling (all four)

Until 2026-11-15 the BOB skill, the three agent files, the hook and the merge queue were copied into each
repo, and four sessions were fixing the copies separately. They now have one source: a Claude Code plugin in
its own repo, `bob`, built by the planner's agent from laddercodec's `chore/agentguard` branch and pyrung's
queue.

- **Two layers.** The guard is common: the hook, its fail-closed shim, the bounded test runner, the worktree
  helpers, the skill and the agent files. The queue (stages, presets, trains) is an add-on that only pyrung
  turns on.
- **Each repo keeps two files:** `.claude/bob/config.toml` and `.claude/bob/profile.md`. Everything else under
  `devtools/mergeq`, `devtools/agentguard`, `.claude/skills/bob` and `.claude/agents/bob-*` is deleted when
  the repo adopts the plugin.
- **Until the plugin is ready,** no session changes the tooling. pyrung's two-commit queue fix
  (`chore/mergeq-main`) goes in, because its queue does not work without it. laddercodec's
  `chore/agentguard` stays unmerged, ClickNick's queue trim is dropped, and pyclickplc's PR #19 stays
  unmerged and is closed once pyclickplc has adopted the plugin.
- **Adoption** is one small PR per repo. The hook fails closed, so every open session in a repo reloads its
  plugins when that repo switches over.
- **Tooling faults** found after that are fixed in the plugin repo, once. Its `scratchpad/roadmap.md` holds
  the open ones.

## Order by repo

| Repo | Order |
|---|---|
| pyrung | 0. Gate fixes (measure, stop running tests twice, narrow the `soundness` stage to the files where its check acts) and the bound on the unbounded range, which crashes Check Program today. 1. Deletions release (record machinery, search, public surface), then the `Rung` to `rung` rename in tests as its own commit. 2. CLICK-match fixes from the 2026-11-10 readings and the watchdog stop. 3. Recording core. 4. One door. 5. float32 Reals, the per-PLC definitions table, the history API, calc into a pointer. `how()` work follows the recording core. The laddercodec export check fits in whenever laddercodec is ready. |
| laddercodec | The undecoded marker. The field-rule restructure under the rules in item 2. Canonical constants as their own branch afterwards. |
| pyclickplc | `parse_address` and the XD/YD field; take in ClickNick's duplicates. The pymodbus rewrite waits until something forces it; it does not involve pyrung. |
| ClickNick | Drop ssort; tests into CI. Sandbox runner spike. Move onto pyclickplc's readers and pyrung's named imports. Finish `ConnectionSession` as the owner of window and project state, then split `ClickNickApp`. Then the ClickNick side of recording. |

## Only Sam can do these

- Tell each session once, directly, that it may push branches, open PRs and merge its own PRs into `main`
  under the shared rules; a session does not take that from the planner or from another session. pyrung's
  scratchpad commit (addcdc4) is on one disk until its branch is pushed.
- Publish each release (the tag is the gate).
- Swap the four rulesets to the fixed check names once every repo has the `ci` job on `main`.
- Enable Windows Sandbox and reboot; run the CLICK installer by hand once inside it to record its answers.
- Tell the laddercodec session to archive `feat/productivity-codec` as a tag.
- Create the GitHub repo for the `bob` plugin and push it, then say when each repo may switch over (a moment
  when its sessions are idle).
- Three checks in CLICK, or leave them for the runner: leading zeros and surrounding spaces in an address;
  importing a bare space as a Text initial value; whether CLICK strips spaces from nicknames and comments.

## Settled without further work

pyrung's six unmerged branches are dropped; none matters as code, and their notes are kept.
