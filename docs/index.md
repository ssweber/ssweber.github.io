# Ladder logic as text.

Version control, automated tests, offline simulation, code review — for the people who program machines in ladder, on the PLC they already use.

<section class="pl-demo" data-pl-demo data-state="latched" role="group" aria-labelledby="pl-demo-title">
  <h2 id="pl-demo-title" class="pl-demo__title">The same two rungs, two useful views</h2>
  <div class="pl-demo__views">
    <figure class="pl-ladder">
      <figcaption>Conventional ladder</figcaption>
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
      <div class="pl-source__label">Ladder as pyrung text</div>
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
  <p class="pl-status" data-pl-status aria-live="polite">Start released. Stop open. Motor remains latched on.</p>
</section>

That's ladder logic. Condition on the `rung`, instruction in the body. It reads like the diagram, runs as a scan cycle, tests offline, and goes back into CLICK.

<div class="visitor-paths" markdown>
<div class="visitor-path visitor-path--primary" markdown>
## I have a CLICK project

**[ClickNick](https://ssweber.github.io/clicknick/)** works beside CLICK Programming Software: nickname autocomplete, program checks, offline runs, and a readable text copy of every save. Changes go back in through CLICK's own paste.

[Start with ClickNick](https://ssweber.github.io/clicknick/){ .md-button .md-button--primary }
</div>
<div class="visitor-path" markdown>
## I want to write ladder as text

**[pyrung](https://ssweber.github.io/pyrung/)** is the Python DSL underneath. Write ladder in Python, test it scan by scan, and deploy to a CLICK PLC or the P1AM-200.

[Read the pyrung docs](https://ssweber.github.io/pyrung/){ .md-button }
</div>
</div>

Project family: [ClickNick](https://ssweber.github.io/clicknick/) · [pyrung](https://ssweber.github.io/pyrung/) · [laddercodec](https://ssweber.github.io/laddercodec/) · [pyclickplc](https://ssweber.github.io/pyclickplc/)

See [how the pieces fit](overview.md) or browse the [Blog](blog/index.md).
