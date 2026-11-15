# Handoff to ClickNick

Write `scratchpad/roadmap.md` from this, answer the questions at the end, then delete this file. Cross-repo
items are in `../README.md`; link to them.

## Sam's rulings (2026-11-14 and 2026-11-15)

1. **CLICK sandbox runner spike: go.** It lives in `devtools/`, and this session owns it. Two stages, as
   `../README.md` item 4 describes. `devtools/record_simulator_gif.py` already drives the Simulator with no
   CLICK installed; check which of the un-walked user checks can be automated that way today.
2. **Duplicates move into pyclickplc:** the nickname CSV reader and writer in `data/data_source.py`, the
   reader for CLICK's `Address.csv`, and the data-type maps. Start with a full inventory of what ClickNick
   has that pyclickplc also has or should have.
3. **Recording, ClickNick side** (after pyrung's recording core and one door, `../README.md` item 1):
   - the panels send console text; the echo and the `;` split go;
   - recordings run on every CLICK save, after the build publishes;
   - right-click "Assert this";
   - starting a recording prompts the workspace setup, so recordings land in a workspace that persists;
   - a rename in the Address Editor also renames the tag in the recordings.
4. **Named imports from pyrung.** ClickNick imports from deep pyrung paths today (`pyrung.click.tag_map`,
   `pyrung.core.validation.config`, `.registry`, `.report`, `.stuck_bits`, `pyrung.core.analysis.pdg`,
   `pyrung.dap.live`, `pyrung.dap.grammar`). pyrung will publish named homes for these; ClickNick moves onto
   them, with a test that fails when one disappears.

5. **ssort goes.** Drop it from `devtools/lint.py` and the dev dependencies in one small commit, with no
   reorder pass. Files are reordered only when they become a problem or are being rewritten anyway.

6. **Tests run in CI,** on a Windows runner. Today CI only lints; the 1,941 tests take about 2 minutes.
7. **An undecodable row gets a notice.** laddercodec will fail per row and keep decoding; execution stops at
   the bad row, as at an END. Show a notice that is hard to miss and list the row in Check Program.
8. **The merge queue goes** once you confirm BOB runs without it (question 2). CI is the gate here.
9. **Recording details:** declining the setup prompt means no recording. A rename made inside CLICK triggers
   the same rewrite of the recordings at the next save. pyrung owns the rename function; ClickNick supplies
   the old-to-new map.

## Housekeeping

- `dev` goes away. The checkout is on `dev` today, with the same content as `origin/main`.
- Stale: local `main`, `bob/train4`; the `sweep` arc can close.
- `dap_service.py` matches on a pyrung error string; that goes when the one door lands.
- Issue #36 is open.

## Agreed by Sam: finish the owner, split the app, then recording

Sam agreed to this order on 2026-11-15. The findings are from a read-only review the same day (code read,
nothing run; unconfirmed), so check them before starting.

- `ConnectionSession` is already most of an owner for one CLICK window and project. It is created late (after
  the database loads), does not exist in CSV mode, and does not own the workspace pairing, the overlay and
  monitor loop, the probe token, or the mirror and project-info windows. Those sit loose on `ClickNickApp`.
- Two facts have two homes: the connection (`app._click` and `ConnectionSession.click`) and the workspace
  folder (`app._workspace_config` and `ConnectionSession.workspace_dir`).
- Step 1: create the session at connect time and move those fields into it. Small in lines (40 to 80 saved),
  but it removes the two-home states and the four repeated teardown blocks.
- Step 2: split `ClickNickApp` (3,014 lines, 127 methods). It has three parts of about 530 lines each:
  workspace and mirror, connection lifecycle, and widget building. The first two leave the app class.
- Do both before the ClickNick side of recording, which adds more per-project state (recordings on save, the
  setup prompt, renames).
- Not in scope: `DataSession` and the Review Changes windows keep their own lifetimes on purpose.
- A question only CLICK can answer, and an early job for the sandbox runner: what CLICK writes, and in what
  order, on Open, New and Save As.

## Questions to answer back

1. How far did the Sandbox "exploring" in the user checks get?
2. Does BOB here need the merge queue, or can it go?
3. Which names do recordings hold: program tag names, nicknames or addresses?
4. Where does a permanent workspace live, and what survives a rebuild?
