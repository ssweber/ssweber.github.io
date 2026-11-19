# Rule decisions: where pyrung and laddercodec disagree

This file lists every known case where the two libraries disagree about what CLICK allows. Each row
is decided once. The session that owns the repo puts the decision into code and tests, and then the
row leaves this file.

A research agent probed the rows on 2026-11-15 against `main` of both repos. They are unconfirmed until the
owning session has checked them. When pyrung's agreement test (`README.md` item 2) finds a new disagreement,
add it here.

## How a row is decided

Two columns are filled in before anyone decides anything.

- **PLC reading**: the pyrung session gives the conformance reading behind pyrung's rule, or "none".
- **Editor**: whether CLICK's editor accepts the instruction when you type it into its dialog. ClickNick's
  runner asks the dialogs themselves (`click_runner.py try`, with cases in ClickNick's
  `devtools/editor_cases.json`). A paste could skip the dialog's checks. The answers below are from CLICK
  v4.00 on 2026-11-15, each with controls.

Then the rule applies. On 2026-11-16 Sam agreed to the direction it rests on. laddercodec holds the editor's
rules, and pyrung holds what a PLC does. Sam has not yet signed off the rows themselves.

1. The editor rejects it. Then laddercodec rejects it, and pyrung drops its own copy of the rule.
2. The editor accepts it, and a PLC reading shows the PLC doing something a user would not expect. Then
   laddercodec accepts it, and pyrung keeps a finding that says what the PLC does.
3. The editor accepts it, and there is no PLC reading. Then nobody rejects it.
4. If the rule does not settle a case, it goes to Sam, one row at a time.

Decoding does not depend on these checks. If a stored value breaks a rule, laddercodec still decodes
it as its instruction and gives a warning. So decoding is not a reason to keep a rule. laddercodec
also rejects anything that breaks the encoding or crashes CLICK on a paste. No dialog sees these
cases, so laddercodec keeps those rejections whatever the editor says.

The samples are thin. Several rows rest on only a handful of values. A1, A2 and A4 were tried with
four or fewer banks, and the SD rows with SD1 and SD29 to SD32 only. Do not write a rule from them
alone.

## A. pyrung refuses, laddercodec accepts

The last column, "By the rule", is the result of applying the rule. A row leaves this file when the runner's
grid for its field is in laddercodec's tests and both libraries match it.

As of 2026-11-17 the laddercodec session has checked that laddercodec's half is done on its `main`.
laddercodec rejects A1 to A5, A7 and A9 with CLICK's ids. It accepts A6 and accepts a writable SD as a Math
result. What is left of every row here is pyrung's half. The pyrung session does it with its validation move
(`README.md` item 2, step 2).

