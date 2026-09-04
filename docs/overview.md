# How it fits

<picture class="overview-diagram">
  <source media="(max-width: 700px)" srcset="../assets/click-round-trip-mobile.svg">
  <img src="assets/click-round-trip.svg" alt="CLICK Programming Software saves Machine.ckp; ClickNick refreshes a readable workspace, pyrung checks it offline, and Preview Changes plus Guided Paste return selected rungs through CLICK for engineer review and Save. laddercodec handles the clipboard format, while pyclickplc can optionally connect Python to a CLICK PLC over Modbus TCP." loading="lazy" decoding="async">
</picture>

ClickNick opens beside CLICK Programming Software. Each save regenerates a workspace: the ladder as pyrung text plus whatever you keep with the machine, tests, notes, reproductions. Changes go back the way rungs have always moved between CLICK projects, through the clipboard. Preview Changes shows the rung diff, Guided Paste puts the rungs on the clipboard in CLICK's native format, you paste, you save.

**ClickNick never edits a `.ckp`.** The project file changes only when you save it in CLICK Programming Software.

<div class="library-cards" markdown>
<div class="library-card" markdown>
<span class="library-card__name">ClickNick</span>

### The app

Nickname autocomplete, program checks, an offline Console, and your ladder (as Python) after every save, beside CLICK Programming Software. Windows.

[ClickNick →](https://pyrung.com/clicknick/)
</div>
<div class="library-card" markdown>
<span class="library-card__name">pyrung</span>

### The engine

A Python DSL that reads like ladder and scans like a CLICK, with pytest, a VS Code debugger, cause/effect tracing, and exhaustive checks. Also generates CircuitPython for the P1AM-200.

[pyrung docs →](https://pyrung.com/pyrung/)
</div>
<div class="library-card" markdown>
<span class="library-card__name">laddercodec</span>

### The codec

Encodes and decodes CLICK's clipboard binary, so rungs move between text and CLICK Programming Software. Reverse-engineered; the format is undocumented by its creator.

[laddercodec →](https://pyrung.com/laddercodec/)
</div>
<div class="library-card" markdown>
<span class="library-card__name">pyclickplc</span>

### The wire

Modbus TCP client and server for CLICK PLCs, plus the data I/O for addresses and DataView files. Both pyrung and ClickNick are built on it.

[pyclickplc →](https://pyrung.com/pyclickplc/)
</div>
</div>
