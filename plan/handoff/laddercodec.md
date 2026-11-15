# Handoff to laddercodec

Fold this into `scratchpad/roadmap.md`, answer the questions at the end, then delete this file. Cross-repo
items are in `../README.md`; link to them.

## Sam's answers to the eight restructure decisions

1. **What "identical" means: two tiers.** Verdicts must be identical: accept or refuse, exception class, CSV
   written, bytes, decode result. Message wording may change; list the changes for review.
2. **The field-rule engine is gated on net deletion.** It continues only if it removes more lines from
   `instructions/` than it adds. "Plain shared functions only" is an acceptable end state. Sam: "practicality
   beats purity here."
3. **Classifier disagreements go in an expected-diff file.** No shims. Run the dry run first (classifier
   against today's verdicts, no source change) to size the list. A real dialog difference becomes a parameter
   of the shared function. Drift with a known right answer goes in the file and is fixed as the classifier is
   wired. A case with no known answer keeps today's behaviour as a parameter until it is checked.
4. **Lowercase addresses are accepted and written canonical.** CLICK's dialogs take `x1` and `ds1` and
   reformat them to `X001` and `DS1`. Every writer produces the canonical form.
5. **No provenance tracking.** No addresses, no source index, no `sources.py`, no `source=` on rules, no
   source column in `field_rules.txt`, no message suffix naming a source, and the comments that cite one go.
   Sam: "we have distilled it, we don't need to keep recording where we got this info."
6. **pyrung will depend on laddercodec.** `FieldError.field` must stay, so pyrung knows which field was
   refused. `.source` is not needed; `.obj` probably is not.
7. **The parity test lives here,** with pyclickplc as a dev-only dependency. The private copy of the bank
   facts stays, and laddercodec stays dependency-free at runtime.
8. **pyclickplc's `parse_address` changes in place** to accept what CLICK accepts and nothing more.

## Housekeeping

- Do not delete the validation reports and ledgers in the build folders until the dry-run list from
  decision 3 has been sorted with them. After that they go in the cruft sweep.
- The merge queue config still names `dev` as its base; `dev` is gone.
- The pyrung-specific sections of `docs/guides/csv-format.md` move to pyrung.
- Stale: local `click-v4-sweep-fixes`.

## Other rulings (2026-11-15)

- **Fail per row, loudly.** One undecodable row must not fail all of `decode_program()`. The rest of the
  program decodes, and the bad row decodes as something that stops execution there, so it cannot be missed.
  The exact form is yours to propose. Sam's sketch: "a commented row with like undecoded with the error or
  something". Whatever the form, it must: stop execution at that row (like an END in the main program, like a
  return in a subroutine); carry the row's position and the error; and never be written back into a user's
  program as real logic. Also say what happens to the other rows of a rung when one row fails.
- **`feat/productivity-codec`:** archive it as a tag, then delete the branch.
- **The merge queue goes** once you confirm BOB runs without it (question 8). CI is the gate here.

## Questions to answer back

1. Where does step 3 of the restructure stand? Steps 0 to 2 ran.
2. Did `.field` and `.obj` land on `FieldError`?
3. Does any test or caller match on message text?
4. Does the proof tool's sensitivity test change real source?
5. Was the dry run for decision 3 already done?
6. Is the verifier that reads the validation reports committed?
7. Is output canonical everywhere today, and is there a test for it?
8. Can BOB run here without the merge queue?
9. What is the stable public API that pyrung and ClickNick can rely on?