| # | Case | pyrung's code | PLC reading | Editor | By the rule |
|---|---|---|---|---|---|
| A1 | Word (DH) and non-Word operands in one math: `DH1 + DS1` | `CLK_MATH_MODE_MIXED` | not needed | Rejects it in both modes (OBJ-1002). A decimal formula rejects DH1 alone, and a hex formula rejects DS1 alone. So "mixed" is a special case | The laddercodec session adds two rules. A decimal formula cannot contain a DH register, and a hex formula cannot contain a decimal register |
| A2 | A RAND bound that is not a whole number or is a DF or DH | `CLK_RAND_BOUND_TYPE` | not needed | Rejects all three (`1.5` OBJ-1001, DF1 and DH1 OBJ-1002). It accepts a DS bound in either place | The laddercodec session adds the rule |
| A3 | RAND with equal bounds: `RAND(5,5)` | `CLK_RAND_EQUAL_BOUNDS` | not needed | Rejects it (OBJ-1001). It accepts `RAND(10,1)`, which has the bounds the wrong way round | The laddercodec session adds the rule |
| A4 | SUM over a TXT range | `CLK_MATH_SUM_BANK_NOT_AVAILABLE` | not needed | Rejects it (OBJ-1002). It rejects SUM over CT too | The laddercodec session adds the rule |
| A5 | Copy into a read-only SD: `SD1` | `CLK_BANK_NOT_WRITABLE` | not needed | Rejects SD1 (OBJ-004). It accepts SD29, which is a writable SD | The laddercodec session adds a rule. A read-only SD is not a valid copy destination |
| A6 | Coil on SC162. laddercodec's writable SC list is SC50, 51, 53, 55, 60, 61, 65 to 67, 75, 76, 120, 121, 162, 165, 168, 171, 303 to 306 and 323 to 326. pyrung's and pyclickplc's lists stop at SC121 | `CLK_BANK_NOT_WRITABLE` | None. pyrung's list was copied from pyclickplc and stops at SC121 | Accepts an Out on SC162, SC171, SC303 and SC326, all of them in laddercodec's list. Rejects all 15 points tried outside the list (OBJ-003): SC49, 52, 54, 57, 63, 70, 100, 140, 163, 166, 169, 200, 310, 327 and 1000 | Closed. laddercodec's list matches the editor at every point tried, and nothing supports pyrung's shorter list. The pyrung session removes its list along with its validation tables. pyclickplc's `WRITABLE_SC` records a different fact, which SC points are writable in Data View. It does not change |
| A7 | Block copy DS to SD | `CLK_COPY_BANK_INCOMPATIBLE` | | Rejects a copy into SD1 (OBJ-004). Rejects a copy into SD29, because its range reaches read-only SD30 (OBJ-018). Accepts a copy into SD31..SD32 | Both libraries change. The rule is that every address in the destination range must be writable. The pyrung session stops pyrung rejecting the pair. The laddercodec session adds the range check |
| A8 | Block copy TXT to TXT | `CLK_COPY_BANK_INCOMPATIBLE` | None | Accepts `TXT1..TXT2` into `TXT11` | Nobody rejects it. pyrung's list wrongly left out the pair. The pyrung session removes the list along with the tables. It is still worth one run that pastes the rung and copies it back |
| A9 | Math result into SD, decimal | `CLK_MATH_DEST_BANK` | | Rejects SD1 (OBJ-003). It accepts SD29 | Both libraries change. A writable SD can be a Math result. The pyrung session lets pyrung accept it. The laddercodec session makes laddercodec reject a read-only SD |
| A10 | Math result into YD, hex | `CLK_MATH_DEST_BANK` | None | Accepts YD0 and YD1 | Nobody rejects it. pyrung's check rejected too much. The pyrung session removes it along with the tables. It is still worth one run that pastes the rung and copies it back |

## B. laddercodec refuses, pyrung's tables allow

| # | Case | laddercodec's field | Editor | By the rule |
|---|---|---|---|---|
| B1 | Block copy DS to YD | `BlockCopy` | Rejects it (OBJ-004) | CLICK rejects this pair, so laddercodec is right. The pyrung session removes the pair from its table |
| B2 | Block copy TXT to DF | `BlockCopy` | Rejects it (OBJ-024) | CLICK rejects this pair, so laddercodec is right (`copy-bank-incompatible`). pyrung 0.17.0 still exports the form. On pyrung's validation branch the table is gone, and pyrung refuses it (2026-11-18) |
| B3 | Pack bits X, Y, T, CT or SC to DS | `Pack` | Rejects it (OBJ-024). X and Y pack into DH and not into DS. T, CT and SC also pack only into DH, at 16 bits (row N5). C packs into every word bank tried. It also rejects X001..X016 into DD or DF. That may be about width. Nobody has tested width apart from the bank | CLICK rejects this pair, so laddercodec is right. The pyrung session removes the pair from its table |
| B4 | Pack words DH to DF | `Pack` | Rejects it (OBJ-024). It accepts DH1..DH2 into DD1 | CLICK rejects this pair, so laddercodec is right. The pyrung session removes the pair from its table |
| B5 | Unpack bits DS, DD or DF to Y | `Unpack` | Rejects all three (OBJ-024). It accepts DH1 to Y. Every word bank tried unpacks to C | CLICK rejects these pairs, so laddercodec is right. The pyrung session removes the pairs from its table |
| B6 | Math result into DH in decimal mode | `Math` | Rejects it (OBJ-004). It accepts DH as a hex result | CLICK rejects it, so laddercodec is right. This is the same fact as A1 |
| B7 | Receive destination CTD, TD or SD | `Receive dest` | Rejects TD1, SD1 and CTD1 with FC03 (OBJ-004) | CLICK rejects them, so laddercodec is right. The pyrung session removes them from its table |
| B8 | pyrung's coil-target table lists X, T and CT | `Coil.operand` | Rejects an Out on X001, T1 and CT1 (OBJ-004). It accepts Y001, C1 and SC50 | CLICK rejects these, so laddercodec is right. No program with a coil on X, T or CT gets past pyrung's writability check, so the three table entries do nothing. Closed. The pyrung session removes the table in the validation move |

