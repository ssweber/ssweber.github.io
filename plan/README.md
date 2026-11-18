# Ecosystem plan

This is the coordination point for pyclickplc, laddercodec, pyrung and ClickNick. It holds the work that
crosses repos, written once, and the rules all four share. Work inside one repo lives in that repo's
`scratchpad/roadmap.md`.

Last updated 2026-11-18. Latest releases: pyclickplc 0.9.1, laddercodec 0.4.0, pyrung 0.16.0, ClickNick 0.24.1.
Everything since those tags is on each repo's `main`, unreleased.

## How to use this file

- **Sessions check in with the planner after each big finish** (Sam, 2026-11-18). A big finish is a roadmap
  step done, a result that changes another repo's work, or a blocker. The planner answers with the next step,
  taken from this file and from Sam's rulings, and keeps this file current. A session still talks to Sam
  directly. Only Sam gives the go for a tag, a release, a run that writes to the PLC, or a rule decision.
  He has preapproved the runs of ClickNick's runner (see "Only Sam can do these").
- **Before a CLICK question goes to Sam, the session checks three things** (Sam, 2026-11-18). Is it already
  answered in one of the four repos? Can ClickNick's runner answer it today? Could the runner answer it
  with an extension? Only what is left goes to Sam, with a line on why the runner cannot do it.

- Write each item in one place. If it crosses repos, it goes here. Otherwise it goes in the roadmap of the repo
  that owns it.
- When an item lands, delete it. This file lists what is still to do, not what was done.
- Research findings below were read from code by agents. They are marked "unconfirmed" until the session that
  owns the code has checked them.
- These repos are public. Nothing here records where a settled CLICK rule came from. Nothing here comes from
  Sam's own PLC programs.

## Shared rules

- **Branches.** Ordinary feature and refactor branches go into `main`, which must always be releasable. No repo
  has a long-lived `dev` trunk. Work does not wait on Sam. A session pushes its branch and opens the PR. It
  squash-merges the PR itself once CI is green on the last commit and a fresh reviewer has passed that commit.
  If a PR's roadmap label says it needs Sam's judgment, CLICK software or a real PLC, the PR waits until that
  part is done. `main` changes only through PRs. No session pushes to it.
- **Releases are Sam's gate.** Nothing is tagged, released or published until Sam says so in that session, or
  does it himself. Publishing the GitHub release sends the package to PyPI and deploys its docs site. Every PR
  adds its own CHANGELOG line, so `main` can be released at any commit.
- **Builds.** Every repo keeps BOB arcs. BOB is the skill that a session follows to run a job
  through agents. Builder agents write each branch, and a fresh reviewer agent reads each diff. An
  arc is one such job, made of several branches, with its own arc document and ledger. Only pyrung
  keeps the merge train, and its trains now land on `main`. A merge train is a set of ready branches
  that are merged together, tested once as that merge, and landed on `main` as the exact merge that
  was tested. In laddercodec and ClickNick the queue and trains are removed, and CI is the gate. The
  queue is BOB's merge queue. It runs the test stages for each branch or train that a session
  submits, one job at a time. The hook stays in both. The hook is a check that BOB runs before each
  tool call that an agent makes. It gives agent test runs a timeout and a memory cap, and it keeps
  reviewer agents read-only. ClickNick's CI runs its tests on its Windows runner, not only lint. The
  BOB skill, the agent files, the hook and the queue have one source (item 7). No repo edits its own
  copy.
- **A branch that needs an unreleased sibling** (a ClickNick branch that needs a new pyrung, say) is tested
  locally against the sibling checkout. It merges after the sibling's release. One branch stays open longer
  than that. pyrung's validation branch builds against laddercodec's `main` and stays open until the two
  release together (item 2, "The joint release"). Meanwhile pyrung's `main` stays releasable on its own.
- **Arc folders stay out of git.** They are working state (ledgers, reviews, logs). When an arc closes, its
  open items move into the repo's roadmap, and you can delete the folder.
