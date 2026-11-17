# Rule decisions: where pyrung and laddercodec disagree

This file lists every known case where the two libraries disagree about what CLICK allows. Each row is decided
once. Then it leaves this file, and the owning repo's session puts the decision into code and tests.

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

Decoding does not depend on these checks. If a stored value breaks a rule, laddercodec still decodes it as its
instruction and gives a warning. So decoding is not a reason for the rule. laddercodec also rejects anything
that breaks the encoding or crashes CLICK on a paste. No dialog sees these. Those rejections stay whatever the
editor says.

The samples are thin. The agent tried several rows with only a handful of values. It tried A1, A2 and A4 with
four or fewer banks, and the SD rows with SD1 and SD29 to SD32 only. Do not write a rule from them alone.

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
| B2 | Block copy TXT to DF | `BlockCopy` | Rejects it (OBJ-024) | CLICK rejects this pair, so laddercodec is right. The pyrung session removes the pair from its table |
| B3 | Pack bits X to DS | `Pack` | Rejects it (OBJ-024). X and Y pack into DH and not into DS. C packs into every word bank tried. It also rejects X001..X016 into DD or DF. That may be about width, but the agent did not separate the two | CLICK rejects this pair, so laddercodec is right. The pyrung session removes the pair from its table |
| B4 | Pack words DH to DF | `Pack` | Rejects it (OBJ-024). It accepts DH1..DH2 into DD1 | CLICK rejects this pair, so laddercodec is right. The pyrung session removes the pair from its table |
| B5 | Unpack bits DS, DD or DF to Y | `Unpack` | Rejects all three (OBJ-024). It accepts DH1 to Y. Every word bank tried unpacks to C | CLICK rejects these pairs, so laddercodec is right. The pyrung session removes the pairs from its table |
| B6 | Math result into DH in decimal mode | `Math` | Rejects it (OBJ-004). It accepts DH as a hex result | CLICK rejects it, so laddercodec is right. This is the same fact as A1 |
| B7 | Receive destination CTD, TD or SD | `Receive dest` | Rejects TD1, SD1 and CTD1 with FC03 (OBJ-004) | CLICK rejects them, so laddercodec is right. The pyrung session removes them from its table |
| B8 | pyrung's coil-target table lists X, T and CT | `Coil.operand` | Rejects an Out on X001, T1 and CT1 (OBJ-004). It accepts Y001, C1 and SC50 | CLICK rejects these, so laddercodec is right. pyrung's writability check already rejects a coil on X, T and CT. The three table entries do nothing, and no program gets through. Closed. The pyrung session removes the table in the validation move |

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
v4.00). On its `main`, laddercodec's encoder now writes constants the way CLICK stores them. At this sitting
nobody has checked the rows below against it one by one. They stay until the laddercodec session confirms
each. Still to ask CLICK: a trailing zero, the digits of a Real in Math, and the largest Real in Math. The
per-case comparison is in the runner's results file. laddercodec keeps the cases as test data.

| # | Case | laddercodec today | CLICK |
|---|---|---|---|
| F1 | `005` in a hex formula | Rejects it | Accepts it and stores `5h`. It reads a constant without `h` in a hex formula as hex, so it stores `1e3` as `1E3h` |
| F2 | A Real as typed (`1.50`, `1e3`, `.5`) | Writes it as typed | Stores its own printed form: `1.5`, `1000.0`, `0.5`. It stores `1.5E+10` as typed |
| F3 | `EH` as a Copy source | Reads it as hex 14 | Stores the Real 0.0 |
| F4 | `$1` copied into TXT | Rejects it | Accepts it and stores `$01` |

CLICK also did the following. Nobody has recorded a difference against laddercodec for any of it yet.

- A decimal formula rejects a leading zero (`005`, `-0`), a hex constant (`0ffh`, `$41`) and a decimal comma
  (`1,5`). It accepts `+5` and `-5` alone, and rejects them in `DS2 + c`.
- A decimal formula rejects `3000000000` and accepts `6000000000`. Nobody can explain this.
- A hex formula stores `0ffh`, `0FFh` and `ffh` all as `FFh`. It accepts `ffffh` and rejects `0FFFEh` and
  `1Eh`. It stores `+5` as `+ 5h`, with the sign as an operator of its own.
- A Copy source is stored in CLICK's form. It stores `005` as `5`, `0ffh` as `0FFh` and `1.50` as `1.5`.

## Not yet probed

- Whether laddercodec's "no coil" check covers pyrung's "contacts before a NOP" rule.
- Whether laddercodec enforces the 32-row limit that pyrung's export checks.
- Whether the two libraries split a wide rung into the same CLICK rungs.
