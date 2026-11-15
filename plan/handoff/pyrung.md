# Handoff to pyrung

Fold this into `scratchpad/roadmap.md`, answer the questions at the end, then delete this file. Cross-repo
items are in `../README.md` and are not repeated in the roadmap; link to them.

Findings marked "unconfirmed" were read from code by a research agent. Check them before relying on them.

## First, before any edit

Commit the untracked `scratchpad/` files as they are: `roadmap.md`, `session-recording/`, `hold-text/`,
`how-notes/`, `conform-readings/`, `coverage-model/`, `jit-ideas/`, `prose-sweep/`. They exist on one disk only.

## Sam's rulings (2026-11-14 and 2026-11-15)

1. **The prover search goes.** Sam does not use `prove` or lock files, and tractability is poor on real
   programs. Remove the search and everything that hangs off it: `bfs.py`, `inputs.py`, `independence.py`,
   `lockfile.py`, the search parts of `prove/__init__.py` and `blackbox.py`, the `pyrung lock` command, the
   `prove` console verb, the `Proven` verdict, the tests named for them, and the claims in `verification.md`
   and `commissioning.md`. The facts pipeline stays where it is (`classify.py`, `passes.py`, `absorb.py`,
   `elision/`, `expr.py`, `kernel.py`, `system_points.py`); the folder is renamed later in one mechanical
   change.
2. **Robustness effort goes into the facts:** one writer list derived from the engine, shared by the facts
   and by `pilot/static_proofs.py` (which has its own list today, unconfirmed); a bound on the unbounded
   range in `classify.py`.
3. **The April record machinery goes:** condenser, miner, `spec test`, the review verbs, the `log` verb and
   the action log. `parse_provenance_line` moves out of `condenser.py` first.
4. **Recording** is built as `../README.md` item 1 describes. The check verb is `assert`.
5. **Public surface** as `../README.md` item 3 describes, in the deletions release.
6. **laddercodec becomes a dependency,** in the three steps of `../README.md` item 2.
7. **`how()` stays and grows.** Sam uses it and values the live step-by-step trace and its speed.
   - The last resort stays small. A reach through it is a missed connection in the planner, to be fixed
     there. It is not to be widened into a search.
   - Build the idiom corpus of `../README.md` item 5. Each result is one of: reached directly, reached
     through the last resort, stopped.
   - Sort stops into classes before fixing single cases. Sam names two kinds: pilot cannot trace back, or
     does not know how to continue forward. Record the kind and the place for every stop.
   - A plan becomes a recording run by the one replayer (after the recording core).
   - Soften the docs' claim that "Cannot reach" means proved, until the writer list has one source.
8. **Rename `with Rung(` to `with rung(` in tests** (about 9,600 lines in 437 files, unconfirmed), with the
   `src/` docstrings that still use the old form. It is its own squash commit, straight after the deletions and
   before new arcs start, because it conflicts with every open branch. List the commit in a blame-ignore file
   (the repo has none today) and add a lint check that refuses new `with Rung(` in tests.
9. **Recording details:** declining ClickNick's setup prompt means no recording. The function that renames a
   tag inside recordings lives here, because it has to parse expressions; ClickNick supplies the old-to-new
   map and calls it on an Address Editor rename and when a save shows a rename made inside CLICK.