## C. laddercodec refuses, pyrung has no rule

Sam told the ClickNick session on 2026-11-16 that these "all seem correct". laddercodec's rejection stands.
pyrung reports it once its export builds laddercodec's objects. The list is here so that nobody adds a second
rule in pyrung.

| # | Case |
|---|---|
| C1 | A negative on-delay timer preset |
| C2 | A counter preset over 32 bits |
| C3 | A time-drum preset of 40000 |
| C4 | A search "found" bit outside C |
| C5 | A search of a DH table with a decimal value |
| C6 | `>` on a TXT search |
| C7 | A for-loop count of -5 |
| C8 | A shift on Y |
| C9 | A flasher with the same TD for on and off |
| C10 | `TXT1 == DS1` in a compare (pyrung's DSL may stop this earlier; unchecked) |

## D. Rung shapes and reading

CLICK's answers come from its Syntax Check. ClickNick's runner ran it on pasted rungs (CLICK v4.00,
2026-11-16). Two laddercodec cells were out of date. They are corrected here, and the ClickNick and
laddercodec sessions both confirm the corrections.

| # | Case | pyrung | laddercodec | Syntax Check | Decision |
|---|---|---|---|---|---|
| D1 | Bridges, pins that share contacts, a reset wire that also feeds an output | pyrung imports them, and warns about a bridge | laddercodec encodes the rung as drawn. Its `check()` reports the problem | Rejects all of them. A bridge, with or without a reset, gives C0001. Pins that share the reset's contact or hang off a tee give C000A, "All inputs of the box instruction must originate from the same branch." So does a reset wire that also feeds an output | Sam decided on 2026-11-16. pyrung keeps importing these shapes. It reports each one as a finding that it passes on from laddercodec's `check()`. This tells whoever drew the rung that CLICK will not accept it as drawn. Sam says CLICK saves a project that fails the Syntax Check and only blocks the write to the PLC. So such a rung can sit in a saved project. pyrung has no rule of its own for these shapes. The pyrung session removes pyrung's bridge warning once it passes on laddercodec's finding |
| D2 | A rung holding only a comment, wires or NOPs; a NOP sharing a rung | pyrung's importer rejects them | laddercodec reads them | No error. The check itself drops a NOP that sits on its own row beside a coil. It wires a wires-only rung through column AF | CLICK accepts these, so pyrung's importer is the one out of step. The pyrung session fixes this in the import step |
| D3 | A counter or timer reset with nothing wired to it | pyrung keeps the pin with an empty condition | laddercodec keeps it as its `.reset()` row | Rejects it with C0202, "Row N, Column AF : Missing line connection." | Same as D1. pyrung imports it and reports it from `check()` |

On its `main`, laddercodec's `check()` reports C0001, C000A and C0202, the same as the Syntax Check.

Closed. The instruction name `calc` came from an out-of-date pyrung fixture that nothing reads. The pyrung
session is deleting it.

## F. Constants

Section E (the RTC system nicknames) is closed and gone. pyclickplc 0.8.0 contains CLICK's names, and pyrung
reads them from its catalog.

This section records what CLICK stores for a constant. ClickNick's runner saved and decoded 95 cases (CLICK
v4.00), and laddercodec keeps the saves as test data. The laddercodec session checked the four rows that were
here against its `main` on 2026-11-18, and they are gone. laddercodec writes a Real and `$1` the way CLICK
stores them. It refuses `005` in a hex formula and `EH` as a Copy source on purpose (Sam, 2026-11-16). CLICK
reads each as a value that the user may not mean, and the message names what CLICK would store. CLICK saves
`1.50` copied into TXT1 as `1.5`, and laddercodec does the same. CLICK answered the digits of a Real in
Math on 2026-11-18. Typed without an `E`, a real keeps 6 digits after the point. Typed with an `E`, it keeps
7 significant digits. laddercodec refuses a real that CLICK would save as another value, and the refusal
names the saved text. laddercodec's roadmap lists the small cases that are still open.

