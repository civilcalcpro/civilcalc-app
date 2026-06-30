"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  Ruler,
  RotateCcw,
  Copy,
  Printer,
  Info,
  CheckCircle,
  FileText,
} from "lucide-react";

const MM_PER_INCH = 25.4;

const calculationTypes = [
  {
    id: "standard",
    title: "Standard Hook",
    hindi: "स्टैंडर्ड हुक",
    desc: "Main bar / U hook calculation",
  },
  {
    id: "bend",
    title: "Bend Anchorage",
    hindi: "बेंड एंकरेज",
    desc: "45°, 90°, 135°, 180° bend value",
  },
  {
    id: "stirrup",
    title: "Stirrup / Tie Hook",
    hindi: "स्टिरप / टाई हुक",
    desc: "Stirrup hook extension calculation",
  },
  {
    id: "custom",
    title: "Custom Hook",
    hindi: "कस्टम हुक",
    desc: "Use custom multiplier like 9d, 10d, 12d",
  },
];

const hookOptions = {
  standard: [
    {
      id: "u180",
      title: "180° U Hook",
      hindi: "180° U हुक",
      formula: "16d",
      multiplier: 16,
      angle: "180°",
      diagram: "u",
      note: "Standard U type hook is commonly taken as 16 times bar diameter.",
    },
  ],

  bend: [
    {
      id: "bend45",
      title: "45° Bend",
      hindi: "45° मोड़",
      formula: "4d",
      multiplier: 4,
      angle: "45°",
      diagram: "45",
      note: "45° bend anchorage value is 4 times bar diameter.",
    },
    {
      id: "bend90",
      title: "90° Bend",
      hindi: "90° मोड़",
      formula: "8d",
      multiplier: 8,
      angle: "90°",
      diagram: "90",
      note: "90° bend is equivalent to two 45° bends, so value is 8d.",
    },
    {
      id: "bend135",
      title: "135° Bend",
      hindi: "135° मोड़",
      formula: "12d",
      multiplier: 12,
      angle: "135°",
      diagram: "135",
      note: "135° bend is equivalent to three 45° bends, so value is 12d.",
    },
    {
      id: "bend180",
      title: "180° Bend",
      hindi: "180° मोड़",
      formula: "16d",
      multiplier: 16,
      angle: "180°",
      diagram: "u",
      note: "180° bend value is generally taken as 16d.",
    },
  ],

  stirrup: [
    {
      id: "stirrup90",
      title: "90° Stirrup Hook",
      hindi: "90° स्टिरप हुक",
      formula: "8d",
      multiplier: 8,
      angle: "90°",
      diagram: "90",
      note: "Used for 90° stirrup hook extension.",
    },
    {
      id: "stirrup135",
      title: "135° Stirrup Hook",
      hindi: "135° स्टिरप हुक",
      formula: "6d",
      multiplier: 6,
      angle: "135°",
      diagram: "135",
      note: "Used for 135° stirrup hook extension.",
    },
    {
      id: "stirrup180",
      title: "180° Stirrup Hook",
      hindi: "180° स्टिरप हुक",
      formula: "4d",
      multiplier: 4,
      angle: "180°",
      diagram: "u",
      note: "Used for 180° stirrup hook extension.",
    },
    {
      id: "seismic135",
      title: "Seismic 135° Hook",
      hindi: "सीस्मिक 135° हुक",
      formula: "max(6d, 75 mm)",
      multiplier: 6,
      minMm: 75,
      angle: "135°",
      diagram: "135",
      note: "For ductile detailing, minimum 75 mm extension can be checked.",
    },
  ],

  custom: [
    {
      id: "custom",
      title: "Custom Hook Multiplier",
      hindi: "कस्टम हुक मल्टीप्लायर",
      formula: "Custom × d",
      multiplier: "custom",
      angle: "Custom",
      diagram: "custom",
      note: "Use this when drawing or consultant note gives custom hook length.",
    },
  ],
};

