# Rule decisions: where pyrung and laddercodec disagree

Every known case where the two libraries give a different answer about what CLICK allows, in one place. Each
row is decided once and then leaves this file: the decision goes into code and tests in the owning repo.

The rows were probed on 2026-11-15 by a research agent against `main` of both repos. They are unconfirmed
until the owning session has checked them. New disagreements found by pyrung's agreement test
(`README.md` item 2) are added here.

## How a row is decided

Two columns are filled in before anyone decides anything:

- **PLC reading** (the pyrung session): the conformance reading behind pyrung's rule, or "none".
- **Editor**: whether CLICK's editor accepts the instruction as typed into its dialog. ClickNick's runner
  asks this through the dialogs themselves (`click_runner.py try`, cases in ClickNick's
  `devtools/editor_cases.json`); a paste could skip the dialog's checks. The answers below are from CLICK
  v4.00 on 2026-11-15, each with controls. Still to ask: the Receive dialog (B7).

Then the rule. Sam agreed on 2026-11-16 to the direction it rests on (laddercodec holds the editor's rules,
pyrung holds what a PLC does); the rows themselves are not yet signed off:

1. The editor refuses it: laddercodec refuses it, and pyrung's own copy of the rule goes.
2. The editor accepts it and a PLC reading shows the PLC doing something a user would not expect: laddercodec
   accepts it, and pyrung keeps a finding that says what the PLC does.
3. The editor accepts it and there is no reading: nobody refuses it.
4. Anything the rule does not settle goes to Sam, one row at a time.

Corrected on 2026-11-16 by the laddercodec session: decoding does not depend on these checks (a refused
instruction decodes as a raw instruction and keeps its bytes), so that is not a reason for the rule. And
laddercodec also refuses what breaks the encoding or crashes CLICK on a paste, which no dialog sees; those
refusals stay whatever the editor says.

The samples are thin. Several rows were tried with a handful of values (A1, A2 and A4 with four or fewer
banks; the SD rows with SD1 and SD29 to SD32 only), and no rule should be written from them alone.

## A. pyrung refuses, laddercodec accepts

"By the rule" in the last column is what the rule gives. A row leaves this file when the runner's grid for
its field is in laddercodec's tests and both libraries match it.

| # | Case | pyrung's code | PLC reading | Editor | By the rule |
|---|---|---|---|---|---|
| A1 | Word (DH) and non-Word operands in one math: `DH1 + DS1` | `CLK_MATH_MODE_MIXED` | not needed | Refuses, both modes (OBJ-1002). Decimal refuses DH1 alone and hex refuses DS1 alone, so "mixed" is a special case | laddercodec gains: no DH in a decimal formula, no decimal register in a hex one |
| A2 | A RAND bound that is not a whole number or is a DF or DH | `CLK_RAND_BOUND_TYPE` | not needed | Refuses all three (`1.5` OBJ-1001; DF1, DH1 OBJ-1002). A DS bound is accepted in either place | laddercodec gains the rule |
| A3 | RAND with equal bounds: `RAND(5,5)` | `CLK_RAND_EQUAL_BOUNDS` | not needed | Refuses (OBJ-1001). `RAND(10,1)`, bounds the wrong way round, is accepted | laddercodec gains the rule |
| A4 | SUM over a TXT range | `CLK_MATH_SUM_BANK_NOT_AVAILABLE` | not needed | Refuses (OBJ-1002), as it does SUM over CT | laddercodec gains the rule |
| A5 | Copy into a read-only SD: `SD1` | `CLK_BANK_NOT_WRITABLE` | not needed | Refuses SD1 (OBJ-004); accepts SD29, a writable SD | laddercodec gains: a read-only SD is not a copy destination |
| A6 | Coil on SC162. laddercodec's writable SC list is SC50, 51, 53, 55, 60, 61, 65 to 67, 75, 76, 120, 121, 162, 165, 168, 171, 303 to 306 and 323 to 326; pyrung's and pyclickplc's stop at SC121 | `CLK_BANK_NOT_WRITABLE` | None. pyrung's list was copied from pyclickplc and stops at SC121 | Accepts an Out on SC162, SC171, SC303 and SC326, all of them in laddercodec's list. Refuses all 15 points tried outside the list (OBJ-003): SC49, 52, 54, 57, 63, 70, 100, 140, 163, 166, 169, 200, 310, 327 and 1000 | Closed: laddercodec's list matches the editor at every point tried, and nothing backs pyrung's shorter one. pyrung's list goes with its validation tables. pyclickplc's `WRITABLE_SC` is a different fact (writable in Data View) and does not change |
| A7 | Block copy DS to SD | `CLK_COPY_BANK_INCOMPATIBLE` | | Refuses into SD1 (OBJ-004) and into SD29, whose range reaches read-only SD30 (OBJ-018); accepts into SD31..SD32 | Both change: the rule is that every address in the destination range is writable. pyrung stops refusing the pair; laddercodec gains the range check |
| A8 | Block copy TXT to TXT | `CLK_COPY_BANK_INCOMPATIBLE` | None | Accepts `TXT1..TXT2` into `TXT11` | Nobody refuses it. pyrung's list was missing the pair; it goes with the tables. A paste and copy back is still worth one run |
| A9 | Math result into SD, decimal | `CLK_MATH_DEST_BANK` | | Refuses SD1 (OBJ-003); accepts SD29 | Both change: a writable SD can be a Math result. pyrung allows it; laddercodec refuses a read-only one |
| A10 | Math result into YD, hex | `CLK_MATH_DEST_BANK` | None | Accepts YD0 and YD1 | Nobody refuses it. pyrung's check was too wide; it goes with the tables. A paste and copy back is still worth one run |