CLICK also did the following. Nobody has recorded a difference against laddercodec for any of it yet.

- A decimal formula rejects a leading zero (`005`, `-0`), a hex constant (`0ffh`, `$41`) and a decimal comma
  (`1,5`). It accepts `+5` and `-5` alone, and rejects them in `DS2 + c`.
- A decimal formula rejects `3000000000` and accepts `6000000000`. Nobody has explained this yet.
- A hex formula stores `0ffh`, `0FFh` and `ffh` all as `FFh`. It accepts `ffffh` and rejects `0FFFEh` and
  `1Eh`. It stores `+5` as `+ 5h`, with the sign as an operator of its own.
- CLICK stores a Copy source in its own form. It stores `005` as `5`, `0ffh` as `0FFh` and `1.50` as
  `1.5`.

## N. Found by pyrung's validation branch

pyrung's validation branch swept 2,521 sample instructions against laddercodec `87a1e0c` on 2026-11-18 and
found these. The pyrung session reported them. N1 and N2 fall under rule 1, and the pyrung session decided
them. The laddercodec session settled N3 to N6 the same day from CLICK answers already on disk. They are in
laddercodec's `tests/fixtures/editor_grids/*.answers.json` and in ClickNick's `buildbot/jobs/lc-diff-click/`.
laddercodec is right in all six, and pyrung takes them into its validation branch. N7 is with ClickNick's
runner. None of them waits on Sam.

