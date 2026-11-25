# Ecosystem plan

This is the coordination point for pyclickplc, laddercodec, pyrung and ClickNick. It holds the work that
crosses repos, written once, and the rules all four share. Work inside one repo lives in that repo's
`scratchpad/roadmap.md`.

**What this work is for.** The work in this plan has three aims. First, pyrung and laddercodec do what CLICK
does. Where they differ from CLICK, the fix is to match CLICK, or to refuse what CLICK would turn into something
else. Second, each fact lives in one place. When one project copies another's fact, the copy goes, and the
project imports the fact instead. Third, pyrung parses its input once, in the builder, and nothing checks it
again after that.

A copy stays only when the dependency would point the wrong way. pyrung's core states its rules in its own tag
types, because core serves the P1AM as well as CLICK. laddercodec states CLICK's version of a rule in CLICK's
banks. Where both hold the same rule, a test checks that they agree. laddercodec checks its copy of
pyclickplc's bank facts the same way (Sam, 2026-11-25).

Last updated 2026-11-25. Latest releases: pyclickplc 0.11.3, laddercodec 0.5.1, pyrung 0.18.1, ClickNick 0.26.0.
Everything since those tags is on each repo's `main`, unreleased.

## How to use this file

- **A session messages the planner only when it hits a stop** (Sam, 2026-11-18). A stop is one of four
  things. The session is blocked. Its roadmap has nothing that it can start. The order between repos is
  unclear. Two sessions cannot settle a disagreement. A merge, a review result or a run result is not a
  stop. Sessions settle questions with each other directly. The planner answers a stop with the next step,
  taken from this file and from Sam's rulings, and keeps this file current from the roadmaps. A session still
  talks to Sam directly. Only Sam gives the go for a tag, a release, a run that writes to the PLC, or a rule
  decision.
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
- **The release tidy** (Sam, 2026-11-20). Before a tag, the repo's session does four things in one PR. It
  deletes what is done from `scratchpad/roadmap.md`, so that the roadmap does not grow. It reads the
  CHANGELOG from the last tag against what merged, and writes it for a user. It drafts the release notes,
  which open with a short summary of what a reasonable user expects to learn: what changed for them, and
  what they must do. It writes the next steps into the roadmap.
- **A publish workflow does not run the tests again** (Sam, 2026-11-18). The ruleset on `main` requires a
  PR, the `ci` and `build` checks and a branch that is up to date, so a tagged commit on `main` has
  already passed. pyrung's test step also held a runner for 10 to 15 minutes. In its place the workflow
  checks that the commit is on `main`, and that the built wheel installs and reports the tag's version.
  pyrung, laddercodec and pyclickplc make the change with their next merge. ClickNick's workflow ran no
  tests already. pyrung's CI runs the full suite on Python 3.11 and 3.14 and not on 3.12. Adding 3.12
  is Sam's call.
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
  locally against the sibling checkout. It merges after the sibling's release.
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

The joint release went out on 2026-11-20 as laddercodec 0.5.0 and pyrung 0.18.0. pyrung's validation goes
through laddercodec for every instruction family, and pyrung's bank tables are gone. Export and import
through laddercodec (steps 5 and 6) come next, as additive releases.

- **One name per rule.** laddercodec names a refusal of a field rule with its kebab-case `.code`. That is the
  name that pyrung's `allow=` accepts. pyrung keeps a code of its own only for a rule that only pyrung has.
  There is no alias layer from the old `CLK_` names.
- **What the release deferred, by name:** more message wording, a refusal with no code or no CLICK id, a
  form that validation passes and the export refuses, a runner answer that only tightens a rule, a form
  that CLICK's dialog refuses and laddercodec encodes without harm, parse-once, and laddercodec's four
  export needs. Each has a line in its repo's roadmap.
