(function () {
  "use strict";

  var timing = {
    firstScan: 700,
    conditionResult: 300,
    bodyResult: 500,
    holdBody: 900,
    nextRung: 350,
    nextScan: 500,
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

    function setRungEvaluation(rung, step) {
      demo.querySelectorAll(
        '[data-code-rung="' + rung.name + '"], [data-ladder-rung="' + rung.name + '"]'
      ).forEach(function (element) {
        element.dataset.evaluation = step;
        element.dataset.pass = rung.pass ? "true" : "false";
      });
    }

    function renderScan(scan) {
      demo.dataset.state = scan.name;
      setMotor(scan.motorBefore);
      scan.rungs.forEach(function (rung, index) {
        conditions[index].textContent = rung.condition;
        bodies[index].textContent = rung.body;
      });
      demo.querySelectorAll("[data-evaluation]").forEach(function (element) {
        delete element.dataset.evaluation;
        delete element.dataset.pass;
      });
    }

    function renderStatic(scan) {
      renderScan(scan);
      scan.rungs.forEach(function (rung) {
        setRungEvaluation(rung, "body");
      });
      setMotor(scan.motorAfter);
      demo.dataset.motion = "reduced";
    }

    var reducedMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      renderStatic(demoStates[0]);
      return;
    }

    var scanIndex = 0;

    function runRung(scan, rungIndex, done) {
      if (!document.body.contains(demo)) return;

      var rung = scan.rungs[rungIndex];
      setRungEvaluation(rung, "condition");

      window.setTimeout(function () {
        if (!document.body.contains(demo)) return;
        setRungEvaluation(rung, "condition-result");

        window.setTimeout(function () {
          if (!document.body.contains(demo)) return;
          setRungEvaluation(rung, "body");
          if (rung.motorAfter) {
            setMotor(rung.motorAfter);
          }

          window.setTimeout(function () {
            if (!document.body.contains(demo)) return;
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

    renderScan(demoStates[0]);
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