| # | Case | laddercodec | pyrung | State |
|---|---|---|---|---|
| N1 | A plain copy from TXT into a number register: TXT into DS, DD, DH, YD, TD, CTD or SD, and a Block copy from TXT into DS, DD or DH | Refuses it (`copy-txt-needs-convert`) | Accepted it | Decided by the pyrung session, 2026-11-18. CLICK's dialog asks for Copy Character Value or Copy ASCII Code Value, so laddercodec is right. pyrung's export will write the `to_value` that pyrung runs. The branch is building |
| N2 | A plain copy from DF into TXT | Refuses it (`copy-txt-needs-convert`) | Accepted it | Decided the same way as N1. pyrung's export will write the `to_text()` that pyrung runs |
| N3 | `copy(TXT1, DF, to_value or to_ascii)` | Refuses it (`copy-converter-bank`), on the ground that CLICK saves a plain copy here | Accepted it | Decided: laddercodec is right. CLICK offers no converter for TXT into DF, and it saves a plain copy |
| N4 | A pack of 32 bits into DS or DH, or an unpack of DS or DH into 32 bits | Refuses it (`pack-too-many`) | Accepted it | Decided: laddercodec is right. CLICK rejects a pack of more than 16 bits into DS or DH (OBJ-027). It accepts 32 bits into DD or DF and rejects more than 32 (OBJ-041). It rejects an unpack of DS or DH into 32 bits (OBJ-032) and an unpack of DD into 33 bits (OBJ-039) |
| N5 | `pack_bits` from T, CT or SC into DS | Refuses it | Accepted it | Decided: laddercodec is right. CLICK rejects a pack from T, CT or SC into DS, DD or DF (OBJ-024). It accepts only DH, at 16 bits. Row B3 now names these banks too |
| N6 | A Fill into two or more YD | Accepts it | Refused it | Decided: laddercodec is right. CLICK accepts a Fill of 5 into every range from YD0..YD1 to YD1..YD8. It rejects YD0..YD9 (OBJ-003) |
| N7 | A termination code on a constant source that is copied into TXT | Refuses it (`option-not-offered`) | Warned | Closed. The runner asked CLICK, and laddercodec follows the answer (#135, #138). pyrung takes it when the pin moves |
| N10 | A hex constant copied into DH or YD. pyrung's export writes `copy(14, dh[1])` as `copy(Eh,DH1)` | Refuses `Eh` and `1Eh` (`copy-hex-reads-as-real`), because CLICK reads `Eh` as the Real 0.0 | Exported it | Decided: laddercodec is right. The fix is in pyrung, whose export will write the decimal. A strict xfail, `test_a_copy_of_14_into_dh_exports`, holds the case until then |
| N11 | A search value that does not suit the table: TXT or text in a number table, a number in a TXT table, a decimal bank in a DH table, XD, YD or DH in a DS-type table, or a bit tag | Refuses it (`search-value-bank`, `bank-not-allowed`) | Accepted it | Decided: laddercodec is right. This is row C5, widened to every table kind. CLICK's Search dialog refuses these (OBJ-004) |
| N12 | A quote in a search text constant, such as `sub"name` | Refused it (`invalid-text-constant`), and accepts it since #156 | Accepted it | Closed on 2026-11-19. A PLC searched for `"A""B"` and matched the four characters as typed. laddercodec now accepts a quote in a Search value and counts it as typed, as in a Copy (#156). pyrung takes it when its pin moves |
| N13 | A search constant out of range: 2147483648, or text of 129 characters | Refuses it (`constant-out-of-range`) | Accepted it | Decided: laddercodec is right. CLICK refuses 2147483648 (OBJ-005) and accepts -2147483648 |
| N14 | A search of a table with one address, such as DS5..DS5 | Refuses it (`range-not-ascending`) | Accepted it | Decided: laddercodec is right. CLICK refuses it with "The same address cannot be used here" (OBJ-012) |
| N15 | `>=`, `<`, `<=` or `>` on a TXT search | Refuses it (`text-order-compare`) | Accepted it | Decided: laddercodec is right. This is row C6, widened. CLICK's dialog closes these modes for a TXT table |
| N16 | A search found flag outside C, or a result outside DS | Refuses it (`bank-not-allowed`) | Refused X, T, CT, SC and SD under its own code, and accepted Y | Decided: laddercodec is right. This is row C4. Only the code changes, except that a found flag on Y is now refused |
| N17 | A For count that is not a whole number: `forloop(3.5)` or `forloop(5.0)` | Refuses it | Accepted and exported it, and ran 3.5 as 3 | Decided: laddercodec is right. CLICK's For dialog refuses `1.5` and `1.` (OBJ-005) |
| T1 | A negative preset on an off-delay timer | Refuses it (`constant-out-of-range`) | Accepted it | Decided: laddercodec is right. This is row C1, widened. CLICK's Timer dialog refuses -1 on an off-delay timer in every unit (OBJ-005) |
| N18 | A send or receive whose local bank does not pair with the bank of the remote start, such as `source=x[5], remote_start="DS1"`. For a receive of words, a local DS takes DS, TD or SD, DD takes DD or CTD, DF takes DF, TXT takes TXT, and DH takes DH, or XD or YD with a count of 1. For a receive of bits, a local Y or C takes X, Y, C, T, CT or SC. A local XD, TD, CTD or SD is refused | Refuses it (`bank-not-allowed`) | Accepted it | Decided: laddercodec is right. CLICK refuses these (OBJ-004). 227 swept forms change. The Send pairs are in laddercodec's `send.answers.json`. ClickNick's runner asked the Receive pairs for a CLICK remote address on 2026-11-19, in 548 cases (`buildbot/jobs/receive-click-addr/out/receive_click.answers.json`), and laddercodec agrees on every one. A local YD also takes DH, XD or YD with a count of 1 |
| N20 | `send(remote_start="SD1")` | Refuses it (`not-writable`) | Accepted it | Decided: laddercodec is right. CLICK refuses SD1 as the remote address of every Send tried (OBJ-004) |
| N21 | A send or receive count over one request | Refuses it (`count-out-of-range`) | Accepted it | Decided: laddercodec is right. On FC16, CLICK accepts 123 DS and refuses 124 (OBJ-010). It accepts up to 61 of DD, DF or CTD |
| N22 | `word_swap=True` where the function code offers no word swap, such as one DS on FC06 | Refuses it (`option-not-offered`) | Accepted it | Decided: laddercodec is right. The pyrung session reports that CLICK's dialog offers no word swap there. The planner did not check it |
| N23 | A TCP address that is not four numbers from 0 to 255 | Refuses it (`invalid-modbus-target`) | Accepted it | Decided: laddercodec is right. The runner asked on 2026-11-19 (ClickNick's job `ip-field`). CLICK's field takes four numbers from 0 to 255 and lets nothing else be typed. It refuses a blank address, a blank part and a negative part (OBJ-005). It saves `01.2.3.4` as `1.2.3.4`, and laddercodec will do the same in a small branch. pyrung writes four numbers with no leading zeros |
| N25 | A send or receive over addresses that are not consecutive | No rule. It has no list form | Exported a list that CLICK cannot load | Decided: pyrung refuses it, under its own `CLK_COPY_RANGE_NOT_CONSECUTIVE` |
| N-b | A shift over one address, such as `c.select(2, 2)` | Refuses it (`duplicate-address`) | Accepted it | Decided: laddercodec is right. CLICK refuses a shift of C1..C1 (OBJ-012) |
| N-d | A drum preset register outside DS, such as DD, TD, CTD or SD | Refuses it (`bank-not-allowed`) | Accepted it | Decided: laddercodec is right. CLICK refuses DD1, TD1, CTD1 and SD1 as a time drum preset (OBJ-004) and accepts DS1 |
| N-e | A drum event that is not a bare bit, such as `~C5`, `rise(X3)` or `Or(X3, X4)` | Refuses it (`not-an-address`) | Exported `events=[~X003, C5]` | Decided: laddercodec is right. The Drum dialog takes only an address for an event, and it has no option for a normally closed or an edge contact |
| N-f | A shift over scattered or mixed-bank addresses, such as `[C1, C5, C9]` or `[C1, Y2, C3]`, or over no addresses | No rule. It has no list form | Exported a list | Decided: pyrung refuses it, under `CLK_COPY_RANGE_NOT_CONSECUTIVE`, and `allow=` does not let it through. A block mapped to descending addresses still exports `shift(C3..C1)`, which CLICK accepts |
| N-g | A drum output that is also the completion flag | Refuses it (`duplicate-address`) | Accepted it | Decided: laddercodec is right. CLICK refuses it on a time drum, "The set coil has already been used" (OBJ-014) |
| R1 | A coil over one address, such as `out(c.select(2, 2))` | Refuses it (`range-not-ascending`) | Accepted it | Decided: laddercodec is right. CLICK's Out dialog refuses C1..C1 and Y001..Y001 (OBJ-012). The runner asked Set and Reset on 2026-11-19 (ClickNick's job `coil-sc`), and they answer as Out does: C1..C1, Y001..Y001 and SC50..SC50 are refused (OBJ-012), and so is C2..C1 (OBJ-009) |
| R2 | A coil over scattered, mixed-bank or descending addresses. This includes an `immediate()` range | No list form. It refuses a descending range | Exported a list for the range that is not immediate | Decided: pyrung refuses it, under `CLK_COPY_RANGE_NOT_CONSECUTIVE`. CLICK's Out dialog refuses C2..C1 (OBJ-009) |
| R3 | `latch(SC162)` and `reset(SC162)` | Accepts them | Refused them | Decided: laddercodec is right. This is row A6 for Set and Reset. CLICK accepts both on SC162 and refuses both on SC163 (OBJ-003) |
| R4 | An SC range with a read-only bit inside it, such as `out(SC50..SC60)` | Accepts it, in Out, Set and Reset | Refused it | Decided by rule 3: nobody refuses it. CLICK accepts SC50..SC60 in all three dialogs, and it refuses a read-only SC on its own. Nobody knows what a PLC then does to SC52. That needs a PLC run on Sam's go, and pyrung's simulation must match the answer |

The numbers follow the pyrung session's ledger, which is why N8 and N9 are not here.

The pyrung session reported N11 to N17 on 2026-11-19, from its proofs of the Search and For families. In
every row laddercodec refuses a form that pyrung's `main` accepted. Of 591 Search forms swept, 317 change
verdict, and every form that both versions export writes the same rows. The planner checked N13, N14, N15
and N17 against the answers in laddercodec's `search.answers.json` and `for.answers.json`. All seven fall
under rule 1 or under a ruling that Sam has already given, so none waits on him. pyrung took them with the
family scaffold (#107).

The pyrung session reported the rows from T1 to R4 on 2026-11-19, from four families that land on its `main`
as one train: timers and counters, Send and Receive, Shift and the drums, and the coils. Where laddercodec
has no rule, pyrung refuses a range that CLICK has no way to write. The planner checked T1, N18, N20, N21,
N-b, N-d, N-e, N-g, R1, R3 and R4 against the recorded answers. They are in laddercodec's
`tests/fixtures/editor_grids/` and in ClickNick's `buildbot/jobs/coil-sc/out/`. Two rows had no
recorded answer, N23 and R1, and the runner answered both the same day. Only R4's question for a PLC is
Sam's.

The same report renames codes with no change of verdict. A wrong bank is now `bank-not-allowed` in the
timer, counter, send, receive and Out families. A timer preset that is too large is `constant-out-of-range`.
A timer's mismatched pair is `timer-pair-mismatch`. The pair check on debounce, flasher and timed keeps
`CLK_TIMER_PAIR_MISMATCH`, and an unmapped Done bit keeps `CLK_BANK_UNRESOLVED`. A shift on Y is accepted
(row C8), and a drum preset over 32767 is refused (row C3).

One more disagreement is not a row: a quote in a text constant. The state on 2026-11-19:

- **A lone quote.** pyrung's family scaffold exports `copy('"', txt[1])`, a Fill of `'"'` and a search for
  `'"'` as `$22`, which is CLICK's code form for that character. Before, pyrung refused the search and the
  Fill, and its export wrote the Copy as `""""`, which laddercodec could not load.
- **A quote among other characters in a Copy.** CLICK's Copy dialog accepts `"A"B"` and ends it at TXT3. It
  accepts `"A""B"` and ends it at TXT4. So CLICK does not read a doubled quote as one quote, and it keeps a
  quote as typed (ClickNick's `buildbot/jobs/lc-diff-click/RESULTS9-10.md`, case c10). Under rule 3
  laddercodec was wrong to refuse it. The PLC confirmed it on 2026-11-19, on Sam's go: a Copy of `"A"B"`
  into TXT1 wrote A, quote, B, and a Copy of `"A""B"` wrote A, quote, quote, B. The answers are in
  ClickNick's `buildbot/jobs/quotes-text/out/runtime.answers.json`. laddercodec accepts such a text since
  2026-11-19, and pyrung writes it as typed since its #108.
- **A quote among other characters in a Search value.** The Search dialog gives no end address to count,
  so Sam ruled that laddercodec refuses it until a PLC shows what it matches (row N12). The same PLC run
  searched for `"A""B"` and matched the four characters as typed. A search for `"A"B"` gave no answer,
  because CLICK dropped two of its operands on the paste (see the plan's item 4). Sam then ruled in the
  laddercodec session. In CSV, the text of a Copy or a Search runs from the first quote to the last, and
  laddercodec accepts a quote in a Search value since #156.
- **A quote in a Compare.** Sam ruled in the laddercodec session on 2026-11-19 that both sides of a Compare
  accept quotes. The laddercodec session is building that branch.
- **A lone quote written as text.** This is open. `"""` saves no end in the Copy dialog. ClickNick's
  runner will run `"A"` and `"""` into TXT1 as a control.

## Not yet compared

The laddercodec session answered its half of these on 2026-11-18. The pyrung session compares each with
pyrung's rule when export moves to laddercodec.

- **Contacts before a NOP.** laddercodec's `check()` reports `contact-feeds-only-nop` (C0003) for a contact
  that feeds a NOP and no other box. `lay_out` draws the rung and does not refuse it. Nobody has compared
  this with pyrung's "contacts before a NOP" rule.
- **A wide rung.** laddercodec never splits a rung on width. Past 31 condition columns it refuses the rung
  with `layout-too-wide`. If pyrung wraps a wide rung, the two disagree.
- **The 32-row limit.** laddercodec refuses a rung over 32 rows everywhere except when it decodes CLICK's
  own bytes. pyrung's own height check undercounts a rung with tall boxes, and that is on pyrung's roadmap.

## Not yet asked

As of 2026-11-18 the runner has dialogs for Fill, Shift, Timer, Counter, For, Drum and Send, and laddercodec's
case lists for them are on its `main`. The full grids are running. Compare and Search have answered, and
laddercodec follows them.
