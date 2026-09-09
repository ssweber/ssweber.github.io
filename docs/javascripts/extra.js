(function () {
  "use strict";

  var timing = {
    firstScan: 1200,
    conditionResult: 400,
    bodyResult: 600,
    holdBody: 1200,
    nextRung: 200,
    nextScan: 1400,
  };

  var demoStates = [
    {
      name: "start",
      motorBefore: "OFF",
      motorAfter: "ON",
      rungs: [
        { name: "set", condition: "True", body: "Motor ON", pass: true, motorAfter: "ON" },
        { name: "reset", condition: "False", body: "skipped", pass: false },
      ],
    },
    {
      name: "latched",
      motorBefore: "ON",
      motorAfter: "ON",
      rungs: [
        { name: "set", condition: "False", body: "skipped", pass: false },
        { name: "reset", condition: "False", body: "skipped", pass: false },
      ],
    },
    {
      name: "stop",
      motorBefore: "ON",
      motorAfter: "OFF",
      rungs: [
        { name: "set", condition: "False", body: "skipped", pass: false },
        { name: "reset", condition: "True", body: "Motor OFF", pass: true, motorAfter: "OFF" },
      ],
    },
  ];

  function initializeLadderDemo(demo) {
    if (demo.dataset.plInitialized === "true") return;

    var motor = demo.querySelector("[data-motor-label]");
    var conditions = demo.querySelectorAll("[data-pl-condition-note]");
    var bodies = demo.querySelectorAll("[data-pl-body-note]");
    if (!motor || conditions.length !== 2 || bodies.length !== 2) return;
    demo.dataset.plInitialized = "true";

    function setMotor(value) {
      motor.textContent = value;
      demo.dataset.motorState = value.toLowerCase();
    }

    function clearActiveRung() {
      delete demo.dataset.activeRung;
      delete demo.dataset.activePass;
      delete demo.dataset.activeStep;
    }

    function renderScan(scan) {
      demo.dataset.state = scan.name;
      setMotor(scan.motorBefore);
      scan.rungs.forEach(function (rung, index) {
        conditions[index].textContent = rung.condition;
        bodies[index].textContent = rung.body;
      });
      clearActiveRung();
    }

    function renderStatic(scan) {
      renderScan(scan);
      setMotor(scan.motorAfter);
      demo.dataset.motion = "reduced";
    }

    var reducedMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      renderStatic(demoStates[1]);
      return;
    }

    var scanIndex = 0;

    function runRung(scan, rungIndex, done) {
      if (!document.body.contains(demo)) return;

      var rung = scan.rungs[rungIndex];
      demo.dataset.activeRung = rung.name;
      demo.dataset.activePass = rung.pass ? "true" : "false";
      demo.dataset.activeStep = "condition";

      window.setTimeout(function () {
        if (!document.body.contains(demo)) return;
        demo.dataset.activeStep = "condition-result";

        window.setTimeout(function () {
          if (!document.body.contains(demo)) return;
          demo.dataset.activeStep = "body";
          if (rung.motorAfter) {
            setMotor(rung.motorAfter);
                }

          window.setTimeout(function () {
            if (!document.body.contains(demo)) return;
            clearActiveRung();
            window.setTimeout(done, timing.nextRung);
          }, timing.holdBody);
        }, timing.bodyResult);
      }, timing.conditionResult);
    }

    function runScan() {
      if (!document.body.contains(demo)) return;

      var scan = demoStates[scanIndex];
      renderScan(scan);

      function advanceRung(rungIndex) {
        if (rungIndex < scan.rungs.length) {
          runRung(scan, rungIndex, function () {
            advanceRung(rungIndex + 1);
          });
          return;
        }

          setMotor(scan.motorAfter);
        scanIndex += 1;
        if (scanIndex === demoStates.length) scanIndex = 0;
        window.setTimeout(runScan, timing.nextScan);
      }

      advanceRung(0);
    }

    renderStatic(demoStates[1]);
    delete demo.dataset.motion;
    window.setTimeout(runScan, timing.firstScan);
  }

  function initialize(root) {
    var scope = root || document;
    scope.querySelectorAll("[data-pl-demo]").forEach(initializeLadderDemo);
  }

  if (typeof document$ !== "undefined") {
    document$.subscribe(function () {
      initialize(document);
    });
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initialize(document);
    });
  } else {
    initialize(document);
  }
})();