- **Labels.** Each roadmap item says what it needs: CLICK software, a real PLC, Sam's judgment, or nothing
  (refactor only). Never queue work that needs nothing behind work that needs Sam.
- **Less code first.** Do deletion and consolidation before new features. Keep a shared mechanism only if it
  removes more lines than it adds. Plain shared functions are an acceptable end state.
- **Addresses.** Accept what CLICK accepts, and write the canonical form. CLICK's dialogs accept `x1` and
  `ds1` and reformat them to `X001` and `DS1`. Every writer in every repo produces the canonical form.
- **No provenance.** The repo records what a rule is, in code, tests and user docs. The plan records what is
  still in doubt. Nothing records where a settled rule came from.
- **Sam's programs.** No session reads Sam's real PLC programs until he has sanitized them and opened access
  (see "Test corpus").

## Before new work starts

Each repo's `scratchpad/roadmap.md` is on its `main`. One thing is left:

- Sweep the cruft out of every repo. The cruft is stale memories, branches, worktrees, closed arcs
  and old plans. Afterwards the roadmaps are the only live statement of intent. There is one hold.
  The sweep keeps laddercodec's validation reports and ledgers until the classifier dry-run list has
  been sorted against them.

### How `main` is protected (in place in all four repos since 2026-11-15)

- **Ruleset on `main`:** no deletion, no force push, and changes only through a pull request. Two checks are
  required on a branch that is up to date: `ci` and the docs `build`.
- **`ci` is one job at the end of `ci.yml`.** It passes only when every test job passed. A repo that
  adds a test job lists it in `ci`'s `needs`, and adds it to the check in `ci` that every test job
  passed. `if: always()` stays. Without it, the job is skipped when a test fails, and a skipped
  required check counts as passing. A repo may change its Python versions without a ruleset edit.
- **CI runs on pull requests and by hand.** It does not run again on a push to `main`. A PR must be up to date
  to merge, so the merged tree is the tree that the PR already tested. One cost is that a new PR starts with a
  cold dependency cache.
- **GitHub deletes merged branches automatically.** Check a PR's state before you push to its branch again. A
  push to a merged branch re-creates it.
- **pyrung's CI** runs the full suite on Python 3.11 and 3.14. On 3.12 and 3.13 it runs only the tests of its
  bytecode-reading modules. pyrung's local gate keeps its own `test` stage, because Sam wants a failure found
  before the push.

### Docs deploy: one rule for all four repos

A docs site is deployed in one way only. A person or the release starts `docs.yml` on `main`, and it builds the
release's tag.

- **`docs.yml` triggers:** `pull_request` into `main`, which builds and checks and never deploys; and
  `workflow_dispatch` with an optional `ref` input. There is no `push` trigger and no `release` trigger.
- **What it builds:** on a dispatch it checks out `ref`. An empty `ref` means the tag of the latest release
  (`gh release view`). The workflow file is always `main`'s copy. If a deploy breaks, you repair it on `main`
  and run it again without a new release.
