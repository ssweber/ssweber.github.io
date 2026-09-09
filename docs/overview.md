# How it fits

Ladder leaves CLICK as readable source, gets tested in Python, and comes back through the clipboard. The project file changes only when you save it in CLICK Programming Software.

<ol class="round-trip" aria-label="The CLICK round trip">
  <li class="round-trip__step">
    <span class="round-trip__where">CLICK</span>
    <strong>Save the project</strong>
    <p>Draw ladder as usual. Save <code>Machine.ckp</code>.</p>
  </li>
  <li class="round-trip__step">
    <span class="round-trip__where">ClickNick</span>
    <strong>Source refreshes</strong>
    <p>Every save regenerates the ladder as pyrung text. Your tests and notes stay put.</p>
  </li>
  <li class="round-trip__step">
    <span class="round-trip__where">pyrung</span>
    <strong>Test offline</strong>
    <p>Run scans, write pytest cases, trace cause and effect. No hardware.</p>
  </li>
  <li class="round-trip__step">
    <span class="round-trip__where">ClickNick → CLICK</span>
    <strong>Paste back</strong>
    <p>Preview Changes shows the rung diff. Copy to Click puts the rungs you pick on the clipboard. Paste in CLICK, save.</p>
  </li>
</ol>

<div class="round-trip__rule">
  <strong>ClickNick never edits a <code>.ckp</code>.</strong>
  The project file changes only when you save it in CLICK Programming Software. Everything else is a copy you can regenerate.
</div>

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

The compatibility layer for CLICK ladder data. Reads and writes CLICK's native representations and enables reliable round-tripping between CLICK and the pyrung/ClickNick toolchain.

[laddercodec →](https://pyrung.com/laddercodec/)
</div>
<div class="library-card" markdown>
<span class="library-card__name">pyclickplc</span>

### The wire

Modbus TCP client and server for CLICK PLCs, plus the data I/O for addresses and DataView files. Both pyrung and ClickNick are built on it.

[pyclickplc →](https://pyrung.com/pyclickplc/)
</div>
</div>
