# Ladder Logic as Text

<style>
.pl-block {
  --pl-bg: #f5f5f5;
  --pl-border: #e0e0e0;
  --pl-text: #2d2d2d;
  --pl-kw: #22863a;
  --pl-cls: #b8600a;
  --pl-fn: #0771b8;
  --pl-op: #999;
  --pl-lit: #8250df;
  --pl-green: #22863a;
  --pl-green-dim: #a8ddb5;
  --pl-amber: #b8600a;
  --pl-muted: #999;

  background: var(--pl-bg);
  border: 1px solid var(--pl-border);
  border-radius: 4px;
  padding: 1.2rem 1.4rem;
  font-family: ui-monospace, 'Cascadia Code', 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  font-size: 0.84rem;
  line-height: 1.8;
  color: var(--pl-text);
  max-width: 700px;
  margin: 1.5em 0;
  overflow-x: hidden;
}

@media (max-width: 480px) {
  .pl-block .pl-anno { display: none; }
}

.pl-block div {
  white-space: pre;
  padding: 0 0.4rem;
  border-left: 2px solid transparent;
  transition: border-color 0.4s, opacity 0.4s;
}
.pl-block .pl-blank { min-height: 0.5em; }
.pl-block .pl-anno {
  font-size: 0.7rem;
  opacity: 0;
  transition: opacity 0.4s;
  margin-left: 1.2rem;
}

.pl-kw  { color: var(--pl-kw); }
.pl-cls { color: var(--pl-cls); }
.pl-fn  { color: var(--pl-fn); }
.pl-op  { color: var(--pl-op); }
.pl-lit { color: var(--pl-lit); }

/* Dark: system preference */
@media (prefers-color-scheme: dark) {
  .pl-block {
    --pl-bg: #0d1110;
    --pl-border: #1e2a22;
    --pl-text: #c8d4cc;
    --pl-kw: #39ff8a;
    --pl-cls: #ffb830;
    --pl-fn: #6ae9ff;
    --pl-op: #5a6b60;
    --pl-lit: #c792ea;
    --pl-green: #39ff8a;
    --pl-green-dim: #1a6638;
    --pl-amber: #ffb830;
    --pl-muted: #5a6b60;
  }
}

/* Dark: Material for MkDocs slate toggle */
[data-md-color-scheme="slate"] .pl-block {
  --pl-bg: #0d1110;
  --pl-border: #1e2a22;
  --pl-text: #c8d4cc;
  --pl-kw: #39ff8a;
  --pl-cls: #ffb830;
  --pl-fn: #6ae9ff;
  --pl-op: #5a6b60;
  --pl-lit: #c792ea;
  --pl-green: #39ff8a;
  --pl-green-dim: #1a6638;
  --pl-amber: #ffb830;
  --pl-muted: #5a6b60;
}
</style>

<div class="pl-block">
<div><span class="pl-kw">with</span> <span class="pl-cls">Program</span>() <span class="pl-kw">as</span> logic:</div>
<div class="pl-blank"></div>
<div id="r1c">    <span class="pl-kw">with</span> <span class="pl-cls">Rung</span>(Start<span class="pl-op">,</span> <span class="pl-op">~</span>Stop):<span class="pl-anno" id="a1c">True</span></div>
<div id="r1b">        <span class="pl-fn">latch</span>(Motor)<span class="pl-anno" id="a1b">Motor ← True</span></div>
<div class="pl-blank"></div>
<div id="r2c">    <span class="pl-kw">with</span> <span class="pl-cls">Rung</span>(Stop):<span class="pl-anno" id="a2c">False</span></div>
<div id="r2b">        <span class="pl-fn">reset</span>(Motor)<span class="pl-anno" id="a2b">skipped</span></div>
</div>

<script>
(function() {
  var rungs = [
    { cond: 'r1c', body: 'r1b', ac: 'a1c', ab: 'a1b', pass: true },
    { cond: 'r2c', body: 'r2b', ac: 'a2c', ab: 'a2b', pass: false }
  ];
  var idx = -1;
  var s = getComputedStyle(document.querySelector('.pl-block'));

  function clear(r) {
    document.getElementById(r.cond).style.borderLeftColor = 'transparent';
    document.getElementById(r.body).style.borderLeftColor = 'transparent';
    document.getElementById(r.body).style.opacity = '1';
    document.getElementById(r.ac).style.opacity = '0';
    document.getElementById(r.ab).style.opacity = '0';
  }

  function show(r, done) {
    var s = getComputedStyle(document.querySelector('.pl-block'));
    var green = s.getPropertyValue('--pl-green').trim();
    var greenDim = s.getPropertyValue('--pl-green-dim').trim();
    var amber = s.getPropertyValue('--pl-amber').trim();
    var muted = s.getPropertyValue('--pl-muted').trim();

    document.getElementById(r.cond).style.borderLeftColor = r.pass ? green : amber;
    document.getElementById(r.ac).style.color = r.pass ? green : amber;
    document.getElementById(r.ab).style.color = r.pass ? green : muted;
    if (!r.pass) document.getElementById(r.ab).style.fontStyle = 'italic';
    setTimeout(function() {
      document.getElementById(r.ac).style.opacity = '1';
      setTimeout(function() {
        document.getElementById(r.body).style.borderLeftColor = r.pass ? greenDim : 'transparent';
        if (!r.pass) document.getElementById(r.body).style.opacity = '0.25';
        document.getElementById(r.ab).style.opacity = '1';
        setTimeout(done, 1200);
      }, 600);
    }, 400);
  }

  function step() {
    if (idx >= 0) clear(rungs[idx]);
    if (++idx >= rungs.length) {
      idx = -1;
      setTimeout(step, 1400);
      return;
    }
    show(rungs[idx], function() { setTimeout(step, 200); });
  }

  setTimeout(step, 1200);
})();
</script>

