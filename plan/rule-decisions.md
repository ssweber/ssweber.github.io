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
  v4.00 on 2026-11-15, each with controls. Still to ask: the Receive dialog (B7) and section D.

Then the rule, proposed by the planner and not yet confirmed by Sam:

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

"By the rule" in the last column is what the proposed rule gives. It becomes the decision when Sam confirms
the rule.

| # | Case | pyrung's code | PLC reading | Editor | By the rule |
|---|---|---|---|---|---|
| A1 | Word (DH) and non-Word operands in one math: `DH1 + DS1` | `CLK_MATH_MODE_MIXED` | not needed | Refuses, both modes (OBJ-1002). Decimal refuses DH1 alone and hex refuses DS1 alone, so "mixed" is a special case | laddercodec gains: no DH in a decimal formula, no decimal register in a hex one |
| A2 | A RAND bound that is not a whole number or is a DF or DH | `CLK_RAND_BOUND_TYPE` | not needed | Refuses all three (`1.5` OBJ-1001; DF1, DH1 OBJ-1002). A DS bound is accepted in either place | laddercodec gains the rule |
| A3 | RAND with equal bounds: `RAND(5,5)` | `CLK_RAND_EQUAL_BOUNDS` | not needed | Refuses (OBJ-1001). `RAND(10,1)`, bounds the wrong way round, is accepted | laddercodec gains the rule |
| A4 | SUM over a TXT range | `CLK_MATH_SUM_BANK_NOT_AVAILABLE` | not needed | Refuses (OBJ-1002), as it does SUM over CT | laddercodec gains the rule |
| A5 | Copy into a read-only SD: `SD1` | `CLK_BANK_NOT_WRITABLE` | not needed | Refuses SD1 (OBJ-004); accepts SD29, a writable SD | laddercodec gains: a read-only SD is not a copy destination |
| A6 | Coil on SC162. laddercodec's writable SC list is SC50, 51, 53, 55, 60, 61, 65 to 67, 75, 76, 120, 121, 162, 165, 168, 171, 303 to 306 and 323 to 326; pyrung's and pyclickplc's stop at SC121 | `CLK_BANK_NOT_WRITABLE` | | Accepts an Out on SC162, SC171, SC303 and SC326, all of them in laddercodec's list. Nothing in a gap was tried: SC163 and SC310 should be refused | laddercodec's list looks right; try the gaps before pyrung takes it. Whether pyclickplc's list means the same thing is for the pyclickplc session |
| A7 | Block copy DS to SD | `CLK_COPY_BANK_INCOMPATIBLE` | | Refuses into SD1 (OBJ-004) and into SD29, whose range reaches read-only SD30 (OBJ-018); accepts into SD31..SD32 | Both change: the rule is that every address in the destination range is writable. pyrung stops refusing the pair; laddercodec gains the range check |
| A8 | Block copy TXT to TXT | `CLK_COPY_BANK_INCOMPATIBLE` | | Accepts `TXT1..TXT2` into `TXT11` | Waits on the PLC reading. With none, pyrung's list gains the pair |
| A9 | Math result into SD, decimal | `CLK_MATH_DEST_BANK` | | Refuses SD1 (OBJ-003); accepts SD29 | Both change: a writable SD can be a Math result. pyrung allows it; laddercodec refuses a read-only one |
| A10 | Math result into YD, hex | `CLK_MATH_DEST_BANK` | | Accepts YD0 and YD1 | Waits on the PLC reading. With none, pyrung's list gains YD |

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
| B8 | pyrung's coil-target table lists X, T and CT | `Coil.operand` | Refuses an Out on X001, T1 and CT1 (OBJ-004); accepts Y001, C1 and SC50 | laddercodec is right; pyrung's table loses the three. The pyrung session says whether its writability check already refused them |

## C. laddercodec refuses, pyrung has no rule

Decided by the "refusal wins" default: laddercodec's refusal stands, and pyrung reports it once its export
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

| # | Case | pyrung | laddercodec | Editor or syntax check | Decision |
|---|---|---|---|---|---|
| D1 | Bridges, pins that share contacts, a reset wire that also feeds an output (15 of 281 fixture files) | imports them, a bridge with a warning | refuses the rung | | Sam |
| D2 | A rung holding only a comment, wires or NOPs; a NOP sharing a rung (11 files) | importer refuses | reads it | | |
| D3 | A pin with nothing wired to it (3 files) | keeps the pin with an empty condition | drops the pin | | |
| D4 | The instruction name `calc` in one pyrung fixture (`ladder_realistic_output/main.csv`) | passes it through | refuses the name | not a CLICK question: the pyrung session says whether the fixture is stale | |

## E. Names

| # | Case | pyrung | pyclickplc | CLICK | By the rule |
|---|---|---|---|---|---|
| E1 | RTC system nicknames (SD21, SD22, SD24, SD25, SD26) | `_RTC_Month`, `_RTC_Day`, ... | `_RTC_Month (1-12)`, `_RTC_Day (1-31)`, ... | Not an editor question. CLICK's installed `PLCType.ini` names them `_RTC_Month`, `_RTC_Day`, `_RTC_Hour`, `_RTC_Minute`, `_RTC_Second`, with no range in the name. A new project's database has no row for them | pyrung's names match CLICK's; pyclickplc's differ. For the pyclickplc session to check and change |

## Not yet probed

- Whether laddercodec's "no coil" check covers pyrung's "contacts before a NOP" rule.
- Whether anything in laddercodec enforces the 32-row limit that pyrung's export checks.
- Whether the two libraries split a wide rung into the same CLICK rungs.
