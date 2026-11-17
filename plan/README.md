# Ecosystem plan

This is the coordination point for pyclickplc, laddercodec, pyrung and ClickNick. It holds the work that crosses
repos, written once, and the rules all four share. Work inside one repo lives in that repo's
`scratchpad/roadmap.md`.

Last updated 2026-11-17. Latest releases: pyclickplc 0.8.0, laddercodec 0.4.0, pyrung 0.16.0, ClickNick 0.24.1.
Everything since those tags is on each repo's `main`, unreleased.

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
  locally against the sibling checkout and merges after the sibling's release. One branch does this for longer
  than usual: pyrung's validation branch builds against laddercodec's `main` and stays open until the two
  release together (item 2, "The joint release"). pyrung's `main` stays releasable on its own meanwhile.
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
- **Proved in each repo** (Sam, 2026-11-16): a deploy has run through this rule in all four.
- **A docs fix between releases** is a run by Sam with `ref` set to a commit on `main`. No session starts a
  deploy with a `ref` that is not a release tag.

## Cross-repo work

### 1. One command path, and recording (pyrung, then ClickNick)

A recording is a text file of console commands. One replayer runs it, called from three places: pytest,
ClickNick on every CLICK save, and the `replay` verb.

Order:

1. Done: the April 2026 record machinery is deleted from pyrung. The capture layer stays; it is the base the
   recording core builds on.