10. **An undecodable row from laddercodec stops execution there.** laddercodec will fail per row and keep
    decoding the rest. Whatever it emits for the bad row (the form is laddercodec's to propose) must import
    here as something that ends the main program or the subroutine at that point, with the row named.

## Order of work

0. The gate fixes under "tests and gate time" below, because every later step pays the gate.
1. Deletions release: rulings 1, 3 and 5. Then the rename of ruling 8.
2. CLICK-match fixes from the 2026-11-10 readings, the watchdog stop, and the range bound. Needs one hardware
   run from Sam at the end.
3. Recording core.
4. One door; the old structured requests are deleted here.
5. float32 Reals, the per-PLC definitions table, the history API, calc into a pointer. Sam wants the history
   API.

The roadmap's "Prover sweep" section shrinks to the facts items. Its `how()` list is sorted by stop kind
before anything in it is fixed.

## Agreed by Sam: tests and gate time

Sam agreed to the order and the rules below on 2026-11-15. The findings are from three read-only reviews the
same day (code, config and gate logs read; no test run; unconfirmed), so check them before acting.

**Order.**
1. Fix the gate first: measure each stage once with `--durations=0`, move the suite-repeat test out of the
   gate, narrow `fold`. The `soundness` stage goes with the prover search.
2. One authority for instruction behaviour: conformance cases run through both engines, then the core
   restatements are deleted.
3. The rules for new tests, from now on.
4. Case tables and shared builders only in files that are being changed anyway.
5. Pilot's internal tests are retired gradually as the idiom corpus grows, not deleted up front.

**Shape.** Tests are 296k lines against 198k of source: 9,385 test functions, about 18,400 cases in the `test`
stage. The 0.16.0 release added 110k lines of tests against 35k of source. 44% of that growth arrived in fix
commits, usually one new file per fix. The `train` preset takes 53 to 56 minutes and `train-jit` 72 to 91.

**The gate runs things twice.**
- `soundness` (about 800 s, serial, 24% of `train`) reruns `tests/core/analysis`, which `test` already ran. No
  test carries the `soundness` marker, and for the pilot files the agreement oracle does nothing. It goes
  with the prover search.
- `conf` (about 905 s) appears to spend most of its time in `test_suite_repeats_without_restarting`, which
  runs the whole suite about five times in real time. Move that test out of the gate.
- `fold` (1,223 to 1,960 s in `train-jit`) reruns the whole `test` selection. Limit it to files whose long
  runs use the loop.
- There is no per-test timing on disk. Run each stage once with `--durations=0` before changing anything
  else.

**The same facts are tested in several places.**
- Conformance cases are the authority (402 readings confirmed on a real PLC), but they run on the interpreter
  only. Eight core files (about 6,800 lines) restate the same facts, and their only unique value is the
  compiled engine. Run the conformance cases through the engine pair, then delete the restatements.
- A shared engine-pair harness exists; 26 files use it and 286 files build a `PLC` directly. About 490 tests
  (7,000 lines) compare engines by hand.
- About 18,500 lines are near-duplicate test bodies in the same file; 24,600 lines build programs inline, and
  208 files define their own builders.
- 1,121 pilot tests (31,000 lines) never call `how()`; they test internals, with 761 fake objects.

**A condition on the prover deletion.** Only 143 tests (2,600 lines) test the facts pipeline without going through
the search; 584 tests reach the facts through `always`, `never` or `Proven`. Removing the search removes most
of the facts' coverage, so those tests are re-pointed at the facts as part of the deletion work.

**Rules for new tests, to stop the growth.**
- A fix adds a row to an existing table or case group, not a new file.
- What an instruction does is a conformance case. Engine agreement comes from the harness, never by hand.
- A `how()` test goes through `how()` on a corpus program, not through pilot's internals.

**Small cleanups:** `tests/twin/` holds only a cache folder; `tests/test_placeholder.py`; a duplicated
3,190-line CSV in `fixtures/tumbler/`; the fuzz marker set in a conftest never applies, so fuzz runs in no
gate; `testpaths` includes `src`.

## Housekeeping

- `dev` goes away; the merge queue and the BOB profile still assume it.
- Move to pyclickplc 0.5.2.
- `pilot/AGENTS.md` says the last resort is "planned, not built"; it was built on 2026-11-05.
- The memory `feedback_dont_report_to_planner` says the planner orchestrates. It does not: the planner shapes
  the plan with Sam and sends nothing until he says go.

## Questions to answer back

1. Are the recording findings right? In particular: `replay` stops after the first `step` or `run`, and
   nothing outside the April machinery imports it.
2. Are the prover findings right? In particular: nothing in pilot or validation needs the search.
3. Can the VS Code extension move in step when the structured requests are deleted?
4. How many lines, and how much gate time, do the deletions remove?
5. Can the unbounded range in `classify.py` be reached from validation, and so from ClickNick's Check Program?
6. Does a STOPPED from `how()` carry a machine-readable reason and place today?
7. What would one condition representation cost? Today there appear to be four (`simplified`, `prove.expr`,
   `crossing`, pilot's `GuardRequirement` types) plus the console's parser. Size it only; nothing is scheduled.
8. Every `how()` call appears to compile the CircuitPython kernel and rebuild the facts. Can that be cached
   per program?
9. Which of the six unmerged branches still matter?
