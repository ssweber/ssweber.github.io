# Ecosystem plan

This is the coordination point for pyclickplc, laddercodec, pyrung and ClickNick. It holds the work that crosses
repos, written once, and the rules all four share. Work inside one repo lives in that repo's
`scratchpad/roadmap.md`.

Last updated 2026-11-15. Latest releases: pyclickplc 0.7.0, laddercodec 0.4.0, pyrung 0.16.0, ClickNick 0.24.1.

## How to use this file

- **Sessions do not report to the planner.** A session works from its own roadmap and talks to Sam
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
  does it himself. Publishing the GitHub release is what sends a package to PyPI and deploys its docs site. Every PR carries its own
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

Each repo's `scratchpad/roadmap.md` is on its `main`. One thing is left:

- Cruft sweep in every repo: stale memories, branches, worktrees, closed arcs and old plans, so the roadmaps
  are the only live statement of intent. One hold: laddercodec's validation reports and ledgers stay until the
  classifier dry-run list has been sorted with them.

### How `main` is protected (in place in all four repos since 2026-11-15)

- **Ruleset on `main`:** no deletion, no force push, changes only through a pull request, and two required
  checks on a branch that is up to date: `ci` and the docs `build`.
- **`ci` is one job at the end of `ci.yml`** that passes only when every test job passed. A repo that adds a
  test job adds it to `ci`'s `needs` and to its test. `if: always()` stays: without it the job is skipped when
  a test fails, and a skipped required check counts as passing. A repo may change its Python versions without
  a ruleset edit.
- **CI runs on pull requests and by hand,** not again on a push to `main`: a PR must be up to date to merge,
  so the merged tree is the tree its PR already tested. One cost: a new PR starts with a cold dependency cache.
- **Merged branches are deleted on GitHub automatically.** Check a PR's state before pushing to its branch
  again: a push to a merged branch re-creates it.
- **pyrung's CI** runs the full suite on Python 3.11 and 3.14, and only the tests of its bytecode-reading
  modules on 3.12 and 3.13. Its local gate keeps its own `test` stage: Sam wants a failure found before the
  push.

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
- **Proof still owed in each repo:** every `docs.yml` follows this rule on `main`, but no deploy has run
  through it. One run with an empty `ref` redeploys the current release's docs. It is a deploy, so it is run
  on Sam's word.
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

The goal is one source of truth for each CLICK fact. Fewer lines is a bonus, not the measure.

- **pyclickplc owns address and bank facts.** `parse_address` as CLICK does it, the stricter CSV reader, the
  XD/YD display range and the helpers taken from ClickNick are released (0.6.0, 0.7.0). ClickNick is moving
  onto them; pyrung is on 0.7.0.
- **laddercodec owns the CLICK ladder format, its field rules and its layout.** It stays dependency-free at
  runtime and keeps a small private copy of the bank facts. A parity test in laddercodec, with pyclickplc as
  a dev-only dependency, keeps the copy honest; it should cover the writable SC and SD points too (see the
  disagreements below).
- **pyrung keeps what only it can know:** the tag map and every check that depends on it (contiguity, two
  tags on one address, pointer reach, text windows); turning Python expressions into CLICK forms; the rules
  for Python that has no CLICK form; the advice in its messages; the importer's naming and emitting; the
  project scaffold.

#### pyrung onto laddercodec

Sized on 2026-11-15 by research agents reading `main` of the three repos (probes run, no test suites;
unconfirmed until the owning sessions have checked):

| pyrung area | Lines | Second copy of laddercodec |
|---|---|---|
| Export, `click/ladder` | 4,077 | about 650: the layout (the same algorithm; two programs came out byte-identical through both) and the token assembly |
| Import, `click/codegen` | 7,719 | 1,300 to 2,000: CSV reading, token parsing, the grid-to-tree reduction. The earlier "7,500" was the size of the whole importer |
| Validation and `capabilities.py` | about 4,600 | about 2,200: 34 of the 60 `CLK_` codes are field rules |