## B. laddercodec refuses, pyrung's tables allow

| # | Case | laddercodec's field | Editor | By the rule |
|---|---|---|---|---|
| B1 | Block copy DS to YD | `BlockCopy` | Refuses (OBJ-004) | laddercodec is right; pyrung's list loses the pair |
| B2 | Block copy TXT to DF | `BlockCopy` | Refuses (OBJ-024) | laddercodec is right; pyrung's list loses the pair |
| B3 | Pack bits X to DS | `Pack` | Refuses (OBJ-024). X and Y pack into DH and not into DS; C packs into every word bank tried. X001..X016 into DD or DF is refused too, which may be about width (not separated) | laddercodec is right; pyrung's list loses the pair |
| B4 | Pack words DH to DF | `Pack` | Refuses (OBJ-024); DH1..DH2 into DD1 is accepted | laddercodec is right; pyrung's list loses the pair |
| B5 | Unpack bits DS, DD or DF to Y | `Unpack` | Refuses all three (OBJ-024); DH1 to Y is accepted, and every word bank tried unpacks to C | laddercodec is right; pyrung's list loses the pairs |
| B6 | Math result into DH in decimal mode | `Math` | Refuses (OBJ-004); DH as a hex result is accepted | laddercodec is right; the same fact as A1 |
| B7 | Receive destination CTD, TD or SD | `Receive dest` | not asked yet | |
| B8 | pyrung's coil-target table lists X, T and CT | `Coil.operand` | Refuses an Out on X001, T1 and CT1 (OBJ-004); accepts Y001, C1 and SC50 | laddercodec is right. pyrung's writability check already refuses a coil on X, T and CT, so the three table entries are dead weight and no program gets through. Closed; the table goes in the validation move |

## C. laddercodec refuses, pyrung has no rule

Decided by the "refusal wins" default, and Sam told the ClickNick session on 2026-11-16 that these "all
seem correct": laddercodec's refusal stands, and pyrung reports it once its export
builds laddercodec's objects. Listed so that nobody adds a second rule in pyrung.

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

CLICK's answers are from its Syntax Check, run by ClickNick's runner on pasted rungs (CLICK v4.00,
2026-11-16). Two laddercodec cells were stale and are corrected here, as the ClickNick and laddercodec
sessions both confirm.