2. **Small core in pyrung** (started 2026-11-17 with Sam's OK). On `main`: `assert` as the check,
   `run until <condition> within N` for milestones, and the fixed `replay`. Building: `record` saves the raw
   transcript, a recording carries its scan time, and the pytest plugin collects recordings. Not confirmed on
   `main` at this sitting: the tolerance on Reals, the error on an unknown tag, and a headless `replay`.
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
  XD/YD display range and the helpers taken from ClickNick are released. ClickNick has moved onto them
  (0.7.0); pyrung is on 0.8.0.
- **laddercodec owns the CLICK ladder format, its field rules and its layout.** It stays dependency-free at
  runtime and keeps a small private copy of the bank facts. A parity test in laddercodec, with pyclickplc as
  a dev-only dependency, keeps the copy honest. It does not compare writable SC points: pyclickplc's
  `WRITABLE_SC` means "writable in Data View", and the ladder-writable list is laddercodec's own.
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

**Where the two disagree, the case is logged and the fix goes into laddercodec** (Sam, 2026-11-17; this
replaces "the refusal wins by default" of 2026-11-15). pyrung does not take on a refusal only because
laddercodec has it. Each case is a row in [`rule-decisions.md`](rule-decisions.md). CLICK's own dialog settles
a row that has no answer yet.

The two sets are different kinds of finding (Sam, 2026-11-15): laddercodec's are what CLICK's editor will
not accept in a field; many of pyrung's corner cases are what a real PLC was seen to do in conformance
testing.

Of the 34 field rules, 25 refuse the same thing in both. Every case where they differ is a row in
[`rule-decisions.md`](rule-decisions.md), with the rule for deciding a row. Rows are decided there, one at
a time, and nowhere else.

##### The joint release

laddercodec and pyrung release together, and laddercodec's API is provisional until then, so that it can
change on what pyrung finds while adopting it (Sam, 2026-11-17). There is no separate laddercodec release for
the new error. Settled the same day:

- **What closes it:** pyrung's validation (step 2) passes its agreement tests against laddercodec's `main`,
  and Sam has reviewed laddercodec's list of code names from a user's view. Nothing else is waited for.
- **What goes in before it:** the rest of laddercodec's breaking changes (see "In laddercodec"), so the API
  breaks once. Export and import through laddercodec (steps 5 and 6) come after it, as additive releases.
- **Where pyrung's work lives:** on a branch that builds against laddercodec's `main` and stays open until
  the joint release. It does not wait for a laddercodec release, and it does not merge early.
- **One name per rule.** A refusal of a field rule is named by laddercodec's kebab-case `.code`, and that is
  the name pyrung's `allow=` takes. pyrung keeps a code of its own only for a rule that only it has. There is
  no alias layer from the old `CLK_` names.

Steps keep their numbers, because the roadmaps refer to them.

1. Done, on laddercodec's `main`: one `FieldError` that carries every refusal of the instruction in
   `.errors`, each with `.field` as `Class.attr`, a `.reason` from a small fixed set and `.click_id` where
   CLICK has an error id. Messages stay free text and are not API. `.field` strings follow the CSV names and
   are still changing (`Math.result` is now `Math.dest`), so nothing should match on an old string. The
   public way to read what the checks refuse is `read_csv(..., unchecked=True)`; in Python, `raw(...)`.
2. **pyrung: validation on laddercodec** (laddercodec becomes a runtime dependency here). Not started. It
   opens after pyrung's public-surface pass has landed (item 3), because that pass moves modules. For a
   field rule, pyrung builds the instruction's laddercodec object and turns each refusal into a finding,
   named as above, with pyrung's advice text. Its bank tables and the checks that read them go. Its existing
   validation tests are the agreement test: each passes as before, or its changed verdict is a row in
   `rule-decisions.md`. The pyrung session reports friction with the API to the laddercodec session as it
   goes; that feedback is what laddercodec's release is waiting for.
3. **The runner: whole grids, not samples.** For each dialog field, every bank and constant kind is tried,
   and the answers are kept as test data in laddercodec. laddercodec writes the case lists, ClickNick's
   runner runs them, and laddercodec commits cases and answers (Sam, 2026-11-16). That is the one place
   CLICK's field rules are recorded; laddercodec's rules are tested against it, and pyrung reaches it through
   laddercodec. A paste followed by a copy back is a separate question from the dialog and gets its own runs.
   Run so far: Math, Copy and Out (the preflight and risky lists, and the SD and SC picker lists, which
   answer the large SD and SC sweeps without running them) and Receive. Next, in this order (Sam,
   2026-11-17): Fill mode, which laddercodec's Fill cases wait on; the Timer, Counter, Shift, For and Drum
   dialogs; then whatever is left of the full Math, Copy and Out grids. The two sessions describe how much
   of the full grids has run differently; to be settled between them.
4. **laddercodec: catch up with the editor.** Decoding no longer depends on the checks: a stored value that
   a rule refuses decodes as its instruction, with a warning. The rules for Math, Copy, Out, Pack and Unpack
   are tightened to CLICK's answers, and laddercodec now gives the editor's answer on every row of section
   A. Left: the other instruction families as their grids arrive. laddercodec's refusals are the editor's
   rules plus what breaks the encoding or crashes CLICK on a paste; a rule that rests on what a PLC does
   stays in pyrung.
5. **Export through laddercodec.** pyrung builds laddercodec's instruction objects and hands over the
   circuit; laddercodec lays it out and writes it. pyrung's layout and token assembly go. laddercodec needs
   to offer: an entry that takes a series-parallel tree and returns rows (its private `render` does this from
   a network and a tree); the rows in memory, with the number of CLICK rungs each source rung became; a
   writer for `main.csv` plus `subroutines/`.
6. **Import reads laddercodec's objects.** Last: the smallest clean saving and the hardest blocker (below).

**Moves into laddercodec** (Sam, 2026-11-16):

- The program-structure rules (for-loop nesting depth, a oneshot or a return inside a loop, nested calls,
  the 8,000-step limit) and the step estimate, as a check on a whole program. This comes once step 5 gives
  pyrung a laddercodec program to pass in.
- Spelling a constant from a Python value (hex, Real, text). laddercodec's encoder now writes constants as
  CLICK stores them; the move out of pyrung has not been made.

**Decided (Sam, 2026-11-16): pyrung imports a rung that CLICK's Syntax Check refuses, and says so.** The
runner has asked (`rule-decisions.md` section D): the check refuses a bridge, pins that share contacts, a
reset wire that also feeds an output, and a reset with nothing wired to it. pyrung's importer accepts all of
them and keeps doing so, so that someone who draws such a rung is told that CLICK will not accept it as
drawn. Such a rung can also sit in a saved project: CLICK saves a project that fails the Syntax Check and
only blocks the write to the PLC (Sam, 2026-11-16), so an importer that refused it could not open that
project. What they are told comes from laddercodec's `check()`, which gives the Syntax Check's codes on its
`main`; pyrung relays those findings and holds no rule of its own for these shapes, so its bridge
warning goes when the relay arrives. The relay needs laddercodec as a dependency, which pyrung gains in
step 2; the importer stays as it is until then.

**Small, any time (pyrung):** derive from pyclickplc the bank-name lists, the bit-bank set (written three
times), the timer and counter pairs and the value limits. The system nicknames already come from
pyclickplc's catalog; what is left of the original 190 lines has not been recounted. The
ladder-writable SC and SD sets are not derived from pyclickplc; they go when validation moves.
`COMPARE_COMPATIBILITY` and `COMPARE_CONSTANT_COMPATIBILITY` have no users outside their
own test. pyrung builds XD and YD blocks under two conventions, which is still to settle.

#### In laddercodec

- **The breaking API changes, all before the joint release.** On `main`: one `LaddercodecError` tree;
  `decode()` always returns a list; the Timer, Counter, Contact, Coil, Drum, Math, Search, ForLoop and raw
  fields take their CSV names. In flight: the same for Copy, BlockCopy, Pack and Unpack. Still to come: a
  kebab-case `.code` on each refusal, frozen instructions, and `wire_down` moving into the rung grid. None of
  this was in the plan before 2026-11-17. ClickNick reads laddercodec too, so its move onto the new names
  belongs to the same release; that move has not been sized.
- **The parity test against pyclickplc** is not started.
- **Canonical constants:** the encoder writes CLICK's form. Three questions for CLICK remain, with the
  runner: a trailing zero, the digits of a Real in Math, and the largest Real in Math.
- **CLICK's own error ids** such as "(OBJ-023)" stay in messages, since that is what CLICK shows the user.
- The pyrung-specific sections of laddercodec's `csv-format.md` move to pyrung.
- **An undecodable rung no longer fails the whole program, and it fails loudly.** laddercodec replaces the
  rung with a marker rung: the comment `UNDECODED: rung N, row R: <error>` and one `Undecoded` instruction
  that acts as End in the main program and Return in a subroutine. This is on laddercodec's `main`,
  unreleased. After the joint release: pyrung runs the marker as a stop that says why; ClickNick drops its empty
  stand-in rung, its Simulator runs up to the marker, and Check Program lists it.

### 3. pyrung's public surface (pyrung, ClickNick)

`pyrung`, `pyrung.click` and `pyrung.circuitpy` are public. Everything under `pyrung.core` and `pyrung.dap` is
internal. The few names users need move to the top level, validation gets one public module, and ClickNick
moves onto named imports with a test that fails when one disappears. Not started.

This pass and the `Rung` to `rung` rename are pyrung's next work after the recording branches now in build,
and the deletions release follows them, on its own and ahead of the joint release (Sam, 2026-11-17). The
pass lands before the validation branch opens.

### 4. CLICK runner (ClickNick; used by laddercodec and pyrung)

A runner that drives the CLICK software unattended, so work that needs CLICK no longer needs Sam. It is
`devtools/click_runner.py` in ClickNick; the other repos call it as a command.

It runs on Sam's desktop while he is away, and only on a CLICK it started itself (Sam, 2026-11-15). Desktop
mode has held up over the runs so far. Windows Sandbox stays the fallback, which Sam would have to enable,
and does not look needed. It leans on the clipboard
and ClickNick's window code, not on pixel positions.

What it does now: paste and copy back; `try`, which asks the Math, Copy, Out, Receive, Compare contact and
Search dialogs, writes results as it goes and resumes a long run; nickname CSV import; Read Data; System
Configuration; the Address Picker.

**Hardware rounds go through ClickNick too.** A job tool writes a project to the conformance PLC and reads
the answers back, so the other sessions queue their PLC questions with the ClickNick session. Sam is needed
only for wiring, power cycles and anything that takes a person at the PLC.

Jobs waiting:

- the dialog work in item 2, step 3, in its order;
- what CLICK writes on New (Open and Save As have run);
- pyclickplc's: the nickname export's encoding; `[PLCName]` in CLICK 3 and a second matching section in
  CLICK 4; the case and placement of the hardware sections in CLICK 4;
- laddercodec's: a trailing zero; Fill with text or a bare number (needs Fill mode); a character above
  U+FFFF into TXT; a pointer on both sides; the Real edge and digits in Math; and PLC runs B and C, which
  need distinct live X inputs (an input override, or Sam);
- pyrung's: the Y gaps in slots 2 to 8, FC15 across an X gap, and reads past XD8/YD8. On 2026-11-17 the
  ClickNick session did not list these as open; the two sessions are matching them up;
- the three small checks under "Only Sam can do these", for a value typed in CLICK. They are answered for
  CSV import.

### 5. Test corpus (pyrung first; later all four)

- **Now:** small programs written fresh, each around one PLC idiom (integer steppers, seal-in latches,
  one-shot chains, cascaded timers, gated counters, drums, pointers, handshakes, alarm and reset, shift
  registers, first-scan setup). Each case is a program, a goal, and a hand-written recording that reaches the
  goal. Idiom-led, not a generated grid.
- **Later:** Sam's `click-plc-cookbook`, a folder of real programs each with its own pyrung workspace.
  Sanitizing it is Sam's task alone, and no session has access before he opens it. Real programs then also
  exercise laddercodec's decoder, pyrung's import and ClickNick's Check Program.

### 6. Prover search removal (pyrung, this site)

Done on pyrung's `main`, unreleased: the exhaustive search, the `Proven` verdict, lock files, the
`pyrung lock` command, the `prove` console verb and the `lock=` tag flag are gone. The static facts stay,
because `how()` and validation use them, and they are now checked against real runs; the facts those runs
refuted are held as strict expected failures on pyrung's roadmap. This site no longer describes `prove` or
lock files.

Left: the release. Until it goes out, this site describes a pyrung that is not on PyPI.

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
| pyrung | 1. Finish the recording branches now in build (`record`, pytest collection). 2. The public-surface pass, then the `Rung` to `rung` rename in tests as its own commit; the deletions release follows on Sam's tag. 3. Validation onto laddercodec (item 2, step 2) on its open branch, up to the joint release. 4. CLICK-match fixes from the 2026-11-10 readings. There is no watchdog stop for now (Sam, 2026-11-17), only a possible warning on a heavy For loop. 5. One door. 6. float32 Reals, the per-PLC definitions table, the history API, calc into a pointer. `how()` work follows the recording core. Export through laddercodec comes after the joint release. |
| laddercodec | Finish the breaking API changes (item 2, "In laddercodec"). Take pyrung's reports from adopting the API. The joint release, on Sam's tag. The parity test against pyclickplc. Rules tightened to each grid as the runner returns it. After the joint release: the tree-in, rows-out entry and the whole-program check. |
| pyclickplc | Merge #49 (`ClickServer` answers as a real CLICK does), then 0.9.0 on Sam's tag; pyrung updates five tests when it moves to it. Otherwise only CLICK questions remain, with the ClickNick session. |
| ClickNick | A release now, on Sam's tag. Then the runner, ahead of recording (Sam, 2026-11-17): Fill mode; the Timer, Counter, Shift, For and Drum dialogs; the full grids. Named pyrung imports with pyrung's deletions release, and laddercodec's new names with the joint release. Then the ClickNick side of recording. |

## Only Sam can do these

- Publish each release (the tag is the gate). As of 2026-11-17:
  - ClickNick: ready now.
  - pyclickplc 0.9.0: once #49 has merged.
  - pyrung's deletions release: after the public-surface pass and the `Rung` rename.
  - laddercodec and pyrung together: when the joint release closes (item 2).
- Review laddercodec's list of code names from a user's view. The joint release waits on it.
- Decide what a declared `min`, `max` or `choices` means on a tag the ladder writes (pyrung, deferred).
- At the PLC: wiring, power cycles, and distinct live X inputs for laddercodec's runs B and C.
- Confirm the deciding rule in `rule-decisions.md`, then decide the rows it does not settle. Rows D1 and D3
  were the first, decided 2026-11-16: pyrung's importer keeps accepting rungs that CLICK's Syntax Check
  refuses and reports them.
- Edit a ruleset, if a repo ever renames its `ci` job or its docs `build` job.
- Delete the remote `dev` branch in pyrung, if it is still there. ClickNick has none.
- Three checks in CLICK, for a value typed in CLICK, or leave them for the runner: leading zeros and
  surrounding spaces in an address; a bare space as a Text initial value; whether CLICK strips spaces from
  nicknames and comments. The runner has answered all three for CSV import.

## Settled without further work

pyrung's six unmerged branches are dropped; none matters as code, and their notes are kept.
