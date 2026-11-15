# Handoff to pyclickplc

Write `scratchpad/roadmap.md` from this, then delete this file. Cross-repo items are in `../README.md`; link to
them.

## Sam's rulings (2026-11-14)

1. **`parse_address` changes in place.** It accepts what CLICK accepts and nothing more. Lowercase stays
   (CLICK's dialogs take `x1` and `ds1` and reformat them). A stray `u` suffix and non-ASCII digits are
   refused. There is no separate strict mode. The first step is a test showing which loose inputs parse today.
2. **XD/YD display-unit range** is a new field beside `max_addr`. `max_addr` is left alone.
3. **Take in ClickNick's duplicates:** the nickname CSV reader and writer, the reader for CLICK's
   `Address.csv`, and the data-type maps. ClickNick's writer quotes Text values differently from this one on
   commas, quotes and spaces; settle which matches CLICK. The ClickNick session does the inventory first.
4. **A parity test in laddercodec** will use pyclickplc as a dev-only dependency, to keep laddercodec's
   private copy of the bank facts honest.

## Known, unscheduled

- pymodbus is capped below 3.13; lifting the cap needs `server.py` rewritten. pyrung imports the private
  `_ClickDeviceContext`, so the two move together. Sam's ruling: not now; revisit when something forces it, such as a security
  fix or a Python version the capped pymodbus does not support.
- `read_csv` skips bad rows silently.
- `AddressRecord.data_type` is an int from `read_csv` and a `DataType` from `make_address_record`. Cosmetic,
  since `DataType` is an IntEnum.

## Housekeeping

- Stale: local `bob/py-cdv-csv`.
- The project memory index from February is mostly wrong.