const metricDiameters = [6, 8, 10, 12, 16, 20, 25, 32, 40];
const imperialDiameters = [0.25, 0.375, 0.5, 0.625, 0.75, 1];

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function round(value, digits = 2) {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: digits,
  });
}

function formatLength(mm, unitSystem) {
  if (unitSystem === "imperial") {
    return `${round(mm / MM_PER_INCH, 2)} in`;
  }

  return `${round(mm, 1)} mm`;
}

function formatLengthSecondary(mm, unitSystem) {
  if (unitSystem === "imperial") {
    return `${round(mm / 304.8, 3)} ft`;
  }

  return `${round(mm / 1000, 3)} m`;
}

function HookDiagram({ result }) {
  if (!result) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-6 text-center">
        <div>
          <Ruler className="mx-auto mb-3 text-orange-400" size={42} />
          <p className="text-lg font-bold text-white">Diagram will appear here</p>
          <p className="mt-2 text-sm text-slate-400">
            Input भरो और Calculate button दबाओ
          </p>
        </div>
      </div>
    );
  }

  const { diagram, angle, diaLabel, hookLengthLabel, formula } = result;

  if (diagram === "u") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 440 280" className="h-[280px] w-full">
          <defs>
            <marker
              id="arrow-u"
              markerWidth="8"
              markerHeight="8"
              refX="4"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <path
            d="M110 70 L110 175 Q110 220 155 220 L285 220 Q330 220 330 175 L330 70"
            fill="none"
            stroke="#fb923c"
            strokeWidth="18"
            strokeLinecap="round"
          />

          <path
            d="M110 70 L110 175 Q110 220 155 220 L285 220 Q330 220 330 175 L330 70"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />

          <line
            x1="365"
            y1="70"
            x2="365"
            y2="220"
            stroke="#fb923c"
            strokeWidth="2"
            markerStart="url(#arrow-u)"
            markerEnd="url(#arrow-u)"
          />

          <text x="248" y="45" fill="#fdba74" fontSize="14" fontWeight="700">
            {angle} Hook
          </text>
          <text x="375" y="150" fill="#fdba74" fontSize="13" fontWeight="700">
            {hookLengthLabel}
          </text>
          <text x="125" y="252" fill="#cbd5e1" fontSize="13" fontWeight="600">
            {diaLabel}
          </text>
          <text x="230" y="252" fill="#cbd5e1" fontSize="13" fontWeight="600">
            Formula = {formula}
          </text>
        </svg>
      </div>
    );
  }

  if (diagram === "90") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 440 280" className="h-[280px] w-full">
          <defs>
            <marker
              id="arrow-90"
              markerWidth="8"
              markerHeight="8"
              refX="4"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <path
            d="M80 210 L275 210 Q320 210 320 165 L320 70"
            fill="none"
            stroke="#fb923c"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M80 210 L275 210 Q320 210 320 165 L320 70"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />

          <path
            d="M280 210 A40 40 0 0 0 320 170"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
          />

          <line
            x1="355"
            y1="70"
            x2="355"
            y2="210"
            stroke="#fb923c"
            strokeWidth="2"
            markerStart="url(#arrow-90)"
            markerEnd="url(#arrow-90)"
          />

          <text x="288" y="155" fill="#e0f2fe" fontSize="13" fontWeight="700">
            90°
          </text>
          <text x="365" y="145" fill="#fdba74" fontSize="13" fontWeight="700">
            {hookLengthLabel}
          </text>
          <text x="90" y="242" fill="#cbd5e1" fontSize="13" fontWeight="600">
            {diaLabel}
          </text>
          <text x="220" y="242" fill="#cbd5e1" fontSize="13" fontWeight="600">
            Formula = {formula}
          </text>
        </svg>
      </div>
    );
  }

  if (diagram === "135") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 440 280" className="h-[280px] w-full">
          <defs>
            <marker
              id="arrow-135"
              markerWidth="8"
              markerHeight="8"
              refX="4"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <path
            d="M75 210 L255 210 Q295 210 315 175 L360 95"
            fill="none"
            stroke="#fb923c"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M75 210 L255 210 Q295 210 315 175 L360 95"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />

          <line
            x1="372"
            y1="92"
            x2="305"
            y2="195"
            stroke="#fb923c"
            strokeWidth="2"
            markerStart="url(#arrow-135)"
            markerEnd="url(#arrow-135)"
          />

          <text x="292" y="155" fill="#e0f2fe" fontSize="13" fontWeight="700">
            135°
          </text>
          <text x="350" y="158" fill="#fdba74" fontSize="13" fontWeight="700">
            {hookLengthLabel}
          </text>
          <text x="90" y="242" fill="#cbd5e1" fontSize="13" fontWeight="600">
            {diaLabel}
          </text>
          <text x="220" y="242" fill="#cbd5e1" fontSize="13" fontWeight="600">
            Formula = {formula}
          </text>
        </svg>
      </div>
    );
  }

  if (diagram === "45") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 440 280" className="h-[280px] w-full">
          <defs>
            <marker
              id="arrow-45"
              markerWidth="8"
              markerHeight="8"
              refX="4"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <path
            d="M75 210 L270 210 Q300 210 322 188 L370 140"
            fill="none"
            stroke="#fb923c"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M75 210 L270 210 Q300 210 322 188 L370 140"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />

          <line
            x1="380"
            y1="132"
            x2="315"
            y2="198"
            stroke="#fb923c"
            strokeWidth="2"
            markerStart="url(#arrow-45)"
            markerEnd="url(#arrow-45)"
          />

          <text x="302" y="178" fill="#e0f2fe" fontSize="13" fontWeight="700">
            45°
          </text>
          <text x="352" y="182" fill="#fdba74" fontSize="13" fontWeight="700">
            {hookLengthLabel}
          </text>
          <text x="90" y="242" fill="#cbd5e1" fontSize="13" fontWeight="600">
            {diaLabel}
          </text>
          <text x="220" y="242" fill="#cbd5e1" fontSize="13" fontWeight="600">
            Formula = {formula}
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <svg viewBox="0 0 440 280" className="h-[280px] w-full">
        <defs>
          <marker
            id="arrow-custom"
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
          </marker>
        </defs>

        <path
          d="M70 205 L255 205 Q300 205 325 170 L365 110"
          fill="none"
          stroke="#fb923c"
          strokeWidth="18"
          strokeLinecap="round"
        />

        <path
          d="M70 205 L255 205 Q300 205 325 170 L365 110"
          fill="none"
          stroke="#fed7aa"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
        />

        <line
          x1="374"
          y1="105"
          x2="310"
          y2="190"
          stroke="#fb923c"
          strokeWidth="2"
          markerStart="url(#arrow-custom)"
          markerEnd="url(#arrow-custom)"
        />

        <text x="335" y="160" fill="#fdba74" fontSize="13" fontWeight="700">
          {hookLengthLabel}
        </text>
        <text x="90" y="242" fill="#cbd5e1" fontSize="13" fontWeight="600">
          {diaLabel}
        </text>
        <text x="220" y="242" fill="#cbd5e1" fontSize="13" fontWeight="600">
          Formula = {formula}
        </text>
      </svg>
    </div>
  );
}