- **The test for a late fix** (the planner, 2026-11-19, from Sam's words: "make sure as we get to the
  edges we don't start going in circles, there's always next release"). Near a release, only a fault that
  a user would hit as wrong output goes in. That is output that CLICK cannot load or reads as another
  value, a wrong answer at run time, a crash, a form that CLICK accepts and laddercodec refuses, a form
  that the last release handled and `main` now refuses, or a public name that would break again later.
  Anything else gets a roadmap line.

Steps keep their numbers, because the roadmaps refer to them.

1. Done, in laddercodec 0.5.0: one `FieldError` that carries every refusal of the instruction.
2. Done, in pyrung 0.18.0: pyrung's validation on laddercodec.
3. **The runner: whole grids, not samples.** For each dialog field, the runner tries every bank and
   constant kind, and the answers are kept as test data in laddercodec. The laddercodec session
   writes the case lists, ClickNick's runner runs them, and laddercodec commits the cases and
   answers (Sam, 2026-11-16). That is the one place where CLICK's field rules are recorded.
   laddercodec's rules are tested against it, and pyrung reaches it through laddercodec. A paste
   followed by a copy back is a separate question from the dialog and gets its own runs. The runner
   has run the Math, Copy, Out and Receive dialogs. The laddercodec session reports that it now
   answers Compare and Search too. For Math, Copy and Out it ran the preflight and
   risky lists, and the SD and SC picker lists. The picker lists answer the large SD and SC sweeps
   without running those sweeps. By 2026-11-25 the runner had answered every case in the Fill,
   Timer, Counter, Shift, For and Drum grids too. laddercodec's tests list 46 places where its rules
   and CLICK's answers differ, and each one is marked deliberate or kept. What is left is CLICK's
   saves. The laddercodec session wrote 25 save cases for kept differences where nobody recorded
   what CLICK saves, and the runner runs them after ClickNick 0.27.0 (Sam, 2026-11-25). laddercodec also commits the 25 Fill, Math and Copy saves that the runner recorded
   as J4.
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
   names that differ only in case, as CLICK's own dialog does (GUI-036). The laddercodec session
   settled two of pyrung's three needs on 2026-11-25 with nothing to build:
   - `lay_out` keeps refusing a box after a box with pins. CLICK cannot hold that shape in one rung,
     and its check refuses it. pyrung already refuses the shape and starts a new rung.
   - Email, Home, Position and Velocity have no pin rows in CLICK. Their inputs are dialog fields,
     and pyrung wires nothing to them.

   One need is left. pyrung's conformance probes need a public way to build an instruction that the
   checks refuse. Sam chose the form on 2026-11-18: `allow=` on `read_csv` and `read_bundle`. A
   refusal whose code is listed is kept, and any other refusal raises. `encode()` and the CSV
   writers write such an instruction from its fields. `unchecked=True` does not change. It is on
   laddercodec's `main` (#127). On 2026-11-25 Sam approved the same keyword for one instruction:
   `Copy(source=..., target=..., allow=(...))`. Each instruction class takes `allow=` as an
   init-only keyword, and the object does not store it. That form is not built yet.
6. **Import reads laddercodec's objects.** This comes last. It is the smallest clean saving and the
   hardest blocker.

**ClickNick's Review Changes compares objects, not CSV text** (Sam agreed the direction on 2026-11-21).
Today the diff compares laddercodec's CSV rows as text. The two sides of the diff come from different
translations, so a form that pyrung writes differently can show as a change when nothing changed. Both
sides also share one decode, so the diff cannot see text that the decode loses. Then a paste of the whole
program writes that loss into CLICK. A research agent found these faults by reading the code. Nobody has
checked its findings against the code yet. Sam said what is there now "will continue to find bugs".

The direction has three parts:

- Both sides of the diff hold one structured rung object, and equality is defined in one place. A Math
  formula compares as a parsed expression, and an operand compares as a parsed address.
- pyrung hands over objects, not CSV text. That is step 5 above, so this work comes after step 5.
- The map from source line to rung comes from pyrung's builder, not from the `# Rn` comments.

Two smaller steps were proposed first, and Sam did not rule on them one by one. One is a round-trip test
over real CLICK captures. The test decodes a capture, imports it to source, exports it and encodes it, and
expects no change and the same bytes. The other is a paste that writes CLICK's own bytes for a rung that
did not change.

Before anyone builds this, the ClickNick session researches the design with the pyrung and laddercodec
sessions, and Sam approves it (Sam, 2026-11-25).

**Moves into laddercodec** (Sam, 2026-11-16):

- The program-structure rules (for-loop nesting depth, a oneshot or a return inside a loop, nested calls, the
  8,000-step limit) and the step estimate, as a check on a whole program. Sam agreed on 2026-11-25 that
  laddercodec builds it now, ahead of step 5. It checks laddercodec's own `Project` and is tested on real
  CLICK projects. Its API stays provisional until pyrung adopts it in step 5.
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

**Copies of pyclickplc's facts in pyrung and ClickNick.** The pyclickplc session surveyed both repos on
2026-11-25 without changing them. Its list is `SURVEY.md` in `pyclickplc-wt/.bob/jobs/dup-survey/`, and
the pyrung and ClickNick sessions have it.

- Every copied fact already has a name in pyclickplc, so pyclickplc needs no new name. Most of those
  names were in no `__all__` and no doc. Sam ruled on 2026-11-25 that each pyclickplc module declares
  its public names in its own `__all__` and documents them. They are not exported from the top level.
  The pyclickplc session is building this.
- pyrung has four copies of the bit-bank set, six bank-name lists, its own `_PAIRED_BANKS`, and its
  own value limits, which match pyclickplc's. 101 lines of its system-nickname code are left, and 5 of
  them copy pyclickplc.
- Nothing outside its own test uses `COMPARE_COMPATIBILITY`. `COMPARE_CONSTANT_COMPATIBILITY` is not
  used only by its test. It feeds `HEX_CONSTANT_BANKS`, which the translator
  and the hardware validation use. pyclickplc's `BANKS` gives the same set.
- pyrung builds XD and YD blocks two ways. `ClickBlocks` counts by display index, 0 to 8. The tag map
  parsers count by MDB index, 0 to 16. The pyrung session and Sam choose between them.
- ClickNick has four copies of the timer and counter pairs, and an `ADDRESS_JUMPS` that matches
  pyclickplc. One SC test is written by hand.
- The ladder-writable SC and SD sets are not pyclickplc facts. pyrung removes them when the last
  validation moves to laddercodec.

Each session replaces its copies in its own time. The pyrung session does it after parse-once.

#### In laddercodec

0.5.0 holds the breaking API changes, the final code names (`docs/guides/codes.md`) and the public names
that Sam reviewed. ClickNick moves onto the new names in its next release (its roadmap item 9).

- **`FieldError.span` is approved and not built:** half-open `(start, end)` offsets into the expression as
  typed, and None where no span applies.
- **CLICK's own error ids** such as "(OBJ-023)" stay in messages, because CLICK shows them to the user.
- laddercodec 0.5.0 removed the pyrung-specific sections from its `csv-format.md`. Nobody has confirmed that
  pyrung's docs hold them.
- **The undecoded marker.** laddercodec 0.5.0 replaces a rung that it cannot decode with a marker rung. The
  marker acts as End in the main program and as Return in a subroutine. pyrung runs the marker as a stop
  that says why, as its first work after 0.18.0 (Sam, 2026-11-20). ClickNick then drops its stand-in rung,
  its Simulator runs up to the marker, and its Check Program lists the marker.

### 3. pyrung's public surface (pyrung, ClickNick)

`pyrung`, `pyrung.click`, `pyrung.circuitpy`, `pyrung.validation` and `pyrung.live` are public. Everything
under `pyrung.core` and `pyrung.dap` is internal. pyrung's half is on its `main` (#94). Every name that
ClickNick uses has a public home, and the old internal paths still import. The ClickNick session moves
ClickNick onto the public names with pyrung's deletions release, and adds a test that fails when one of them
disappears. Its roadmap item 8 holds the list.

Sam decided on 2026-11-17 that the `Rung` to `rung` rename follows the pass. The rename is on pyrung's
`main` (#95). The deletions release follows it, on its own and ahead of the joint release.
The deletions release also removes the public name `Rung` (Sam, 2026-11-18). A rung is then written only as
`with rung(...)`. The release went out as v0.17.0 on 2026-11-18.

**One path for findings** (Sam, 2026-11-18: "this is a real dual code paths that could be 1"). pyrung's own
analysis findings carry a display, with the source line and a caret. Its CLICK findings carry flat text.
The CLICK findings join the display. The planner set the order on 2026-11-18, in three parts:

1. On pyrung's `main`: `ClickFinding` holds a display, as core's finding records do. A site that passes only
   text gets a display with its location, its message and its hint. This needs nothing from laddercodec.
2. On the validation branch, in two stages. The one place that turns a laddercodec refusal into a finding
   builds a real display.
   - Stage 1, now: the frame, a caret on the argument that the refusal's `.field` names, no caret label, and
     laddercodec's message as the problem line. This needs nothing new from laddercodec.
   - Stage 2, when laddercodec's Copy example is on its `main`: the caret label is laddercodec's `short()`,
     and the hint is its `detail()`, then pyrung's advice, then CLICK's id.

   The remaining instruction families follow through the same place, so each converts once.
3. After the joint release: real frames for the checks that stay in pyrung. Those are the rules about
   pyrung's own syntax, which laddercodec never sees, such as an expression outside Math. No site is
   converted by hand if its rule is moving to laddercodec. Most of `hardware.py` is moving, family by
   family, and so is part of `portability.py`. The pyrung session's list of which codes stay is in
   `pyrung-wt/buildbot/jobs/notes/clk-codes.md`: 31 move, 6 wait for a whole-program check, and 20 stay.

The joint release does not wait on part 3. The two code namespaces stay as Sam ruled on 2026-11-17.

**The final shape of a CLICK finding in pyrung** (Sam, 2026-11-18). Core findings, pyrung's own CLICK
checks and the findings that come from laddercodec all end as the same display, and one renderer prints
them:

```
[constant-into-bit] error
 --> Main:R1
  |
  |  copy(5, Motor)
  |          ^^^^^ C1 can't take 5
  |
  = hint: A number constant copies to DS, DD, DH, DF, YD, TD, CTD, SD or TXT.
          Set or clear a bit with out(), latch() or reset(). CLICK's error is OBJ-024.
```

- The frame prints core's compact location. The long path stays on `ClickFinding.location` for callers.
- The label has no subject, because the caret supplies it. So the operand under the caret prints as its
  address alone. Any other operand in the label keeps its name, as in
  `TD2 must be TD1 to match PumpDone (T1)`.
- The hint is laddercodec's explanation, then pyrung's advice, then CLICK's id.
- The frame helpers take any instruction and argument, so pyrung's own CLICK checks use them too.
- The three code styles stay: `RUNG_*` for core, `CLK_*` for pyrung's CLICK checks, and kebab-case for
  laddercodec's. The style shows who owns the rule.
- Until part 3 is done, pyrung's own CLICK checks print a location, a message and a hint with no source
  line. A report mixes the two looks until then, and Sam accepts that.

**A laddercodec refusal keeps its parts** (Sam approved the design on 2026-11-18). This is done on
laddercodec's `main` for every family (#140 to #149). A refusal keeps three parts, and its message is
derived from them: the operand with its short rule, the explanation, and CLICK's id.

- `str(err)` did not change. Each family's builder compared the old and new text of every refusal and
  found no difference.
- The public names are `message(names=None)`, `short(names=None)` and `detail(names=None)`. `names` maps an
  address to a name. Sam confirmed the three names in the laddercodec session.
- With names, an operand prints in the user's names and then in CLICK's form in parentheses. The parentheses
  go when the two are the same. Examples: `Count (DS1)`, `Valve1..Valve2 (C1..C2)`, `DS[Ptr] (DS[DD1])`.
- pyrung places its caret from the refusal's `.field`, so the field names are something pyrung reads.
  Nobody has ruled them frozen. That is Sam's call, with the list of public names before the release.
- The batch of message wording is on laddercodec's `main` (#152), and pyrung's pin has it. `short()` and
  `detail()` drop the `Class.field` prefix, a bool prints as `True`, a text constant is quoted once, and
  a name that is its own address prints once.
- Not covered: `Finding`, `LayoutError`, `DecodeError` and `EncodeError`. ClickNick shows these messages as
  plain text and needs no change. It can pass its nickname map later.

**Later in pyrung: parse operands once, in the builder** (Sam, 2026-11-19: "parse, don't validate sounds
like a winner"). Four places in pyrung each decide which operands are valid: each instruction's
`execute()`, the compiled kernel, the CLICK checks, and the operand declarations that the shared validator
adds. Each builder would turn its arguments into checked operand objects once, and the other three would
accept only those objects. The split is Sam's: pyrung's parse covers the shape of an operand (its kind, its
type, a range against a tag, a count), which is most of the value for a small part of the work. laddercodec
keeps every CLICK rule, which is the long tail. It follows one small item, the undecoded marker (Sam,
2026-11-20). The forms that validation passes and the export refuses wait for it, and so do the refusals
that name no code (Sam, 2026-11-19: "parse will handle a lot of the edge I'm sure after in next").

Sam agreed the shape on 2026-11-20. The planner read only the top of `core/instruction/operands.py`, so
the pyrung session checks the fit against `execute()` and the kernel before it builds.

- The operand declarations parse. `Operand.fits(value) -> bool` becomes `parse(call, arg, value) -> T`,
  which returns a small frozen object or raises the refusal that it already words.
- The results are a closed set of frozen dataclasses, one for each thing an operand can turn out to be,
  such as a tag, a pointer, a constant and a range. `immediate` is a field of the result.
- An instruction holds only parsed objects, and the builder is the one place where raw arguments come in.
  The type checker holds that line, and the consumers do not check again.
- Each consumer matches on the union and ends with `assert_never`, so a new kind of operand fails the
  type check wherever it is not handled.
- The parse holds what is fixed when the program is built. A value that is read at scan time stays with
  the scan.
- One family settles the result types first, and the others are swept from it (Sam: "It's always easier
  to lock things down once we know the shape"). Copy has all three consumers.

Copy, Fill and Blockcopy went first (pyrung #127), and they showed that the shape holds. Sam ruled on three
questions on 2026-11-25:

- **The Copy converter rule.** This rule says which converter can store into which bank. pyrung's core keeps its
  own copy, because core states its rules in pyrung's tag types, which the P1AM shares. A pyrung test checks the copy
  against laddercodec. It builds laddercodec's `Copy` for each pair and checks for `copy-converter-bank`.
  laddercodec exports no table.
- **How far the final check reaches.** The check that no reader tests an operand's kind again covers only the
  code that reads operands. pyrung's `isinstance` calls in conditions, expression parts and the generic
  walkers stay, and there is no list of allowed walkers. Sam wants to come back to those calls later.
  Parsing contacts and comparisons would be its own piece of work, and nobody starts it now.
- **The shape of the export.** laddercodec's fields stay strings, as settled below. pyrung's export turns each
  parsed operand into display-form text in one function. A question that laddercodec's helpers do not answer
  gets one new helper, not typed fields.

The choice between the two XD and YD conventions stays open. The pyrung session brings Sam a proposal when
it replaces its copies of pyclickplc's facts after parse-once.

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

**CLICK drops a pasted operand whose address is not in the project** (found on 2026-11-19). The runner
added only the addresses written in the rung's text before a paste. It missed the end that CLICK derives for
a Copy of text and the tags in raw cells. The ClickNick session checked all 79 of the runner's paste runs,
and six had missed an address. The laddercodec session marked each answer that rested on those six as held
or changed. No row in `rule-decisions.md` changes. One earlier note was wrong, that CLICK's paste drops a
Copy's end. CLICK keeps the end when its address is in the project. laddercodec's `addresses()` now
returns every address a payload uses, so that the runner can add them first (#155). One loss had another
cause. CLICK reads an empty flag on the clipboard as clear, and laddercodec's `decode_program()` wrote a
set flag as empty. It now writes a set flag as the clipboard does (#154).

**Hardware rounds go through ClickNick too.** A job tool writes a project to the conformance PLC and reads the
answers back. The other sessions queue their PLC questions with the ClickNick session. Sam is needed only for
wiring, power cycles and anything else that takes a person at the PLC.

Jobs waiting:

- the dialog work in item 2, step 3, in its order;
- what CLICK writes on New (Open and Save As have run);
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

Done, and released in pyrung v0.17.0 on 2026-11-18: the exhaustive search, the `Proven` verdict, lock files, the
`pyrung lock` command, the `prove` console verb and the `lock=` tag flag are gone. The static facts stay,
because `how()` and validation use them. They are now checked against real runs. The facts that those runs
refuted are held as strict expected failures on pyrung's roadmap. This site no longer describes `prove` or
lock files.

Nothing is left.

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
  been done once in all four repos. The last step, `/reload-plugins` or a restart, is Sam's.
- **Three changes on 2026-11-18** (plugin PR #12), from the snags that the sessions reported:
  - A repo can list the reviewer's checks in its config (`reviewer_checks`). The reviewer may then run
    exactly those commands inside the bounded runner. laddercodec needs one line for its grid check,
    and that config change needs Sam's word. pyrung's `make docs-check` stays refused, because it
    rebuilds the docs folders.
  - The hook refuses a commit that carries a session trailer with a link.
  - A builder writes what the code does now, and runs the last release only when it must say what
    that release did. A reviewer checks each CHANGELOG entry in the diff against the base and the
    branch. A first version added a report and a send-back step. Sam cut them as too much process.
    The test is to check before a PR only what is expensive to fix after it.
- **Tooling faults** are reported to the planner and fixed once, in the plugin repo. No repo patches its own
  config around a fault. The plugin's `scratchpad/roadmap.md` lists the open ones.

## Order by repo

| Repo | Order |
|---|---|
| pyrung | v0.18.0 went out on 2026-11-20. `docs/guides/conformance.md` gives 0.17.0's case counts until a hardware round, which is Sam's. On `main` for the next release, and all three are things that ClickNick waits on: a clearer message for a refused link (#119); a project that is reached through a junction, a link or a subst drive finds its TagMap (#120); and the importer runs laddercodec's undecoded marker as a stop that says why (#121), which was first in the order that Sam set on 2026-11-20. pyrung leaves the rungs after a marker out of the Program, so there is no stop at run time, and it refuses a marker inside a For loop. Before the release, which goes out in the same round as ClickNick 0.26.1 (Sam, 2026-11-21): the fix for a frame with a stale mode after STOP, and the import accepts a `next()` with no `for()` above it when a marker stands above it. A lone `next()` with no marker stays refused, because pyrung has no Program for it, in 0.18.0 or now. The rest of that order: 2. Parse operands once, in the builder, which the session started on 2026-11-21 with Copy. 3. Export through laddercodec (item 2, step 5). It follows parse-once, which changes the operand objects that the export hands over. 4. CLICK-match fixes from the 2026-11-10 readings. For now there is no watchdog stop (Sam, 2026-11-17). There may be a warning on a heavy For loop. 5. Console commands for every change (item 1, step 3), together with links in pyrung. 6. float32 Reals, the per-PLC definitions table, the history API, calc into a pointer. The `how()` work follows the recording core. Links in pyrung are one piece of work across pyrung and ClickNick. The planner placed them with step 5 on 2026-11-25, because that step turns a force and a patch into console commands, and links should behave the same way. In this work, pyrung holds a link that waits for its address, gives a refusal a reason that a client can read, and reports which addresses it can link. That includes a slot that only a range reaches. pyrung also treats a link, a force and a patch alike. Today, in a project that ClickNick generates, a force and a patch work on an address that no rung names, and a link refuses. For ClickNick 0.26.0 Sam decided that such an address does not exist in the program yet ("if it's not in the code, DOES it really exist?"). He has not ruled for pyrung. The pyrung session's roadmap holds the cost: no kernel change, tags registered again at each reload, and three small public names. Before anyone builds links, the pyrung and ClickNick sessions research the design together, and Sam approves it (Sam, 2026-11-25). The design answers whether an address that no rung names exists for a link. Low priority (Sam, 2026-11-20): the export brackets a Math formula only where precedence needs it (row M5 in `rule-decisions.md`). Until then ClickNick's Review Changes lists an unedited Math rung with two or more operators as changed. |
| laddercodec | 0.5.0 went out on 2026-11-20, the first half of the joint release. `FieldError.span` (#177), `comment-too-long` (#178) and `allow=` on each instruction class (#179) are on `main`, not released. That closes everything that pyrung's export needs from laddercodec. Next, in the session's order: the deferred message wording, the whole-program check (Sam agreed on 2026-11-25 to build it now), and then the other follow-ups on its roadmap. Alongside these, it commits the runner's J4 saves and writes the save cases that are not yet recorded. Faults in rung comments, found on 2026-11-21. They make a 0.5.1, which ClickNick's next release should carry. First, the decode loses text that CLICK holds, with no warning, in three ways: a comment that starts with an escaped character, such as an accented letter or `€`, loses its first word or all of it; a surrogate pair is not joined; and text in a font with another charset, such as Chinese in SimSun, is read as cp1252. The session fixes these now, with ClickNick's captures as fixtures. Second, the encode folds a rung comment to ASCII, with no message. `Température 50°C` reaches CLICK as `Temperature 50?C`. ClickNick encodes the whole file when it pastes, so every comment with an accent in the pasted range becomes ASCII in CLICK, on a rung that the user edited and on one that they left alone. The fold dates from 0.1.3, and no CLICK check stands behind it. The runner answered on CLICK 4.00 (`jobs/rung-comment-unicode/RESULTS.md` in ClickNick): CLICK writes a cp1252 character as `\'xx` and any other character as `\uN?`, and it keeps and shows both forms through a paste, a copy, a save and a reopen. The session builds the encode change on a branch: no fold, `\'xx` for a cp1252 character, and `\uN?` for any other. Sam ruled on 2026-11-21 that laddercodec writes a character that cp1252 lacks and does not refuse it, so the change merges after its review. CLICK's editor and its ladder draw `→` and `中`, and they draw an emoji as an empty box. Such a character also survives an edit in CLICK's own comment editor, with a save and a reopen (section C of the same results). With the same round: the decode of a rung comment reads the five bytes that Python's cp1252 lacks, as pyclickplc does. Those bytes are no fault today, because no rung fails on one. |
| pyclickplc | 0.11.2 went out on 2026-11-20. Its catalog matches the module tables of CLICK 2.60, 3.43, 3.71, 3.92 and 4.00. On `main` since then, and not released: `read_csv` reads CLICK's own export when it holds one of the five bytes that Python's cp1252 lacks (0x81, 0x8D, 0x8F, 0x90 and 0x9D). pyclickplc registers a codec with the five bytes added, and `CSV_ENCODING` names it (#77). ClickNick agrees with it once it pins that release. Next, as ordinary roadmap work: whether the validators reject a character that cp1252 does not have; and the read of the hardware skips a module ID that it does not know and reports it, which changes what three readers return, so the ClickNick session hears first. |
| ClickNick | v0.26.0 went out on 2026-11-20, on laddercodec 0.5.0, pyclickplc 0.11.2 and pyrung 0.18.0. Before the tag, the ClickNick session ran steps 2 to 9 of the smoke test with no window, against the runner's CLICK. `make smoke` exists since 2026-11-21 (#163 to #168), as Sam asked ("we have both pieces now, ClickNick + click runner"). It is one command for before a release, it needs no PLC, and it is not in the gate of every push or in CI. The runner makes seven fresh projects through CLICK's own wizard: five CPUs, one with no CPU, and one with nine rungs pasted from a pyrung fixture. For each it checks the load, the build, the hardware layout, the simulation in RUN, Check Program, the Sync, the CSV round trip through CLICK's import, and a `rung apply` round trip. A run takes about three minutes. It found no fault in ClickNick. Not covered: a ClickNick window, the Simulator's panel, a subroutine, a paste into a project that has rungs, System Configuration, and CLICK before 4.00. On `main` since 0.26.0, and not released: the CPU's placeholder card is in the right place on a CLICK PLUS (#171), a workspace that is reached through a junction, a link or a subst drive keeps its TagMap after a Write (#172), and message boxes show one at a time (#174). The runner's list is done, apart from the jobs that need Sam or the PLC, which its roadmap lists. Next, in order: 1. The fixes above. The runner works on CLICK 3.x since #175, and it answered the encoding of Address.csv: CLICK 3.71, 3.92 and 4.00 write it as UTF-8 with a byte order mark, and 3.43 and 2.60 write no such file, so `read_mdb_csv` needs no change. 2. The rest of the marker work: ClickNick drops its stand-in rung, and Check Program lists a marker through pyrung's `undecoded_rungs()`. pyrung's side is on its `main` and not released, so the session plans it and may build on a branch, and the merge waits on a pyrung release. Its plan is `jobs/marker-item9/PLAN.md`, in five branches. The Address Editor's views for a program with a marker describe only the rungs before it. Sam ruled on 2026-11-21 that ClickNick shows them with a notice that names the program and the rung where they stop. Inside a `for`/`next` span ClickNick keeps its stand-in rung, because pyrung refuses a marker there and one unreadable rung would fail the whole build (the planner, 2026-11-21; Sam may overrule it). An unreadable `for()` rung gets the marker. pyrung's coming release accepts the `next()` that is left when a marker stands above it, so that build stops at the marker as any other does. Three faults that live runs found on 2026-11-21 come before a 0.26.1. ClickNick misses File > New from an unsaved project (#176). A failed window check can make the watch close the data and lose unsaved edits (`fix/enum-stop`). That fault is in every release since 0.10.0, and no run shows that a user without the runner can hit it. And a click on STOP during a free run leaves the Simulator's switch on STEP. The cause of the third is in pyrung, which sends a frame with a stale mode after the answer to the mode change, and the pyrung session fixes it ahead of parse-once. Sam ruled on 2026-11-21 that ClickNick gets no filter on pyrung's frames, and that pyrung releases in the same round as 0.26.1. So 0.26.1 waits on three pins: pyclickplc 0.11.3, laddercodec 0.5.1 and the pyrung release. Sam ruled on 2026-11-25 that 0.26.1 waits for the marker work, and then named the release 0.27.0, because it holds three breaking changes and the marker features. The ClickNick session merges the pin PR (#185) first, then the marker PRs #181 to #184, each one rebased and fully gated. Marker branch 2 was dropped, because pyrung 0.18.1 imports a lone `next()` below a marker, so the case it covered no longer fails. `make smoke` has a step that presses the panel's switches (`feat/smoke-panel`), and that step found the third fault. Both fixes are in work. 3. The ClickNick side of recording, which waits on pyrung's recording core and on console commands for every change. 4. Review Changes compares objects instead of CSV text (item 2, after step 5). It waits on pyrung's export through laddercodec, and it needs design research and Sam's approval before anyone builds it. On its roadmap under "The release after 0.26.0", the items that wait: its side of links in pyrung (see the pyrung row), where it drops its own waiting links and its match on the text of a refusal; a placeholder CPU with live switches; and a mark on a point that cannot take a link. |

## Only Sam can do these

- Publish each release (the tag is the gate). All four went out on 2026-11-20: pyclickplc 0.11.2,
  laddercodec 0.5.0, pyrung 0.18.0 and ClickNick 0.26.0. Since then three repos hold work on `main` that
  is done and not released: pyclickplc (the five bytes), pyrung (the marker, the junction fix and the
  text of a refused link) and ClickNick (three fixes). ClickNick's marker work waits on the pyrung
  release.
- Tag the next round when the sessions report ready, in this order: pyclickplc 0.11.3, laddercodec 0.5.1,
  pyrung 0.18.1, and then ClickNick 0.27.0 after `make smoke` passes on those pins. It was first planned as 0.26.1. pyclickplc 0.11.3 and
  laddercodec 0.5.1 went out on 2026-11-25.
- Tag pyclickplc 0.12.0 after ClickNick 0.27.0 is out (Sam, 2026-11-25). The pyclickplc session prepares it
  on `main` without a tag. It holds three breaking changes and the public names that each module declares.
- Approve the design for links in pyrung before anyone builds it. The design says whether an address that
  no rung names exists for a link, as it does today for a force and a patch (see the pyrung row).
- Approve the design for Review Changes comparing objects before anyone builds it (item 2).
- Decide whether `read_csv` returns a rung of wires alone as drawn, or in the form CLICK's check gives it,
  with a `NOP`. This waits until after laddercodec 0.5.1.
- Run `/reload-plugins` in a session after it has updated the `bob` plugin. No session waits on this.
- Decide what a declared `min`, `max` or `choices` means on a tag that the ladder writes (pyrung, deferred).
- At the PLC: wiring, power cycles, and distinct live X inputs for laddercodec's runs B and C. ClickNick's
  roadmap lists the other runner jobs that need Sam or the PLC, under "Needs Sam or the PLC". pyclickplc
  has one question for a real PLC. Its rule for a TXT initial value and its rule for a value at run time
  disagree about € and U+0080. Only a PLC shows what it holds for an initial value of €.
- Give the go for a run that writes to the PLC or that needs a person at the PLC. That includes pyrung's
  hardware round. The pyrung session's list for that round on 2026-11-19: a SUM across a gap between X
  or Y slots; `copy(5, TXT1)` and `copy(-5, TXT1)`; the hex constants; what a PLC does to a read-only bit
  inside an SC range that a coil writes, such as SC52 under `out(SC50..SC60)` (row R4 in
  `rule-decisions.md`); and a Search and a Compare with a quote inside the text. No release waits on
  this round. The case counts in pyrung's `docs/guides/conformance.md` wait on it. Sam preapproved every run of ClickNick's runner
  on 2026-11-18, until he writes "StopRuns". Those runs are on a CLICK that the runner starts, and they
  write nothing to the PLC.
- Approve the name of each new public parameter or function in laddercodec, as with the other public names.
- Confirm the deciding rule in `rule-decisions.md`, then decide the rows that it does not settle. Sam decided
  rows D1 and D3 first, on 2026-11-16. pyrung's importer keeps accepting rungs that CLICK's Syntax Check
  refuses, and it reports them.
- Edit a ruleset, if a repo ever renames its `ci` job or its docs `build` job.
- Delete the remote `dev` branch in pyrung, if it is still there. ClickNick has none.

## Settled without further work

pyrung's six unmerged branches are dropped. None matters as code, and their notes are kept.

laddercodec does not get pyrung's parse-once work. Sam asked on 2026-11-20, and the laddercodec session
and the planner both answered no. An instruction's constructor is the one place that decides what is
valid, and the public fields stay strings. Copy's check, encoder and decoder do ask the same questions
again, but each question has one named helper, so they agree. The question opens again only if a later
Copy round finds the check and the encoder answering one question differently.
