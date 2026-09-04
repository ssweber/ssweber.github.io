# Write ladder logic in Python. Test it. Deploy it to CLICK.

pyrung turns a Python `with` block into a ladder rung: same rungs, same scan order, same timers as the CLICK PLC, with git, pytest, and a debugger around them.

<section class="pl-demo" data-pl-demo data-state="latched" role="group" aria-labelledby="pl-demo-title">
  <h2 id="pl-demo-title" class="pl-demo__title">If you can read ladder, you can read this</h2>
  <div class="pl-demo__views">
    <figure class="pl-ladder">
      <figcaption>Graphical</figcaption>
      <svg viewBox="0 0 320 185" role="img" aria-label="Two ladder rungs. Start latches Motor; Stop resets Motor.">
        <line class="pl-ladder__rail" x1="22" y1="22" x2="22" y2="161"></line>
        <line class="pl-ladder__rail" x1="298" y1="22" x2="298" y2="161"></line>

        <g class="pl-ladder__rung" data-ladder-rung="set">
          <line class="pl-ladder__wire" x1="22" y1="61" x2="86" y2="61"></line>
          <line class="pl-ladder__contact" x1="86" y1="47" x2="86" y2="75"></line>
          <line class="pl-ladder__contact" x1="112" y1="47" x2="112" y2="75"></line>
          <line class="pl-ladder__wire" x1="112" y1="61" x2="246" y2="61"></line>
          <circle class="pl-ladder__coil" cx="263" cy="61" r="17"></circle>
          <line class="pl-ladder__wire" x1="280" y1="61" x2="298" y2="61"></line>
          <text class="pl-ladder__label" x="99" y="39" text-anchor="middle">Start</text>
          <text class="pl-ladder__coil-mark" x="263" y="66" text-anchor="middle">S</text>
          <text class="pl-ladder__label" x="263" y="38" text-anchor="middle">Motor</text>
          <path class="pl-ladder__power" d="M22 61 H86 M86 61 H112 M112 61 H246 M280 61 H298"></path>
        </g>

        <g class="pl-ladder__rung" data-ladder-rung="reset">
          <line class="pl-ladder__wire" x1="22" y1="127" x2="86" y2="127"></line>
          <line class="pl-ladder__contact" x1="86" y1="113" x2="86" y2="141"></line>
          <line class="pl-ladder__contact" x1="112" y1="113" x2="112" y2="141"></line>
          <line class="pl-ladder__wire" x1="112" y1="127" x2="246" y2="127"></line>
          <circle class="pl-ladder__coil" cx="263" cy="127" r="17"></circle>
          <line class="pl-ladder__wire" x1="280" y1="127" x2="298" y2="127"></line>
          <text class="pl-ladder__label" x="99" y="105" text-anchor="middle">Stop</text>
          <text class="pl-ladder__coil-mark" x="263" y="132" text-anchor="middle">R</text>
          <text class="pl-ladder__label" x="263" y="104" text-anchor="middle">Motor</text>
          <path class="pl-ladder__power" d="M22 127 H86 M86 127 H112 M112 127 H246 M280 127 H298"></path>
        </g>

        <g class="pl-ladder__motor" aria-hidden="true">
          <circle cx="263" cy="166" r="5"></circle>
          <text x="251" y="170" text-anchor="end">Motor</text>
          <text data-motor-label x="273" y="170">ON</text>
        </g>
      </svg>
    </figure>

    <div class="pl-source">
      <div class="pl-source__label">Python</div>
      <div class="pl-block" role="img" aria-label="pyrung source for the Start latch and Stop reset rungs">
        <div><span class="pl-kw">with</span> <span class="pl-cls">Program</span>() <span class="pl-kw">as</span> logic:</div>
        <div class="pl-blank"></div>
        <div data-pl-condition data-code-rung="set">    <span class="pl-kw">with</span> <span class="pl-cls">rung</span>(Start):<span class="pl-anno" data-pl-condition-note>False</span></div>
        <div data-pl-body data-code-rung="set">        <span class="pl-fn">latch</span>(Motor)<span class="pl-anno" data-pl-body-note>skipped</span></div>
        <div class="pl-blank"></div>
        <div data-pl-condition data-code-rung="reset">    <span class="pl-kw">with</span> <span class="pl-cls">rung</span>(Stop):<span class="pl-anno" data-pl-condition-note>False</span></div>
        <div data-pl-body data-code-rung="reset">        <span class="pl-fn">reset</span>(Motor)<span class="pl-anno" data-pl-body-note>skipped</span></div>
      </div>
    </div>
  </div>
  <p class="pl-status" data-pl-status aria-live="polite">Start released. Stop open. Motor stays latched.</p>
</section>

Condition on the rung, instruction in the body. It reads like the diagram, runs as a deterministic scan cycle, tests with pytest, and pastes back into CLICK.

## Why

CLICK PLCs ship with no simulator, no version control beyond copies of a `.ckp`, and no way to test a program short of downloading it to a real PLC. You draw the ladder in CLICK Programming Software, download it to hardware, and hope. The Structured Text crowd has options. The ladder crowd doesn't. pyrung is that option: write and test the logic in Python first, then move the same rungs into CLICK.

## Who it's for

**Controls engineers** who want to test CLICK logic without hardware. Write with plain tag names, map them to X, Y, C, and DS addresses when you're ready, and let the validator tell you what CLICK's memory banks will and won't accept before you find out at the PLC.

**Python developers** entering industrial automation. pyrung teaches ladder logic in the language and tools you already have: Python, pytest, and VS Code. Start with [Know Python? Learn Ladder Logic.](https://pyrung.com/pyrung/learn/)

**Makers and P1AM-200 users** who want a real scan cycle without writing the plumbing. The same program you tested on your laptop generates a CircuitPython scan loop with timers, counters, Modbus TCP, and SD-backed retentive state.

Rather keep drawing ladder in CLICK? **[ClickNick](https://pyrung.com/clicknick/)** adds nickname autocomplete, program checks, offline runs, and your ladder (as Python) after every save. Built on pyrung.

<div class="visitor-paths" markdown>
<div class="visitor-path visitor-path--primary" markdown>
## Get started

`pip install pyrung`, then the [Quickstart](https://pyrung.com/pyrung/getting-started/quickstart/). Existing CLICK project? [ClickNick](https://pyrung.com/clicknick/) generates the pyrung source from your `.ckp`.

[pyrung docs](https://pyrung.com/pyrung/){ .md-button .md-button--primary }
</div>
<div class="visitor-path" markdown>
## Under the hood

[laddercodec](https://pyrung.com/laddercodec/) encodes rungs into CLICK's clipboard format. [pyclickplc](https://pyrung.com/pyclickplc/) talks Modbus TCP to a CLICK PLC.

[How the pieces fit](overview.md){ .md-button } [Blog](blog/index.md){ .md-button }
</div>
</div>
