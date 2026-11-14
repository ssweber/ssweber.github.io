# Write ladder logic in Python. Test it. Deploy it to CLICK.

pyrung turns a Python `with` block into a ladder rung: same rungs, same scan order, same timers as the CLICK PLC, with git, pytest, and a debugger around them.

**New:** [ClickNick](https://pyrung.com/clicknick/) runs your saved CLICK program in a Simulator, with no PLC attached. [Does Click Have a Simulator? Now It Does →](blog/click-plc-simulator.md)

<section class="pl-demo" data-pl-demo data-state="start" data-motor-state="on" role="group" aria-labelledby="pl-demo-title">
  <h2 id="pl-demo-title" class="pl-demo__title">Same logic, two views</h2>
  <div class="pl-demo__views">
    <div class="pl-source">
      <div class="pl-source__label">pyrung</div>
      <div class="pl-block" role="img" aria-label="pyrung source for the Start latch and Stop reset rungs">
        <div><span class="pl-kw">with</span> <span class="pl-cls">Program</span>() <span class="pl-kw">as</span> logic:</div>
        <div class="pl-blank"></div>
        <div data-pl-condition data-code-rung="set">    <span class="pl-kw">with</span> <span class="pl-cls">rung</span>(Start):<span class="pl-anno" data-pl-condition-note>True</span></div>
        <div data-pl-body data-code-rung="set">        <span class="pl-fn">latch</span>(Motor)<span class="pl-anno" data-pl-body-note>Motor ON</span></div>
        <div class="pl-blank"></div>
        <div data-pl-condition data-code-rung="reset">    <span class="pl-kw">with</span> <span class="pl-cls">rung</span>(Stop):<span class="pl-anno" data-pl-condition-note>False</span></div>
        <div data-pl-body data-code-rung="reset">        <span class="pl-fn">reset</span>(Motor)<span class="pl-anno" data-pl-body-note>skipped</span></div>
      </div>
    </div>

    <figure class="pl-ladder">
      <figcaption>CLICK</figcaption>
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
  </div>
</section>

Condition on the rung, instruction in the body. Same scan order as the PLC, so what passes in pytest is what runs in CLICK.

<div class="visitor-paths" markdown>
<div class="visitor-path visitor-path--primary" markdown>
## Draw your ladder in CLICK?

[ClickNick](https://pyrung.com/clicknick/) sits beside CLICK Programming Software and runs your saved program in a Simulator, with no PLC attached. Work the switches, step scan by scan, and ask `why` an output is off. Windows.

`uv tool install clicknick`

[ClickNick](https://pyrung.com/clicknick/){ .md-button .md-button--primary }
</div>
<div class="visitor-path" markdown>
## Rather write it in Python?

`pip install pyrung`, then the [Quickstart](https://pyrung.com/pyrung/getting-started/quickstart/). Existing CLICK project? ClickNick generates the pyrung source from your `.ckp`.

[pyrung docs](https://pyrung.com/pyrung/){ .md-button }
</div>
</div>

## Why

CLICK PLCs ship with no simulator, no version control beyond copies of a `.ckp`, and no way to test a program short of downloading it to a real PLC. You draw the ladder in CLICK Programming Software, download it to hardware, and hope. The Structured Text crowd has options. The ladder crowd doesn't.

pyrung is that option. It is an engine that runs ladder the way a CLICK scans it, and you can reach it two ways: ClickNick simulates the program you saved in CLICK, and pyrung on its own lets you write and test the same rungs in Python first.

A simulator is only as good as its engine, so pyrung is checked against a real CLICK, one case at a time. [Does Click Have a Simulator? Now It Does](blog/click-plc-simulator.md) tells how, and the [conformance page](https://pyrung.com/pyrung/guides/conformance/) has the current count.

!!! warning "A simulator, not a substitute for testing"
    The conformance results come from one CPU, and yours may differ in ways the suite doesn't reach. Test on the real machine, with proper safeguards, before anything interacts with people. pyrung and ClickNick are independent projects, not affiliated with or endorsed by AutomationDirect.

## Who it's for

**CLICK programmers** who want to see a program run before it is on a machine. Keep drawing ladder in CLICK. ClickNick simulates what you saved and shows the rung-by-rung difference before you paste anything back.

**Controls engineers** who want to test CLICK logic without hardware. Write with plain tag names, map them to X, Y, C, and DS addresses when you're ready, and let the validator tell you what CLICK's memory banks will and won't accept before you find out at the PLC.

**Python developers** entering industrial automation. pyrung teaches ladder logic in the language and tools you already have: Python, pytest, and VS Code. Start with [Know Python? Learn Ladder Logic.](https://pyrung.com/pyrung/learn/)

**Makers and P1AM-200 users** who want a real scan cycle without writing the plumbing. The same program you tested on your laptop generates a CircuitPython scan loop with timers, counters, Modbus TCP, and SD-backed retentive state.

## Under the hood

[laddercodec](https://pyrung.com/laddercodec/) is the compatibility layer for CLICK ladder data, enabling reliable round-tripping between CLICK and the pyrung/ClickNick toolchain. [pyclickplc](https://pyrung.com/pyclickplc/) talks Modbus TCP to a CLICK PLC.

[How the pieces fit](overview.md){ .md-button } [Blog](blog/index.md){ .md-button }