- **Who starts it:** `publish.yml` runs on a published release. Its last job runs after the PyPI upload and
  after anything the docs read from the release (ClickNick's trust report). That job runs
  `gh workflow run docs.yml --ref main -f ref=<tag>`. It needs `actions: write`. It is skipped for a
  pre-release.
- **Details that have bitten:** put `concurrency: pages` on the deploy job, not on the workflow. Otherwise a
  queued PR build can displace a waiting deploy. Take the cache-busting suffix from the commit that was built
  (`git rev-parse`), not from `GITHUB_SHA`. `gh release create --target` needs a full sha.
- **Settings:** the `github-pages` environment allows `main` only. No tag rule is needed.
- **Proved in each repo** (Sam, 2026-11-16): a deploy has run through this rule in all four.
- **A docs fix between releases** is a run by Sam with `ref` set to a commit on `main`. No session starts a
  deploy with a `ref` that is not a release tag.

## Cross-repo work

### 1. One command path, and recording (pyrung, then ClickNick)

A recording is a text file of console commands. One replayer runs it. Three callers use that replayer: pytest,
ClickNick on every CLICK save, and the `replay` verb.

Order:

1. Done: the pyrung session deleted the April 2026 record machinery. The capture layer stays, because the
   recording core builds on it.
2. **Small core in pyrung** (started 2026-11-17 with Sam's OK). On `main`: `assert` as the check,
   `run until <condition> within N` for milestones, and the fixed `replay`. Being built: `record` saves the
   raw transcript, a recording carries its scan time, and the pytest plugin collects recordings. Three things
   were not confirmed on `main` at this sitting: the tolerance on Reals, the error on an unknown tag, and a
   headless `replay`.
3. **Console commands for every change, in pyrung.** Every action that changes state becomes a console
   command, so everything a user does can be recorded. The pyrung session deletes the old structured
   requests for those actions (force, patch, set mode and the rest) and does not wrap them. Reads stay as
   requests. pyrung, ClickNick and the VS Code extension release together.
4. **ClickNick.** The panels send text. Recordings run on every CLICK save, off the Tk thread and only in a
   permanent workspace. Right-clicking offers "Assert this". Starting a recording prompts the workspace setup,
   so recordings land in a workspace that persists.

Also settled:

- If the user declines the setup prompt, nothing is recorded.
- Recordings hold names: the nickname, or the display address where there is no nickname.
- When the user renames tags, the names in recordings change at the first build that carries the new
  names. That build is a Sync or a CLICK save. The names do not change while the user edits. A name
  that still exists is left alone, so swapping two names changes nothing in a recording. A name that
  no longer exists is replaced by the name that its old address has now.
- The rename function lives in pyrung, because it has to parse expressions. ClickNick supplies the old-to-new
  map.

Later, from the `how()` work: a plan from `how()` is written in the same format and run by the same replayer.
So the planned "verdict kernel" is the replayer plus `assert`. It is not a module of its own.

### 2. Who owns what (pyclickplc, laddercodec, pyrung, ClickNick)

The goal is one source of truth for each CLICK fact. Fewer lines is a bonus, not the measure.

- **pyclickplc owns address and bank facts.** These are released: `parse_address` as CLICK does it,
  the stricter CSV reader, the XD/YD display range, and the helpers taken from ClickNick. ClickNick
  uses them from pyclickplc 0.7.0. pyrung uses pyclickplc 0.8.0.
- **laddercodec owns the CLICK ladder format, its field rules and its layout.** It stays dependency-free at
  runtime and keeps a small private copy of the bank facts. A parity test in laddercodec keeps the copy
  honest. The test uses pyclickplc as a dev-only dependency. It does not compare writable SC points.
  pyclickplc's `WRITABLE_SC` means "writable in Data View", and the ladder-writable list belongs to
  laddercodec alone.
- **pyrung owns what only pyrung can know:** the tag map and every check that depends on it (contiguity, two
  tags on one address, pointer reach, text windows); turning Python expressions into CLICK forms; the rules
  for Python that has no CLICK form; the advice in its messages; the importer's naming and emitting; and the
  project scaffold.

#### pyrung onto laddercodec

On 2026-11-15, research agents sized this by reading `main` of the three repos. They ran probes and did not run
the test suites. The sizes are unconfirmed until the owning sessions have checked them.

| pyrung area | Lines | Lines that duplicate laddercodec |
|---|---|---|
| Export, `click/ladder` | 4,077 | about 650: the layout (the same algorithm; two programs came out byte-identical through both) and the token assembly |
| Import, `click/codegen` | 7,719 | 1,300 to 2,000: CSV reading, token parsing, the grid-to-tree reduction. The earlier "7,500" was the size of the whole importer |
| Validation and `capabilities.py` | about 4,600 | about 2,200: 34 of the 60 `CLK_` codes are field rules |

**Where the two disagree, the case is logged and the fix goes into laddercodec** (Sam, 2026-11-17). This
replaces "the refusal wins by default" of 2026-11-15. pyrung does not adopt a refusal only because laddercodec
has it. Each case is a row in [`rule-decisions.md`](rule-decisions.md). If a row has no answer yet, CLICK's own
dialog settles it.

Sam decided on 2026-11-15 that the two sets are different kinds of finding. laddercodec's findings are what
CLICK's editor will not accept in a field. Many of pyrung's corner cases are what a real PLC was seen to do in
conformance testing.

Of the 34 field rules, 25 refuse the same thing in both libraries. Every case where they differ is a
row in [`rule-decisions.md`](rule-decisions.md), together with the rule for deciding a row. Rows are
decided there, one at a time, and nowhere else.

##### The joint release

laddercodec and pyrung release together. laddercodec's API is provisional until then, so that it can
change on what pyrung finds while adopting it (Sam, 2026-11-17). laddercodec makes no separate
release for the new `FieldError` (step 1). Sam settled the following on the same day:

- **What closes it:** pyrung's validation (step 2) passes its agreement tests against laddercodec's `main`.
  Sam approved laddercodec's 93 code names on 2026-11-18, so that half is done. A code added later goes
  back to him. Before the tag he also reviews the public names that laddercodec added for export.
- **What goes in before it:** the rest of laddercodec's breaking changes (see "In laddercodec"), so the API
  breaks once. Export and import through laddercodec (steps 5 and 6) come after it, as additive releases.
- **Where pyrung's work lives:** on a branch that builds against laddercodec's `main` and stays open until the
  joint release. It does not wait for a laddercodec release, and it does not merge early.
- **One name per rule.** laddercodec names a refusal of a field rule with its kebab-case `.code`. That is the
  name that pyrung's `allow=` accepts. pyrung keeps a code of its own only for a rule that only pyrung has.
  There is no alias layer from the old `CLK_` names.

Steps keep their numbers, because the roadmaps refer to them.

1. Done, on laddercodec's `main`: laddercodec raises one `FieldError` that carries every refusal of
   the instruction in `.errors`. Each refusal has `.field` as `Class.attr`, a `.reason` from a small
   fixed set, and `.click_id` where CLICK has an error id. Messages are free text and are not API.
   The `.field` strings follow the CSV names and are still changing (`Math.result` is now
   `Math.dest`), so nothing should match on an old string. To read what the checks would refuse,
   call `read_csv(..., unchecked=True)`, or `raw(...)` in Python. These are the public ways to do
   it.
2. **pyrung: validation on laddercodec** (laddercodec becomes a runtime dependency here). Not
   started. It opens after pyrung's public-surface pass and the `Rung` rename have landed (item 3).
   The pass moves modules, and the rename touches every test file. The branch needs a git dependency
   on laddercodec's `main`, and the pyrung session is checking that its merge queue and CI accept
   one. For a field rule, pyrung's validation builds the instruction's laddercodec object and
   turns each refusal into a finding. The finding uses the name above and carries pyrung's advice
   text. The pyrung session removes pyrung's bank tables and the checks that read them. pyrung's
   existing validation tests are the agreement test. Each one either passes as before, or its
   changed verdict becomes a row in `rule-decisions.md`. As it goes, the pyrung session reports
   friction with the API to the laddercodec session, and tells the planner. The joint release is
   waiting for that feedback.
3. **The runner: whole grids, not samples.** For each dialog field, the runner tries every bank and
   constant kind, and the answers are kept as test data in laddercodec. The laddercodec session
   writes the case lists, ClickNick's runner runs them, and laddercodec commits the cases and
   answers (Sam, 2026-11-16). That is the one place where CLICK's field rules are recorded.
   laddercodec's rules are tested against it, and pyrung reaches it through laddercodec. A paste
   followed by a copy back is a separate question from the dialog and gets its own runs. The runner
   has run the Math, Copy, Out and Receive dialogs. The laddercodec session reports that it now
   answers Compare and Search too. For Math, Copy and Out it ran the preflight and
   risky lists, and the SD and SC picker lists. The picker lists answer the large SD and SC sweeps
   without running those sweeps. Next, in this order (Sam, 2026-11-17): Fill mode, which
   laddercodec's Fill cases wait on; the Timer, Counter, Shift, For and Drum dialogs; then whatever
   is left of the full Math, Copy and Out grids. The laddercodec session and the ClickNick session
   describe differently how much of the full grids has run. They are to settle it between them.
4. **laddercodec: catch up with the editor.** Decoding no longer depends on the checks. If a rule
   refuses a stored value, laddercodec decodes it as its instruction and gives a warning. The rules
   for Math, Copy, Out, Pack and Unpack are tightened to CLICK's answers, and laddercodec now
   returns the editor's answer on every row of section A in `rule-decisions.md`. Left to do: the
   other instruction families, as their grids arrive. laddercodec refuses what the editor refuses,
   and what breaks the encoding or crashes CLICK on a paste. A rule that rests on what a PLC does
   stays in pyrung.
5. **Export through laddercodec.** The pyrung session makes pyrung build laddercodec's instruction
   objects and hand over the circuit. laddercodec then lays it out and writes it, and pyrung's
   layout and token assembly are removed. laddercodec's side is on its `main`. `lay_out(circuit)`
   takes a `Circuit` and returns its CLICK rungs. `csv_rows()` returns the rows in memory.
   `write_bundle()` writes `main.csv` plus `subroutines/<name>.csv`. It refuses two subroutine
   names that differ only in case, as CLICK's own dialog does (GUI-036). Three things are open:
   - `lay_out` refuses a box after a box with pins, because nobody has captured how CLICK draws it.
   - A raw instruction cannot take pins, so Email, Home, Position and Velocity cannot have their
     pins wired.
   - pyrung's conformance probes need a public way to build an instruction that the checks
     refuse. Sam chose the form on 2026-11-18: `allow=` on `read_csv` and `read_bundle`. A
     refusal whose code is listed is kept, and any other refusal raises. `encode()` and the CSV
     writers write such an instruction from its fields. `unchecked=True` does not change. The
     laddercodec session builds it after the parity test. Its brief also describes the later form
     for one instruction, which pyrung's export needs in step 5.
6. **Import reads laddercodec's objects.** This comes last. It is the smallest clean saving and the
   hardest blocker.

**Moves into laddercodec** (Sam, 2026-11-16):

- The program-structure rules (for-loop nesting depth, a oneshot or a return inside a loop, nested calls, the
  8,000-step limit) and the step estimate, as a check on a whole program. This move comes once step 5 gives
  pyrung a laddercodec program to pass in.
- Spelling a constant from a Python value (hex, Real, text). laddercodec's encoder now writes constants as
  CLICK stores them. Nobody has moved the spelling code out of pyrung yet.

**Decided (Sam, 2026-11-16): pyrung imports a rung that CLICK's Syntax Check refuses, and says so.** The runner
has asked CLICK (`rule-decisions.md` section D), and the check refuses these four shapes: a bridge, pins that
share contacts, a reset wire that also feeds an output, and a reset with nothing wired to it. pyrung's importer
accepts all four and keeps doing so. Someone who draws such a rung is then told that CLICK will not accept it
as drawn. Such a rung can also sit in a saved project. CLICK saves a project that fails the Syntax Check and
only blocks the write to the PLC (Sam, 2026-11-16), so an importer that refused the rung could not open that
project. The message comes from laddercodec's `check()`, which returns the Syntax Check's codes on its `main`.
pyrung passes those findings on as they are (this is the relay) and has no rule of its own for these shapes.
pyrung's bridge warning goes when the relay arrives. The relay needs laddercodec as a dependency, which pyrung
gains in step 2. Until then the importer stays as it is.

**Small, any time (pyrung):** the pyrung session derives these from pyclickplc: the bank-name lists,
the bit-bank set (written three times), the timer and counter pairs and the value limits. The system
nicknames already come from pyclickplc's catalog. pyrung's system-nickname code was 190 lines, and
nobody has recounted what is left of it. The ladder-writable SC and SD sets are not derived from
pyclickplc, and the pyrung session removes them when validation moves. Nothing outside their own
test uses `COMPARE_COMPATIBILITY` and `COMPARE_CONSTANT_COMPATIBILITY`. pyrung builds XD and YD
blocks under two conventions, and the choice between them is still to settle.

#### In laddercodec

- **The breaking API changes are all on `main`.** They are: one `LaddercodecError` tree; `decode()` always
  returns a list; the instruction fields use their CSV names; a kebab-case `.code` on every refusal, finding
  and `LayoutError`; frozen instructions, changed with `laddercodec.replace()`; a frozen `Rung`; and a `Tee`
  in the rung grid where `wire_down` was. `main` also exports a `Literal` alias for each fixed set of field
  values, such as `ContactKind`. ClickNick reads laddercodec too, so its move onto the new names belongs to
  the joint release. The ClickNick session lists what must change in its roadmap item 9.
- **The code names are final** (Sam, 2026-11-18). The list is `docs/guides/codes.md`, which is generated
  from the code and holds 93 codes. pyrung's `allow=` uses these names. Sam approved a 94th on 2026-11-18,
  `duplicate-subroutine-name`. It is on a branch that is in review.
- **The parity test against pyclickplc** is in review. It found no disagreement.
- **Canonical constants:** the encoder writes CLICK's form. Two questions for CLICK remain, and the runner
  has cases queued for both: the digits of a Real in Math, and the largest Real in Math.
- **CLICK's own error ids** such as "(OBJ-023)" stay in messages, because CLICK shows them to the user.
- The pyrung-specific sections of laddercodec's `csv-format.md` move to pyrung.
- **An undecodable rung no longer fails the whole program, and it fails loudly.** laddercodec
  replaces the rung with a marker rung. The marker rung has the comment
  `UNDECODED: rung N, row R: <error>` and one `Undecoded` instruction. In the main program that
  instruction acts as End. In a subroutine it acts as Return. This is on laddercodec's `main`,
  unreleased. After the joint release, pyrung runs the marker as a stop that says why. ClickNick
  drops its empty stand-in rung, its Simulator runs up to the marker, and its Check Program lists
  the marker.

### 3. pyrung's public surface (pyrung, ClickNick)

`pyrung`, `pyrung.click`, `pyrung.circuitpy`, `pyrung.validation` and `pyrung.live` are public. Everything
under `pyrung.core` and `pyrung.dap` is internal. pyrung's half is on its `main` (#94). Every name that
ClickNick uses has a public home, and the old internal paths still import. The ClickNick session moves
ClickNick onto the public names with pyrung's deletions release, and adds a test that fails when one of them
disappears. Its roadmap item 8 holds the list.

Sam decided on 2026-11-17 that the `Rung` to `rung` rename follows the pass. The rename is on pyrung's
`main` (#95). The deletions release follows it, on its own and ahead of the joint release.
The deletions release also removes the public name `Rung` (Sam, 2026-11-18). A rung is then written only as
`with rung(...)`.

### 4. CLICK runner (ClickNick; used by laddercodec and pyrung)

The runner drives the CLICK software unattended, so work that needs CLICK no longer needs Sam. It is
`devtools/click_runner.py` in ClickNick. The other repos call it as a command.

It runs on Sam's desktop while he is away, and only on a CLICK that it started itself (Sam, 2026-11-15).
Desktop mode has held up over the runs so far. Windows Sandbox stays the fallback. Sam would have to enable it,
and it does not look needed. The runner relies on the clipboard and on ClickNick's window code, not on pixel
positions.

What it does now: paste and copy back; `try`, which asks the Math, Copy, Out, Receive, Compare contact and
Search dialogs, writes results as it goes and resumes a long run; nickname CSV import; Read Data; System
Configuration; the Address Picker.

**Hardware rounds go through ClickNick too.** A job tool writes a project to the conformance PLC and reads the
answers back. The other sessions queue their PLC questions with the ClickNick session. Sam is needed only for
wiring, power cycles and anything else that takes a person at the PLC.

Jobs waiting:

- the dialog work in item 2, step 3, in its order;
- what CLICK writes on New (Open and Save As have run);
- pyclickplc's: the nickname export's encoding. Its `Project.ini` questions get no run (the planner,
  2026-11-18). The runs of 2026-11-16 settle the PLC name, and pyclickplc records the rest as untested
  assumptions;
- laddercodec's: Fill with text or a bare number (needs Fill mode); a character above
  U+FFFF into TXT; a pointer on both sides; the Real edge and digits in Math; and PLC runs B and C, which
  need distinct live X inputs (an input override, or Sam);
- pyrung's: the Y gaps in slots 2 to 8, FC15 across an X gap, and reads past XD8/YD8. On 2026-11-17 the
  ClickNick session did not list these as open. The two sessions are matching them up;
- the three small checks under "Only Sam can do these", for a value that is typed into CLICK. The
  runner has already answered them for a value that comes from a CSV import.

### 5. Test corpus (pyrung first; later all four)

- **Now:** small programs written fresh, each around one PLC idiom (integer steppers, seal-in latches,
  one-shot chains, cascaded timers, gated counters, drums, pointers, handshakes, alarm and reset, shift
  registers, first-scan setup). Each case is a program, a goal, and a hand-written recording that reaches the
  goal. The cases are led by idiom. They are not a generated grid.
- **Later:** Sam's `click-plc-cookbook`, a folder of real programs, each with its own pyrung workspace. Only
  Sam sanitizes it, and no session has access before he opens it. Real programs then also exercise
  laddercodec's decoder, pyrung's import and ClickNick's Check Program.

### 6. Prover search removal (pyrung, this site)

Done on pyrung's `main`, unreleased: the exhaustive search, the `Proven` verdict, lock files, the
`pyrung lock` command, the `prove` console verb and the `lock=` tag flag are gone. The static facts stay,
because `how()` and validation use them. They are now checked against real runs. The facts that those runs
refuted are held as strict expected failures on pyrung's roadmap. This site no longer describes `prove` or
lock files.

Left: the release. Until it goes out, this site describes a pyrung that is not on PyPI.

### 7. One source for the agent tooling (all four)

Until 2026-11-15 the BOB skill, the three agent files, the hook and the merge queue were copied into each
repo, and four sessions were fixing the copies separately. They now have one source. It is a Claude Code plugin
in its own repo, `bob`. The planner's agent built it from laddercodec's `chore/agentguard` branch and pyrung's
queue.

- **Two layers.** The guard is common to all repos: the hook, its fail-closed shim, the bounded test runner,
  the worktree helpers, the skill and the agent files. The queue (stages, presets, trains) is an add-on, and
  only pyrung turns it on.
- **Each repo keeps two files:** `.claude/bob/config.toml` and `.claude/bob/profile.md`. When a repo adopts the
  plugin, it deletes everything else under `devtools/mergeq`, `devtools/agentguard`, `.claude/skills/bob` and
  `.claude/agents/bob-*`.
- **All four repos have adopted it** (2026-11-15), and their own copies are deleted. An install is pinned to
  the plugin commit that it was made from. The plugin's README says how to pick up a later commit. That has
  been done once in all four repos.
- **Tooling faults** are reported to the planner and fixed once, in the plugin repo. No repo patches its own
  config around a fault. The plugin's `scratchpad/roadmap.md` lists the open ones.

## Order by repo

| Repo | Order |
|---|---|
| pyrung | 1. Remove the public name `Rung`, and catch pyclickplc's `PlcDataReadError` at launch. The deletions release follows on Sam's tag. 2. Validation onto laddercodec (item 2, step 2) on its open branch, up to the joint release. 3. CLICK-match fixes from the 2026-11-10 readings. For now there is no watchdog stop (Sam, 2026-11-17). There may be a warning on a heavy For loop. 4. Console commands for every change (item 1, step 3). 5. float32 Reals, the per-PLC definitions table, the history API, calc into a pointer. The `how()` work follows the recording core. Export through laddercodec comes after the joint release. |
| laddercodec | 1. The case lists for the runner. The Fill, Compare and Search lists are with the ClickNick session. The Timer, Counter, Shift, For and Drum lists follow, then Send. 2. The joint release, on Sam's tag. 3. The parity test against pyclickplc. 4. After the joint release: the whole-program check. Two pieces of work go on alongside these steps and are not steps of their own. Take pyrung's reports from adopting the API, before the joint release. Tighten the rules to each grid as the runner returns it. |
| pyclickplc | 0.9.1 went out on 2026-11-18. 1. Fix the test for a CLICK 4 `Project.ini`. A new CLICK 4.00 project has no `[Sec21]`, and pyclickplc reads and writes such a file by CLICK 3's rules. ClickNick's Name PLC flow meets this. The fix goes out as 0.9.2 on Sam's tag. 2. One CLICK question is left, the encoding of a nickname export. It waits on a runner extension. |
| ClickNick | 1. A release now, on Sam's tag. 2. Then the runner, ahead of recording (Sam, 2026-11-17): Fill mode; the Timer, Counter, Shift, For and Drum dialogs; the full grids. 3. Named pyrung imports, with pyrung's deletions release, and laddercodec's new names, with the joint release. 4. Then the ClickNick side of recording. |

## Only Sam can do these

- Publish each release (the tag is the gate). As of 2026-11-17:
  - ClickNick: ready now.
  - pyrung's deletions release: after the public name `Rung` is removed.
  - pyclickplc 0.9.2: after the `Project.ini` fix.
  - laddercodec and pyrung together: when the joint release closes (item 2).
- Review laddercodec's new public names before the joint release: `Series`, `Parallel`, `Box`, `Branch`,
  `Circuit`, `lay_out`, `LayoutError`, `Term`, `csv_rows`, `CSV_HEADER`, `write_bundle`, `read_bundle`,
  the 20 `Literal` aliases and `UndecodedStop`.
- Decide what a declared `min`, `max` or `choices` means on a tag that the ladder writes (pyrung, deferred).
- At the PLC: wiring, power cycles, and distinct live X inputs for laddercodec's runs B and C.
- Give the go for a run that writes to the PLC or that needs a person at the PLC. That includes pyrung's
  hardware round. Sam preapproved every run of ClickNick's runner on 2026-11-18, until he writes
  "StopRuns". Those runs are on a CLICK that the runner starts, and they write nothing to the PLC. Running
  or queued on 2026-11-18: laddercodec's Compare and Search case lists; the dialog dumps; the typed
  nickname, comment and Text initial value; laddercodec's pastes for a coil beside a timer that has a
  reset pin and for a NOP beside outputs that meet only at the rail; ten values for a Real in Math; and
  two pairs of subroutine names that differ only in the case of a non-ASCII letter.
- Approve the name of each new public parameter or function in laddercodec, as with the other public names.
- Confirm the deciding rule in `rule-decisions.md`, then decide the rows that it does not settle. Sam decided
  rows D1 and D3 first, on 2026-11-16. pyrung's importer keeps accepting rungs that CLICK's Syntax Check
  refuses, and it reports them.
- Edit a ruleset, if a repo ever renames its `ci` job or its docs `build` job.
- Delete the remote `dev` branch in pyrung, if it is still there. ClickNick has none.
- Check three things for a value that is typed into CLICK, or leave them for the runner. The three
  are leading zeros and surrounding spaces in an address, a bare space as a Text initial value, and
  whether CLICK strips spaces from nicknames and comments. The runner has already answered all three
  for a value that comes from a CSV import.

## Settled without further work

pyrung's six unmerged branches are dropped. None matters as code, and their notes are kept.
