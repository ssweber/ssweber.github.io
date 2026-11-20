# Ecosystem plan

This is the coordination point for pyclickplc, laddercodec, pyrung and ClickNick. It holds the work that
crosses repos, written once, and the rules all four share. Work inside one repo lives in that repo's
`scratchpad/roadmap.md`.

Last updated 2026-11-20. Latest releases: pyclickplc 0.11.1, laddercodec 0.5.0, pyrung 0.18.0, ClickNick 0.25.0.
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
     writers write such an instruction from its fields. `unchecked=True` does not change. It
     is on laddercodec's `main` (#127). The later form for one instruction, which pyrung's export
     needs in step 5, is not built.
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
keeps every CLICK rule, which is the long tail. It starts after the shared validator and the kernel fixes
are on `main`, and both are there since 2026-11-19 (#105, #106). After the joint release it follows one
small item, the undecoded marker (Sam, 2026-11-20). The forms that validation passes and the export refuses wait for it, and so do the refusals
that name no code (Sam, 2026-11-19: "parse will handle a lot of the edge I'm sure after in next").

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
| pyrung | v0.18.0 went out on 2026-11-20, the second half of the joint release. Two follow-ups are left from it: the lock file moves to pyclickplc 0.11.1, and `docs/guides/conformance.md` gives 0.17.0's case counts until a hardware round, which is Sam's. Next, in order: 1. The importer runs laddercodec's undecoded marker as a stop that says why, which ClickNick's item 9 waits on (Sam, 2026-11-20). 2. Parse operands once, in the builder. 3. CLICK-match fixes from the 2026-11-10 readings. For now there is no watchdog stop (Sam, 2026-11-17). There may be a warning on a heavy For loop. 4. Console commands for every change (item 1, step 3). 5. float32 Reals, the per-PLC definitions table, the history API, calc into a pointer. The `how()` work follows the recording core. Export through laddercodec (item 2, step 5) is open now that the joint release is out, and Sam has not placed it in this order. Low priority (Sam, 2026-11-20): the export brackets a Math formula only where precedence needs it (row M5 in `rule-decisions.md`). Until then ClickNick's Review Changes lists an unedited Math rung with two or more operators as changed. |
| laddercodec | 0.5.0 went out on 2026-11-20, the first half of the joint release. Next, in the session's order: `FieldError.span`, the whole-program check, the deferred message wording, and then the other follow-ups on its roadmap. Alongside these, it tightens the rules to each grid as the runner returns it. |
| pyclickplc | 0.11.1 went out on 2026-11-20. 0.11.0 writes the nickname CSV in cp1252, as CLICK reads it, and refuses a character that cp1252 does not have. 0.11.1 leaves a blank SD132 to SD135 nickname as it is (Sam, 2026-11-20). pyrung 0.18.0 requires 0.11.0 or later, and ClickNick's `main` pins 0.11.1. Left, as ordinary roadmap work: whether the validators reject a character that cp1252 does not have. Sam checked by hand on 2026-11-20 that CLICK turns an emoji in an Address Comment into `??`. |
| ClickNick | v0.25.0 went out on 2026-11-18. Its `main` has moved to pyclickplc 0.11.1 (#151, #154). A file that a user hands to CLICK is cp1252, and a file that only ClickNick and pyrung read stays UTF-8. The Address Editor flags a character that cp1252 lacks before Sync, and a project that already holds one stops at the workspace build with a message that names the address. Before 0.26.0, in order: 1. The move onto laddercodec 0.5.0 and pyrung 0.18.0 (roadmap items 8 and 9). The branch never pastes an undecoded marker, and it turns every marker into ClickNick's stand-in rung with an "unreadable" finding. 2. The final CHANGELOG and release notes. 3. Sam's smoke test, and then his tag. After the release: the rest of the marker work, once pyrung runs the marker; the runner's waiting jobs (item 4); and then the ClickNick side of recording. |

## Only Sam can do these

- Publish each release (the tag is the gate). pyclickplc 0.11.1, laddercodec 0.5.0 and pyrung 0.18.0 went
  out on 2026-11-20. One is left: ClickNick 0.26.0, which is the session's proposal for the version. Sam
  runs a short smoke test of the release candidate first, and the ClickNick session writes the steps for it.
- Decide whether `read_csv` returns a rung of wires alone as drawn, or in the form CLICK's check gives it,
  with a `NOP`. This waits for the next release of laddercodec.
- Run `/reload-plugins` in a session after it has updated the `bob` plugin. No session waits on this.
- Decide what a declared `min`, `max` or `choices` means on a tag that the ladder writes (pyrung, deferred).
- At the PLC: wiring, power cycles, and distinct live X inputs for laddercodec's runs B and C.
- Give the go for a run that writes to the PLC or that needs a person at the PLC. That includes pyrung's
  hardware round. The pyrung session's list for that round on 2026-11-19: a SUM across a gap between X
  or Y slots; `copy(5, TXT1)` and `copy(-5, TXT1)`; the hex constants; what a PLC does to a read-only bit
  inside an SC range that a coil writes, such as SC52 under `out(SC50..SC60)` (row R4 in
  `rule-decisions.md`); and a Search and a Compare with a quote inside the text. No release waits on
  this round. The case counts in pyrung's `docs/guides/conformance.md` wait on it. Sam preapproved every run of ClickNick's runner
  on 2026-11-18, until he writes "StopRuns". Those runs are on a CLICK that the runner starts, and they
  write nothing to the PLC. Running or queued on 2026-11-18: the full dialog grids; the dialog dumps; and
  the typed nickname, comment and
  Text initial value. Answered that day: laddercodec's Compare and Search case lists; a coil beside a
  timer that has a reset pin; a NOP beside outputs that meet only at the rail; ten values for a Real in
  Math; and subroutine names that differ only in the case of a non-ASCII letter.
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