**Where the two disagree, the refusal wins by default** (Sam, 2026-11-15; this replaces "laddercodec's rule
wins"). Each library refuses things the other was never taught, so the working rule set is both sets of
refusals together: a rule was added when something was found not to be allowed, so a refusal is a finding
and an acceptance is only the lack of one. CLICK is asked, through the runner, when a refusal is doubted. Of
the 34 field rules, 25 refuse the same thing in both. The rest, as probed:

- Refused by one side only, per pair or bank: block copy, pack and unpack bank pairs; Math result banks;
  Receive destination banks. These tables are written as lists of what is allowed, so a refusal here can be
  a pair nobody added. They are the first to ask CLICK about.
- Only pyrung refuses: Word and non-Word operands in one math, RAND bound type, RAND equal bounds, SUM over
  TXT, a copy into a read-only SD.
- Only laddercodec refuses: about ten things, among them a negative timer preset, a counter preset over
  32 bits, a shift on Y, a search result outside C.
- laddercodec's writable SC list has SC162 to SC171 and SC303 to SC326; pyrung's and pyclickplc's do not.

Order:

1. **Agreement test (pyrung; laddercodec as a dev-only dependency).** Every pyrung export passes through
   `read_csv`, and each field rule is tried against both libraries. The known disagreements are listed in the
   test and leave the list as each is settled.
2. **Export through laddercodec (runtime dependency).** pyrung builds laddercodec's instruction objects and
   hands over the circuit; laddercodec lays it out and writes it, and its field checks apply to every export.
   pyrung's layout and token assembly go. laddercodec needs to offer: an entry that takes a series-parallel
   tree and returns rows (its private `render` already does this); the rows in memory, with the number of
   CLICK rungs each source rung became; a writer for `main.csv` plus `subroutines/`.
3. **Validation.** laddercodec gives the verdict for a field rule, by pyrung building the object. pyrung
   keeps its code names, because `allow=` depends on them, and its advice text; its bank tables go. The
   request to laddercodec is every field error of an instruction, not only the first, with uniform `.field`
   names. A rule-description API is not built.
4. **Import reads laddercodec's objects.** Last: the smallest clean saving and the hardest blocker (below).

**Moves into laddercodec** (Sam, 2026-11-15: "yes probably"), once step 2 gives pyrung a laddercodec program
to pass in: the program-structure rules (for-loop nesting depth, a oneshot or a return inside a loop, nested
calls, the 8,000-step limit) and the step estimate, as a check on a whole program. Proposed by the planner,
not yet ruled on: spelling a constant from a Python value rides the canonical-constants branch.

**Open, Sam to decide: rungs that CLICK's syntax check refuses.** pyrung's importer accepts bridges and pins
that share contacts; it was written before anyone knew what the syntax check refuses. laddercodec refuses
them: 15 of 281 fixture files. A runner job comes first: paste those fixtures and record what the syntax
check says about each.

**Small, any time (pyrung):** derive from pyclickplc the bank-name lists, the bit-bank set (written three
times), the timer and counter pairs, the value limits, the system nicknames and the writable SC and SD sets
(about 190 lines). `COMPARE_COMPATIBILITY` and `COMPARE_CONSTANT_COMPATIBILITY` have no users outside their
own test. Two things to settle: pyrung's RTC nicknames differ from pyclickplc's (`_RTC_Month` against
`_RTC_Month (1-12)`), and pyrung builds XD and YD blocks under two conventions.

#### In laddercodec

- **The field-rule restructure** goes to plain shared functions. Verdicts stay identical; message wording
  may change. All five instruction families now refuse through the shared checks. Still building: `.field`
  explicit at every raise, because pyrung needs to know which field was refused.
- **Canonical constants** (`005`, `+5`, `0ffh`) are their own branch after the restructure, once CLICK has
  been asked what it turns them into. Addresses are already canonical.
- **CLICK's own error ids** such as "(OBJ-023)" stay in messages, since that is what CLICK shows the user.
- The pyrung-specific sections of laddercodec's `csv-format.md` move to pyrung.
- **An undecodable rung no longer fails the whole program, and it fails loudly.** laddercodec replaces the
  rung with a marker rung: the comment `UNDECODED: rung N, row R: <error>` and one `Undecoded` instruction
  that acts as End in the main program and Return in a subroutine. This is on laddercodec's `main`,
  unreleased. After its release: pyrung runs the marker as a stop that says why; ClickNick drops its empty
  stand-in rung, its Simulator runs up to the marker, and Check Program lists it.

### 3. pyrung's public surface (pyrung, ClickNick)

`pyrung`, `pyrung.click` and `pyrung.circuitpy` are public. Everything under `pyrung.core` and `pyrung.dap` is
internal. The few names users need move to the top level, validation gets one public module, and ClickNick
moves onto named imports with a test that fails when one disappears. This rides pyrung's deletions release.

### 4. CLICK runner (ClickNick; used by laddercodec and pyrung)

A runner that drives the CLICK software unattended, so work that needs CLICK no longer needs Sam. It is
`devtools/click_runner.py` in ClickNick; the other repos call it as a command.

It runs on Sam's desktop while he is away, and only on a CLICK it started itself (Sam, 2026-11-15). Windows
Sandbox is the fallback if the desktop proves unworkable. Its first milestone is met: rungs pasted, copied
back and matched.

It leans on the clipboard and ClickNick's window code, not on pixel positions. It does not replace readings
from a real PLC. Jobs waiting for it:

- what CLICK writes on Open, New and Save As;
- what CLICK turns constants into (laddercodec's canonical constants);
- pyclickplc's open questions: spaces around an address, tabs, data-dump punctuation, section-name case in
  `Project.ini`;
- the field rules where pyrung and laddercodec disagree (item 2);
- what the syntax check says about the rung shapes pyrung imports and laddercodec refuses (item 2);
- the three small checks under "Only Sam can do these".

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
- **All four repos have adopted it** (2026-11-15), and their own copies are deleted. An install is pinned to
  the plugin commit it was made from. Picking up a later commit is in the plugin's README; it has been run
  once in all four repos.
- **Tooling faults** are reported to the planner and fixed in the plugin repo, once. No repo patches its own
  config around one. Its `scratchpad/roadmap.md` holds
  the open ones.

## Order by repo

| Repo | Order |
|---|---|
| pyrung | 1. Deletions release (record machinery, search, public surface), then the `Rung` to `rung` rename in tests as its own commit. 2. CLICK-match fixes from the 2026-11-10 readings and the watchdog stop. 3. Recording core. 4. One door. 5. float32 Reals, the per-PLC definitions table, the history API, calc into a pointer. `how()` work follows the recording core. The agreement test of item 2 fits in at any point; export through laddercodec follows it when laddercodec offers the tree entry. |
| laddercodec | Finish the field-rule restructure. The parity test against pyclickplc. Canonical constants as their own branch. For pyrung (item 2): the tree-in, rows-out entry; every field error of an instruction; later the whole-program check. |
| pyclickplc | Only CLICK questions remain, for the runner. The pymodbus rewrite waits until something forces it; it does not involve pyrung. |
| ClickNick | Move onto pyclickplc 0.7. The runner's first jobs. Finish `ConnectionSession` as the owner of window and project state, then split `ClickNickApp`. Then the ClickNick side of recording. |

## Only Sam can do these

- Publish each release (the tag is the gate). Waiting now: a laddercodec release, which carries the
  undecoded marker to pyrung and ClickNick.
- Decide whether pyrung's importer keeps accepting rungs that CLICK's syntax check refuses (item 2).
- Say when each repo runs its docs-deploy proof.
- Edit a ruleset, if a repo ever renames its `ci` job or its docs `build` job.
- Delete the remote `dev` branch in pyrung and in ClickNick.
- Enable Windows Sandbox, only if the runner's desktop mode proves unworkable.
- Three checks in CLICK, or leave them for the runner: leading zeros and surrounding spaces in an address;
  importing a bare space as a Text initial value; whether CLICK strips spaces from nicknames and comments.

## Settled without further work

pyrung's six unmerged branches are dropped; none matters as code, and their notes are kept.