export default function HookLengthCalculatorPage() {
  const [unitSystem, setUnitSystem] = useState("metric");
  const [calculationType, setCalculationType] = useState("standard");
  const [hookType, setHookType] = useState("u180");

  const [barDia, setBarDia] = useState("12");
  const [hooksPerBar, setHooksPerBar] = useState("2");
  const [numberOfBars, setNumberOfBars] = useState("1");
  const [steelRate, setSteelRate] = useState("60");
  const [customMultiplier, setCustomMultiplier] = useState("9");

  const [barMark, setBarMark] = useState("");
  const [memberName, setMemberName] = useState("");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const availableHookOptions = useMemo(() => {
    return hookOptions[calculationType] || hookOptions.standard;
  }, [calculationType]);

  const selectedHook =
    availableHookOptions.find((item) => item.id === hookType) ||
    availableHookOptions[0];

  function clearResult() {
    setResult(null);
    setError("");
    setCopied(false);
  }

  function handleCalculationTypeChange(type) {
    setCalculationType(type);
    const firstOption = hookOptions[type][0];
    setHookType(firstOption.id);
    clearResult();
  }

  function handleUnitChange(unit) {
    setUnitSystem(unit);
    setBarDia(unit === "metric" ? "12" : "0.5");
    clearResult();
  }

  function calculateHookLength() {
    setError("");
    setCopied(false);

    const inputDia = toNumber(barDia);
    const hooks = toNumber(hooksPerBar);
    const bars = toNumber(numberOfBars);
    const rate = toNumber(steelRate);
    const custom = toNumber(customMultiplier);

    if (inputDia <= 0) {
      setError("Please enter valid bar diameter.");
      setResult(null);
      return;
    }

    if (hooks <= 0) {
      setError("Please enter valid hooks per bar.");
      setResult(null);
      return;
    }

    if (bars <= 0) {
      setError("Please enter valid number of bars.");
      setResult(null);
      return;
    }

    const diaMm = unitSystem === "metric" ? inputDia : inputDia * MM_PER_INCH;

    const multiplier =
      selectedHook.multiplier === "custom" ? custom : selectedHook.multiplier;

    if (multiplier <= 0) {
      setError("Please enter valid custom multiplier.");
      setResult(null);
      return;
    }

    const baseHookLengthMm = multiplier * diaMm;
    const minMm = selectedHook.minMm || 0;
    const hookLengthPerHookMm = Math.max(baseHookLengthMm, minMm);

    const hookLengthPerBarMm = hookLengthPerHookMm * hooks;
    const totalHookLengthMm = hookLengthPerBarMm * bars;
    const totalHookLengthM = totalHookLengthMm / 1000;

    const unitWeightKgPerM = (diaMm * diaMm) / 162;
    const extraSteelWeightKg = unitWeightKgPerM * totalHookLengthM;
    const approxCost = extraSteelWeightKg * rate;

    const finalResult = {
      unitSystem,
      calculationType,
      hookTitle: selectedHook.title,
      hookHindi: selectedHook.hindi,
      angle: selectedHook.angle,
      formula: selectedHook.formula,
      diagram: selectedHook.diagram,
      note: selectedHook.note,

      inputDia,
      diaMm,
      multiplier,
      hooks,
      bars,
      rate,
      barMark,
      memberName,

      baseHookLengthMm,
      minMm,
      hookLengthPerHookMm,
      hookLengthPerBarMm,
      totalHookLengthMm,
      totalHookLengthM,
      unitWeightKgPerM,
      extraSteelWeightKg,
      approxCost,

      diaLabel:
        unitSystem === "metric"
          ? `d = ${round(diaMm, 1)} mm`
          : `d = ${round(inputDia, 3)} in`,
      hookLengthLabel: `Hook = ${formatLength(
        hookLengthPerHookMm,
        unitSystem
      )}`,
    };

    setResult(finalResult);
  }

  function resetCalculator() {
    setUnitSystem("metric");
    setCalculationType("standard");
    setHookType("u180");
    setBarDia("12");
    setHooksPerBar("2");
    setNumberOfBars("1");
    setSteelRate("60");
    setCustomMultiplier("9");
    setBarMark("");
    setMemberName("");
    setResult(null);
    setError("");
    setCopied(false);
  }

  async function copyResult() {
    if (!result) return;

    const text = `CivilCalc Pro - Hook Length Calculator

Bar Mark: ${result.barMark || "-"}
Member Name: ${result.memberName || "-"}
Calculation Type: ${result.calculationType}
Hook Type: ${result.hookTitle}
Formula: ${result.formula}
Bar Diameter: ${round(result.diaMm, 2)} mm
Multiplier: ${round(result.multiplier, 2)}d
Hooks per Bar: ${round(result.hooks, 0)}
Number of Bars: ${round(result.bars, 0)}

Hook Length per Hook: ${round(result.hookLengthPerHookMm, 2)} mm
Hook Length per Bar: ${round(result.hookLengthPerBarMm, 2)} mm
Total Hook Length: ${round(result.totalHookLengthMm, 2)} mm = ${round(
      result.totalHookLengthM,
      3
    )} m
Extra Steel Weight: ${round(result.extraSteelWeightKg, 3)} kg
Approx Steel Cost: ₹${round(result.approxCost, 2)}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const quickDiameters =
    unitSystem === "metric" ? metricDiameters : imperialDiameters;

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-2xl md:p-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300">
                <Ruler size={16} />
                Steel / BBS Calculator
              </div>

              <h1 className="text-3xl font-black tracking-tight md:text-5xl">
                Hook Length Calculator
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                Calculate reinforcement hook length, bend anchorage, stirrup
                hook extension, total hook length, extra steel weight and
                approximate steel cost.
              </p>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                Bar diameter, hook type और bars quantity डालकर Calculate button
                दबाओ। Result के साथ diagram और step-by-step solution मिलेगा।
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
              <div className="flex items-center gap-3">
                <Calculator className="text-orange-400" size={34} />
                <div>
                  <h2 className="text-xl font-bold">Professional Output</h2>
                  <p className="text-sm text-slate-400">
                    Formula + diagram + quantity + steel weight
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-900 p-4">
                  <p className="text-slate-400">Default</p>
                  <p className="mt-1 text-2xl font-black text-orange-400">
                    16d
                  </p>
                </div>
                <div className="rounded-xl bg-slate-900 p-4">
                  <p className="text-slate-400">Unit</p>
                  <p className="mt-1 text-2xl font-black text-orange-400">
                    mm / in
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 md:p-6">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">Input Details</h2>
                <p className="text-sm text-slate-400">
                  पहले input भरो, फिर calculate button दबाओ
                </p>
              </div>

              <button
                onClick={resetCalculator}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-orange-400 hover:text-orange-300"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Unit System / यूनिट सिस्टम
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleUnitChange("metric")}
                    className={`rounded-xl border p-4 text-left transition ${
                      unitSystem === "metric"
                        ? "border-orange-400 bg-orange-500/15 text-orange-200"
                        : "border-slate-700 bg-slate-950 text-slate-300"
                    }`}
                  >
                    <p className="font-bold">Metric</p>
                    <p className="text-xs text-slate-400">mm, m, kg</p>
                  </button>

                  <button
                    onClick={() => handleUnitChange("imperial")}
                    className={`rounded-xl border p-4 text-left transition ${
                      unitSystem === "imperial"
                        ? "border-orange-400 bg-orange-500/15 text-orange-200"
                        : "border-slate-700 bg-slate-950 text-slate-300"
                    }`}
                  >
                    <p className="font-bold">Imperial</p>
                    <p className="text-xs text-slate-400">inch, ft</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  What do you want to calculate?
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  {calculationTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleCalculationTypeChange(type.id)}
                      className={`rounded-xl border p-4 text-left transition ${
                        calculationType === type.id
                          ? "border-orange-400 bg-orange-500/15"
                          : "border-slate-700 bg-slate-950 hover:border-slate-500"
                      }`}
                    >
                      <p className="font-bold text-white">{type.title}</p>
                      <p className="text-xs text-orange-200">{type.hindi}</p>
                      <p className="mt-1 text-xs text-slate-400">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Hook / Bend Type
                </label>

                <select
                  value={hookType}
                  onChange={(e) => {
                    setHookType(e.target.value);
                    clearResult();
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                >
                  {availableHookOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} — {item.formula}
                    </option>
                  ))}
                </select>

                <div className="mt-3 rounded-xl border border-orange-500/20 bg-orange-500/10 p-4 text-sm leading-6 text-orange-100">
                  <strong>{selectedHook.title}:</strong> {selectedHook.note}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Bar Diameter / Bar Dia{" "}
                  {unitSystem === "metric" ? "(mm)" : "(inch)"}
                </label>

                <input
                  type="number"
                  min="0"
                  step={unitSystem === "metric" ? "1" : "0.001"}
                  value={barDia}
                  onChange={(e) => {
                    setBarDia(e.target.value);
                    clearResult();
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                  placeholder={unitSystem === "metric" ? "Example: 12" : "Example: 0.5"}
                />

                <div className="mt-3 flex flex-wrap gap-2">
                  {quickDiameters.map((dia) => (
                    <button
                      key={dia}
                      onClick={() => {
                        setBarDia(String(dia));
                        clearResult();
                      }}
                      className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-orange-400 hover:text-orange-300"
                    >
                      {unitSystem === "metric" ? `${dia} mm` : `${dia} in`}
                    </button>
                  ))}
                </div>
              </div>

              {calculationType === "custom" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Custom Multiplier
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={customMultiplier}
                    onChange={(e) => {
                      setCustomMultiplier(e.target.value);
                      clearResult();
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    placeholder="Example: 9"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Example: 9 means hook length = 9d
                  </p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Hooks per Bar / प्रति बार हुक
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={hooksPerBar}
                    onChange={(e) => {
                      setHooksPerBar(e.target.value);
                      clearResult();
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    placeholder="Example: 2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Number of Bars / Bars Qty
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={numberOfBars}
                    onChange={(e) => {
                      setNumberOfBars(e.target.value);
                      clearResult();
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    placeholder="Example: 10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Steel Rate ₹/kg, optional
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={steelRate}
                  onChange={(e) => {
                    setSteelRate(e.target.value);
                    clearResult();
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                  placeholder="Example: 60"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Bar Mark, optional
                  </label>

                  <input
                    type="text"
                    value={barMark}
                    onChange={(e) => {
                      setBarMark(e.target.value);
                      clearResult();
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    placeholder="Example: B1, S1"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Member Name, optional
                  </label>

                  <input
                    type="text"
                    value={memberName}
                    onChange={(e) => {
                      setMemberName(e.target.value);
                      clearResult();
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    placeholder="Example: Beam, Column Stirrup"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-200">
                  {error}
                </div>
              )}

              <button
                onClick={calculateHookLength}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 px-5 py-4 text-lg font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              >
                <Calculator size={22} />
                Calculate Hook Length
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Hook Diagram</h2>
                  <p className="text-sm text-slate-400">
                    Diagram calculate ke baad selected hook ke hisab se show hoga
                  </p>
                </div>

                <FileText className="text-orange-400" size={28} />
              </div>

              <HookDiagram result={result} />
            </div>

            {result && (
              <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-slate-900 p-5 md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <CheckCircle className="text-orange-300" size={28} />
                  <div>
                    <h2 className="text-2xl font-black">Calculation Result</h2>
                    <p className="text-sm text-slate-400">
                      Hook length output after calculation
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Hook Length per Hook</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      {formatLength(result.hookLengthPerHookMm, result.unitSystem)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {formatLengthSecondary(
                        result.hookLengthPerHookMm,
                        result.unitSystem
                      )}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Hook Length per Bar</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      {formatLength(result.hookLengthPerBarMm, result.unitSystem)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {formatLengthSecondary(
                        result.hookLengthPerBarMm,
                        result.unitSystem
                      )}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Total Hook Length</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      {formatLength(result.totalHookLengthMm, result.unitSystem)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {formatLengthSecondary(
                        result.totalHookLengthMm,
                        result.unitSystem
                      )}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Extra Steel Weight</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      {round(result.extraSteelWeightKg, 3)} kg
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Unit wt = D²/162 = {round(result.unitWeightKgPerM, 3)} kg/m
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5 sm:col-span-2">
                    <p className="text-sm text-slate-400">Approx. Hook Steel Cost</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      ₹{round(result.approxCost, 2)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Based on ₹{round(result.rate, 2)}/kg steel rate
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
                  <h3 className="text-lg font-black text-orange-200">
                    Formula Used
                  </h3>

                  <div className="mt-3 space-y-2 text-sm leading-7 text-orange-50">
                    <p>Hook Length = Multiplier × Bar Diameter</p>
                    <p>
                      Total Hook Length = Hook Length × Hooks per Bar × Number of
                      Bars
                    </p>
                    <p>Steel Weight = D² / 162 × Total Length</p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                  <h3 className="mb-4 text-lg font-black">
                    Step-by-step Solution
                  </h3>

                  <div className="space-y-3 text-sm leading-7 text-slate-300">
                    <p>
                      <span className="font-bold text-white">Step 1:</span> Bar
                      diameter, d = {round(result.diaMm, 2)} mm
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 2:</span> Hook
                      type = {result.hookTitle}
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 3:</span> Formula
                      ={" "}
                      <span className="font-bold text-orange-300">
                        {result.formula}
                      </span>
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 4:</span> Hook
                      length per hook = {round(result.multiplier, 2)} ×{" "}
                      {round(result.diaMm, 2)} ={" "}
                      {round(result.baseHookLengthMm, 2)} mm
                    </p>

                    {result.minMm > 0 && (
                      <p>
                        <span className="font-bold text-white">Step 5:</span>{" "}
                        Minimum limit = {result.minMm} mm. Final hook length per
                        hook = {round(result.hookLengthPerHookMm, 2)} mm
                      </p>
                    )}

                    <p>
                      <span className="font-bold text-white">
                        Step {result.minMm > 0 ? "6" : "5"}:
                      </span>{" "}
                      Hook length per bar ={" "}
                      {round(result.hookLengthPerHookMm, 2)} ×{" "}
                      {round(result.hooks, 0)} ={" "}
                      {round(result.hookLengthPerBarMm, 2)} mm
                    </p>

                    <p>
                      <span className="font-bold text-white">
                        Step {result.minMm > 0 ? "7" : "6"}:
                      </span>{" "}
                      Total hook length ={" "}
                      {round(result.hookLengthPerBarMm, 2)} ×{" "}
                      {round(result.bars, 0)} ={" "}
                      <span className="font-bold text-orange-300">
                        {round(result.totalHookLengthMm, 2)} mm ={" "}
                        {round(result.totalHookLengthM, 3)} m
                      </span>
                    </p>

                    <p>
                      <span className="font-bold text-white">
                        Step {result.minMm > 0 ? "8" : "7"}:
                      </span>{" "}
                      Steel weight = D² / 162 × total length ={" "}
                      {round(result.diaMm, 2)}² / 162 ×{" "}
                      {round(result.totalHookLengthM, 3)} ={" "}
                      <span className="font-bold text-orange-300">
                        {round(result.extraSteelWeightKg, 3)} kg
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={copyResult}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600"
                  >
                    <Copy size={18} />
                    {copied ? "Copied" : "Copy Result"}
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-200 hover:border-orange-400 hover:text-orange-300"
                  >
                    <Printer size={18} />
                    Print / Save PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-3 flex items-center gap-2 text-orange-300">
              <Info size={20} />
              <h3 className="font-bold">Where to Use?</h3>
            </div>

            <p className="text-sm leading-7 text-slate-300">
              Hook length is used in BBS, beam bars, slab bars, footing bars,
              column ties, stirrups and reinforcement anchorage detailing.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-3 flex items-center gap-2 text-orange-300">
              <Info size={20} />
              <h3 className="font-bold">Hindi Explanation</h3>
            </div>

            <p className="text-sm leading-7 text-slate-300">
              Hook length bar के end पर extra length होती है जिससे bar concrete
              में properly anchor हो सके और slip न करे।
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-3 flex items-center gap-2 text-orange-300">
              <Info size={20} />
              <h3 className="font-bold">Engineering Note</h3>
            </div>

            <p className="text-sm leading-7 text-slate-300">
              Final detailing should always be checked with project drawings,
              structural consultant notes and site conditions.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
