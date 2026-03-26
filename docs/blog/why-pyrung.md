# Why pyrung? A look at what else is out there

## The big vendors have simulators. Click doesn't.

Siemens has S7-PLCSIM. Allen-Bradley has the RSLogix Emulator. Beckhoff has TwinCAT's simulation manager. CODESYS has a built-in simulation mode and a paid Test Manager add-on. Even within AutomationDirect's own lineup, the Do-more and Productivity PLCs have software simulators built into their free programming tools.

The Click PLC has none. AutomationDirect sells physical input simulator modules, toggle switches and potentiometer boards, but no software simulation. You write ladder in Click Programming Software, download to hardware, and test it there. If you don't have the hardware, you wait.

## An emerging trend: people want more than GUI-only PLC programming

For decades, PLC programming has meant vendor-specific graphical IDEs. You draw ladder in the vendor's editor, download to hardware, and hope. That's starting to change.

For Structured Text, the vendor story is already meaningful. CODESYS has simulation, a Test Manager, Python scripting, and a unit testing framework (CoUnit). Beckhoff TwinCAT gives ST developers full Visual Studio integration with unit testing via TcUnit. Running a CODESYS soft PLC and driving tests from pytest over OPC-UA is an emerging pattern, though it amounts to integration testing against a running process rather than deterministic simulation of the logic itself. If your world is ST on those platforms, you're reasonably well served.

Beyond the vendor ecosystems, independent projects are pushing further. [rungs.dev](https://rungs.dev/) is a browser-based ladder logic and ST editor with real-time simulation and an integrated test runner with deterministic, isolated scan cycles. It targets Allen-Bradley style (XIC/XIO/OTE, Add-On Instructions) and is the closest thing in spirit to pyrung's test-first philosophy, arriving from a completely different direction.

Open-source PLC platforms like **OpenPLC** and **Beremiz** are full IEC 61131-3 environments with graphical editors, simulation modes, and multiple target hardware platforms. They're serious engineering, but they're PLC *replacements*, not test-first development tools for an existing vendor's hardware.

## The ladder-as-text problem

The pattern across all of this is clear: **people who want text go to Structured Text, and people who want ladder stay graphical.** The IEC standard positions ST as the text-based option. The CODESYS/Beckhoff ecosystem is investing heavily in that direction.

But ladder remains the dominant language in North American discrete manufacturing, especially on platforms like Click, Do-more, and Allen-Bradley. Those users are stuck in proprietary graphical editors with no version control, no automated testing, and often no simulation. The ST crowd has options. The ladder crowd doesn't.

The few Python projects that have tried to represent ladder, [pyladdersim](https://github.com/akshatnerella/pyladdersim) being the most visible, model rungs as flat lists of component objects:

```python
rung = Rung([Contact("Start"), InvertedContact("Stop"), Output("Lamp")])
```

The structure that makes ladder readable is lost. The idea of a proper text-based ladder with testability has been [floating around since at least 2000](https://mail.python.org/pipermail/python-list/2000-March/049350.html), but nobody shipped it. A CODESYS Forge user [asked for ladder scripting in Python in 2017](https://forge.codesys.com/forge/talk/Engineering/thread/fdc3d03c95/); the answer was "You can't do Ladder with Scripting."

## What pyrung does differently

```python
with Program() as logic:
    with Rung(Start, ~Stop):
        out(Motor)
    with Rung(Fault):
        reset(Motor)
```

Condition on the rail, instruction in the body. The `with` block naturally separates "when this is true" from "do this," which is exactly what a ladder rung does. It reads like the diagram, runs as a deterministic scan cycle, and targets real Click PLC behavior faithfully.

**The code looks like ladder.** Not Structured Text. Not flat lists. Not ASCII art. The DSL preserves the condition/instruction structure that makes ladder readable, in code a controls engineer can map to the diagram they already know.

**You can watch it evaluate.** A full DAP-protocol VS Code debugger steps through scans rung by rung. Breakpoints on rungs, inline tag updates, force values, diff between scans, time-travel through history.

**It targets real hardware faithfully.** Nearly the complete Click instruction set, memory banks, numeric quirks, scan-cycle semantics. If your program behaves differently in pyrung than on a Click PLC, that's a bug.

**It deploys without transposing.** pyrung compiles to two backends from the same tested source. For Click, [laddercodec](https://github.com/ssweber/laddercodec) encodes your rungs into the bytes the CLICK editor expects on paste. For the ProductivityOpen P1AM-200, pyrung generates a self-contained CircuitPython scan loop that runs directly on the hardware with the same Modbus TCP interface as a Click. Write once, test once, deploy to either.

## Where pyrung fits

The emerging tools above are vendor-agnostic by design. rungs.dev runs in a browser. OpenPLC replaces the vendor stack entirely.

pyrung chose fidelity over generality, because the whole point is to test before you deploy to a specific PLC. But fidelity to Click behavior doesn't mean fidelity to Click hardware alone. The same logic that simulates faithfully against Click's instruction set can also compile to CircuitPython and run on open hardware with no proprietary toolchain in the path. That combination, faithful simulation of a real vendor's behavior plus deployment to hardware the vendor doesn't control, is something none of the tools above attempt.

The ladder-as-text problem has been open for 25 years. pyrung is a serious attempt at closing it.