| # | Case | pyrung | laddercodec | Syntax Check | Decision |
|---|---|---|---|---|---|
| D1 | Bridges, pins that share contacts, a reset wire that also feeds an output | imports them, a bridge with a warning | encodes the rung as drawn; `check()` reports it | Refuses all of them. A bridge, with or without a reset: C0001. Pins sharing the reset's contact or fed from a tee, and a reset wire that also feeds an output: C000A, "All inputs of the box instruction must originate from the same branch." | Sam: what pyrung's importer does with a rung the Syntax Check refuses |
| D2 | A rung holding only a comment, wires or NOPs; a NOP sharing a rung | importer refuses | reads it | No error. The check itself drops a NOP on its own row beside a coil, and wires a wires-only rung through column AF | CLICK accepts these, so pyrung's importer is the one out of step. For the import step |
| D3 | A counter or timer reset with nothing wired to it | keeps the pin with an empty condition | keeps it as its `.reset()` row | Refuses: C0202, "Row N, Column AF : Missing line connection." | With D1 |

laddercodec is building `check()` to agree with these answers.

Closed: the instruction name `calc` came from a stale pyrung fixture that nothing reads; the pyrung session
is deleting it.

## E. Names

| # | Case | pyrung | pyclickplc | CLICK | By the rule |
|---|---|---|---|---|---|
| E1 | RTC system nicknames (SD19 to SD26) | `_RTC_Month`, `_RTC_Day`, ... | `_RTC_Month (1-12)`, `_RTC_Day (1-31)`, ... | A new project's database holds three system rows. Closing the Address Picker with OK writes every SC and SD row with its nickname (135 SC, 222 SD). SD19 to SD26 are then `_RTC_Year(4 digits)`, `_RTC_Year(2 digits)`, `_RTC_Month`, `_RTC_Day`, `_RTC_Day_of_The_Week`, `_RTC_Hour`, `_RTC_Minute`, `_RTC_Second`, the same as the installed `PLCType.ini` | Closed: pyrung's names are CLICK's, and pyclickplc changes to them. Two of CLICK's own names contain parentheses, which CLICK refuses in a nickname a user types, so a system name is not held to the user's rule |

## F. Constants

What CLICK stores for a constant, from 95 cases saved and decoded by ClickNick's runner (CLICK v4.00). These
are for laddercodec's canonical-constants branch, which also takes over spelling a constant from a Python
value. The per-case comparison is in the runner's results file; laddercodec keeps the cases as test data.

| # | Case | laddercodec today | CLICK |
|---|---|---|---|
| F1 | `005` in a hex formula | refuses | accepts, stores `5h`. A constant without `h` in a hex formula is taken as hex: `1e3` is stored `1E3h` |
| F2 | A Real as typed (`1.50`, `1e3`, `.5`) | writes it as typed | stores its own printed form: `1.5`, `1000.0`, `0.5`. `1.5E+10` is kept as typed |
| F3 | `EH` as a Copy source | reads it as hex 14 | stores the Real 0.0 |
| F4 | `$1` copied into TXT | refuses | accepts, stores `$01` |

Also seen, with no difference recorded against laddercodec yet:

- A decimal formula refuses a leading zero (`005`, `-0`), a hex constant (`0ffh`, `$41`) and a decimal comma
  (`1,5`). `+5` and `-5` are accepted alone and refused in `DS2 + c`.
- A decimal formula refuses `3000000000` and accepts `6000000000`. Unexplained.
- A hex formula stores `0ffh`, `0FFh` and `ffh` all as `FFh`, accepts `ffffh`, and refuses `0FFFEh` and
  `1Eh`. `+5` is stored `+ 5h`, the sign as an operator of its own.
- A Copy source is stored in CLICK's form: `005` as `5`, `0ffh` as `0FFh`, `1.50` as `1.5`.

## Not yet probed

- Whether laddercodec's "no coil" check covers pyrung's "contacts before a NOP" rule.
- Whether anything in laddercodec enforces the 32-row limit that pyrung's export checks.
- Whether the two libraries split a wide rung into the same CLICK rungs.