That's ladder logic. Condition on the `Rung`, instruction in the body. It reads like the diagram, runs as a deterministic scan cycle, tests with pytest, and compiles to real hardware.

Ladder logic dominates North American discrete manufacturing, but the tooling hasn't kept up. No version control, no automated testing, no way to simulate without hardware. The Structured Text crowd has options. The ladder crowd doesn't.

## pyrung

[pyrung](https://ssweber.github.io/pyrung/) is a Python DSL for writing, simulating, and testing ladder logic. The `with` block naturally separates the condition from the instruction, which is exactly what a ladder rung does. A controls engineer can map it to the diagram they already know.

Every scan produces an immutable state snapshot. Time is a variable you control. A DAP debugger lets you step through scans rung by rung in VS Code. Currently targets AutomationDirect Click PLC behavior faithfully: nearly the complete instruction set, memory banks, numeric quirks, scan-cycle semantics.

### Two deployment targets

pyrung compiles to two backends from the same source:

**Click PLC** via [ClickNick](https://github.com/ssweber/clicknick). Your tested logic encodes to the bytes the CLICK editor expects on paste. No transposing by hand.

**ProductivityOpen P1AM-200** via CircuitPython code generation. Your tested logic becomes a self-contained scan loop that runs directly on the hardware, with the same Modbus TCP interface as a Click. No proprietary toolchain in the path.

Write it once, test it once, pick your target.

```mermaid
graph LR
    D[Click Project] -->|codegen| A[pyrung]
    A -->|encode| C[ClickNick]
    C -->|paste| D
    D -->|download| E[Click PLC]
    A -->|generate| G[CircuitPython]
    G -->|deploy| H[P1AM-200]
    E <-->|Modbus TCP| F[pyclickplc]
    H <-->|Modbus TCP| F
```

### Existing projects welcome

Generate pyrung code from an existing `.ckp` project. You don't have to start from scratch to get simulation and testing on programs you've already built.

## The supporting projects

Each of these works on its own, but they were designed to work with pyrung.

**[ClickNick](https://github.com/ssweber/clicknick)** is the Windows-side glue. A Ladder menu handles moving logic in and out of Click — encoding CSVs to the clipboard, decoding rungs back out, guided paste with nickname import, exporting projects, and converting to pyrung. Beyond that: autocomplete over the CLICK editor's instruction dialogs, a modern address editor with bulk editing and search/replace, a tag browser with hierarchy and array grouping, and a DataView editor with drag-and-drop. Works alongside your existing `.ckp` projects.

**[pyclickplc](https://ssweber.github.io/pyclickplc/)** is the Modbus TCP layer. Read and write registers on real Click hardware, or run pyrung as an emulated Click that any Modbus client can talk to. Also manages nickname and DataView files. Both the Click PLC and the P1AM-200 speak the same Modbus interface, so pyclickplc doesn't need to know which one it's talking to.

**[laddercodec](https://ssweber.github.io/laddercodec/)** is the binary codec for Click's undocumented clipboard format. Reverse-engineered from scratch; the format remains undocumented by its creator. Used by ClickNick under the hood.

## Limitations

pyrung simulates Click PLC behavior as faithfully as possible, but it is not a certified simulator. If your program behaves differently in pyrung than on a Click PLC, that's a bug we want to know about, but you should always validate on real hardware before deploying to production. The CircuitPython target runs on a garbage-collected runtime, so sub-millisecond scan timing is not realistic. Modbus TCP has no built-in authentication; keep it on isolated networks.

## Blog

- [These Aren't the Rungs You're Looking For](blog/these-arent-the-rungs.md) - How I reverse-engineered Click's clipboard format so my bytes could paste without any problems.
- [Why pyrung?](blog/why-pyrung.md) - A look at the PLC tooling landscape and where pyrung fits.
