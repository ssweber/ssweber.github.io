# Rule decisions: where pyrung and laddercodec disagree

Every known case where the two libraries give a different answer about what CLICK allows, in one place. Each
row is decided once and then leaves this file: the decision goes into code and tests in the owning repo.

The rows were probed on 2026-11-15 by a research agent against `main` of both repos. They are unconfirmed
until the owning session has checked them. New disagreements found by pyrung's agreement test
(`README.md` item 2) are added here.

## How a row is decided

Two columns are filled in before anyone decides anything:

- **PLC reading** (the pyrung session): the conformance reading behind pyrung's rule, or "none".
- **Editor** (Sam, with CLICK open, not from memory): whether CLICK's editor accepts the instruction as
  typed. The runner cannot fill this column: it pastes rungs through the clipboard, which may skip the checks
  the editor makes when an instruction is typed in. There are 23 rows to try: sections A, B, D and E.

Then the rule, proposed by the planner and not yet confirmed by Sam:

1. The editor refuses it: laddercodec refuses it, and pyrung's own copy of the rule goes.
2. The editor accepts it and a PLC reading shows the PLC doing something a user would not expect: laddercodec
   accepts it, and pyrung keeps a finding that says what the PLC does.
3. The editor accepts it and there is no reading: nobody refuses it.
4. Anything the rule does not settle goes to Sam, one row at a time.

laddercodec has to decode whatever a real project holds, so it refuses only what the editor refuses.

## A. pyrung refuses, laddercodec accepts

| # | Case | pyrung's code | PLC reading | Editor | Decision |
|---|---|---|---|---|---|
| A1 | Word (DH) and non-Word operands in one math: `DH1 + DS1` | `CLK_MATH_MODE_MIXED` | | | |
| A2 | A RAND bound that is not a whole number or is a DF or DH: `RAND(1.5,10)`, `RAND(DF1,10)`, `RAND(DH1,10)` | `CLK_RAND_BOUND_TYPE` | | | |
| A3 | RAND with equal bounds: `RAND(5,5)` | `CLK_RAND_EQUAL_BOUNDS` | | | |
| A4 | SUM over a TXT range (both refuse SUM over CT) | `CLK_MATH_SUM_BANK_NOT_AVAILABLE` | | | |
| A5 | Copy into a read-only SD: `SD1` | `CLK_BANK_NOT_WRITABLE` | | | |
| A6 | Coil on SC162. laddercodec's writable SC list has SC162 to SC171 and SC303 to SC326; pyrung's and pyclickplc's do not | `CLK_BANK_NOT_WRITABLE` | | | |
| A7 | Block copy DS to SD | `CLK_COPY_BANK_INCOMPATIBLE` | | | |
| A8 | Block copy TXT to TXT | `CLK_COPY_BANK_INCOMPATIBLE` | | | |
| A9 | Math result into SD, decimal: `SD1`, `SD29` | `CLK_MATH_DEST_BANK` | | | |
| A10 | Math result into YD, hex: `YD0` | `CLK_MATH_DEST_BANK` | | | |

A7 to A10 come from pyrung tables written as lists of what is allowed, so the refusal may be a pair nobody
added.

## B. laddercodec refuses, pyrung's tables allow

| # | Case | laddercodec's field | PLC reading | Editor | Decision |
|---|---|---|---|---|---|
| B1 | Block copy DS to YD | `BlockCopy` | | | |
| B2 | Block copy TXT to DF | `BlockCopy` | | | |
| B3 | Pack bits X to DS | `Pack` | | | |
| B4 | Pack words DH to DF | `Pack` | | | |
| B5 | Unpack bits DS, DD or DF to Y | `Unpack` | | | |
| B6 | Math result into DH in decimal mode | `Math` | | | |
| B7 | Receive destination CTD, TD or SD | `Receive dest` | | | |
| B8 | pyrung's coil-target table lists X, T and CT; laddercodec allows Y, C and SC. pyrung's writability check may already refuse these; the pyrung session to say | `Coil.operand` | | | |

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

| # | Case | pyrung | pyclickplc | Editor | Decision |
|---|---|---|---|---|---|
| E1 | RTC system nicknames (SD21, SD22, SD24, SD25, SD26) | `_RTC_Month`, `_RTC_Day`, ... | `_RTC_Month (1-12)`, `_RTC_Day (1-31)`, ... | | |

## Not yet probed

- Whether laddercodec's "no coil" check covers pyrung's "contacts before a NOP" rule.
- Whether anything in laddercodec enforces the 32-row limit that pyrung's export checks.
- Whether the two libraries split a wide rung into the same CLICK rungs.
