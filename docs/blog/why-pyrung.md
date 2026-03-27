# Why pyrung? A look at what else is out there

## An emerging trend: people want more than GUI-only PLC programming

For decades, PLC programming has meant vendor-specific graphical IDEs. You draw ladder in the vendor's editor, download to hardware, and hope. That's starting to change.

For Structured Text, the tooling is already meaningful. The IEC standard positions ST as the text-based option, and the CODESYS/Beckhoff ecosystem is investing heavily in that direction. Both offer simulation, unit testing frameworks, and Python scripting integration. If your world is ST on those platforms, you're reasonably well served.

Beyond the vendor ecosystems, independent projects are pushing further. [rungs.dev](https://rungs.dev/) is a browser-based ladder logic editor with real-time simulation and an integrated test runner. Open-source PLC platforms like **OpenPLC** and **Beremiz** are full IEC 61131-3 environments, but they're PLC *replacements*, not test-first development tools for an existing vendor's hardware.

## The ladder-as-text problem

Ladder is still a dominant force in North American manufacturing, preferred for its visual clarity and the fact that an electrician can troubleshoot it on the floor without a programming background. But those users have limited version control ([Copia](https://www.copia.io/) is changing that), no automated testing, often no simulation, and are stuck in GUI editors.

Text representations of ladder have existed for decades. Allen-Bradley has IL on the clipboard and Neutral Text for import/export. Do-more has undocumented mnemonic paste. Siemens has STL/AWL files. Those aren't text you actually design with. Let's talk about it.

Two examples: a seal-in circuit (Start OR Motor, AND NOT Stop, energize Motor) and a branching comparison (temperature above 100 OR pressure above 50).

**IEC Instruction List** (stack-based):
```
LD    Start
OR    Motor
ANDN  Stop
ST    Motor

LD    Temp
GT    100
OR(
LD    Pressure
GT    50
)
ST    Alarm
```

**Rockwell Neutral Text** (delimiter-based):
```
SOR BST XIC Start NXB XIC Motor BND XIO Stop OTE Motor EOR
SOR BST GRT Temp 100 NXB GRT Pressure 50 BND OTE Alarm EOR
```

**pyladdersim** (flat list):
```python
rung = Rung([Contact("Start"), InvertedContact("Stop"), Output("Lamp")])
```

The structure that makes ladder readable is lost in all of these. The idea of a proper text-based ladder with testability has been [floating around since at least 2000](https://mail.python.org/pipermail/python-list/2000-March/049350.html), but nobody shipped it. A CODESYS Forge user [asked for ladder scripting in Python in 2017](https://forge.codesys.com/forge/talk/Engineering/thread/fdc3d03c95/); the answer was "You can't do Ladder with Scripting."

## What pyrung does differently

The same two examples:

```python
with Rung(Start | Motor, ~Stop):
    out(Motor)

with Rung(any_of(Temp > 100, Pressure > 50)):
    latch(Alarm)
```

Condition on the rail, instruction in the body. The `with` block naturally separates "when this is true" from "do this," which is exactly what a ladder rung does. It reads like the diagram, runs as a deterministic scan cycle, and targets real Click PLC behavior faithfully.

**The code looks like ladder,** not ASCII art. The DSL preserves the condition/instruction structure that makes ladder readable, in code a controls engineer can map to the diagram they already know.

**You can watch it evaluate.** A full DAP-protocol VS Code debugger steps through scans rung by rung. Breakpoints on rungs, inline tag updates, force values, diff between scans, time-travel through history.

**It targets real hardware faithfully.** Nearly the complete Click instruction set, memory banks, numeric quirks, scan-cycle semantics. If your program behaves differently in pyrung than on a Click PLC, that's a bug.

**It deploys without transposing.** pyrung compiles to two backends from the same tested source. For Click, [laddercodec](https://github.com/ssweber/laddercodec) encodes your rungs into the bytes the CLICK editor expects on paste. For the ProductivityOpen P1AM-200, pyrung generates a self-contained CircuitPython scan loop that runs directly on the hardware with the same Modbus TCP interface as a Click. Write once, test once, deploy to either.

## Where pyrung fits

The emerging tools above are vendor-agnostic by design. rungs.dev runs in a browser. OpenPLC replaces the vendor stack entirely.

pyrung chose fidelity over generality, because the whole point is to test before you deploy to a specific PLC. But the deeper point is what happens when ladder becomes text. Your logic lives in `.py` files. You check it into git. You write pytest cases that assert behavior across scan cycles. You step through rungs in VS Code with breakpoints, watch windows, and time-travel debugging. You catch the off-by-one in a counter before it ever reaches a panel.

None of that requires abandoning ladder for Structured Text. That's the trade-off the industry has assumed for 25 years: if you want modern tooling, switch languages. pyrung refuses the trade-off. The ladder-as-text problem has been open since at least 2000. pyrung is a serious attempt at closing it.
