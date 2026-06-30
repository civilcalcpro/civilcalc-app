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
  ShieldCheck,
} from "lucide-react";

const MM_PER_INCH = 25.4;

const angleOptions = [
  {
    id: "45",
    title: "45° Bend",
    hindi: "45° मोड़",
    angle: 45,
    standardMultiplier: 1,
    formula: "1d",
    diagram: "45",
    note: "Common BBS bend deduction for 45° bend is taken as 1d.",
  },
  {
    id: "90",
    title: "90° Bend",
    hindi: "90° मोड़",
    angle: 90,
    standardMultiplier: 2,
    formula: "2d",
    diagram: "90",
    note: "Common BBS bend deduction for 90° bend is taken as 2d.",
  },
  {
    id: "135",
    title: "135° Bend",
    hindi: "135° मोड़",
    angle: 135,
    standardMultiplier: 3,
    formula: "3d",
    diagram: "135",
    note: "Common BBS bend deduction for 135° bend is taken as 3d.",
  },
  {
    id: "180",
    title: "180° Bend",
    hindi: "180° मोड़",
    angle: 180,
    standardMultiplier: 4,
    formula: "4d",
    diagram: "180",
    note: "Common BBS bend deduction for 180° bend is taken as 4d.",
  },
  {
    id: "custom",
    title: "Custom Bend Angle",
    hindi: "कस्टम बेंड एंगल",
    angle: 0,
    standardMultiplier: 0,
    formula: "Custom",
    diagram: "custom",
    note: "Use this when drawing or consultant note gives custom bend angle or deduction.",
  },
];

const methodOptions = [
  {
    id: "standard",
    title: "Standard BBS Method",
    hindi: "स्टैंडर्ड BBS मेथड",
    desc: "45° = 1d, 90° = 2d, 135° = 3d, 180° = 4d",
  },
  {
    id: "angleBased",
    title: "Angle Based Method",
    hindi: "एंगल बेस्ड मेथड",
    desc: "Deduction multiplier = bend angle / 45",
  },
  {
    id: "custom",
    title: "Custom Multiplier",
    hindi: "कस्टम मल्टीप्लायर",
    desc: "Enter your own deduction multiplier",
  },
  {
    id: "none",
    title: "No Bend Deduction",
    hindi: "बेंड डिडक्शन नहीं",
    desc: "Use when length is already adjusted in drawing",
  },
];

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

function getDiaMm(unitSystem, barDia) {
  const dia = toNumber(barDia);
  return unitSystem === "metric" ? dia : dia * MM_PER_INCH;
}

function formatLength(mm, unitSystem) {
  if (unitSystem === "imperial") {
    return `${round(mm / MM_PER_INCH, 2)} in`;
  }

  return `${round(mm, 1)} mm`;
}

function formatSecondaryLength(mm, unitSystem) {
  if (unitSystem === "imperial") {
    return `${round(mm / 304.8, 3)} ft`;
  }

  return `${round(mm / 1000, 3)} m`;
}

function BendDiagram({ result }) {
  if (!result) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-6 text-center">
        <div>
          <Ruler className="mx-auto mb-3 text-orange-400" size={44} />
          <p className="text-lg font-bold text-white">Diagram will appear here</p>
          <p className="mt-2 text-sm text-slate-400">
            Input भरो और Calculate button दबाओ
          </p>
        </div>
      </div>
    );
  }

  if (result.diagram === "45") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 460 320" className="h-[300px] w-full">
          <defs>
            <marker id="arrow45" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <path
            d="M80 220 L260 220 Q300 220 325 195 L380 140"
            fill="none"
            stroke="#fb923c"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M80 220 L260 220 Q300 220 325 195 L380 140"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.85"
          />

          <path d="M275 220 A55 55 0 0 0 315 185" fill="none" stroke="#38bdf8" strokeWidth="2" />

          <line
            x1="390"
            y1="132"
            x2="315"
            y2="207"
            stroke="#fb923c"
            strokeWidth="2"
            markerStart="url(#arrow45)"
            markerEnd="url(#arrow45)"
          />

          <text x="303" y="178" fill="#e0f2fe" fontSize="14" fontWeight="700">
            45°
          </text>

          <text x="342" y="188" fill="#fdba74" fontSize="13" fontWeight="700">
            Deduction = {result.perBendLabel}
          </text>

          <text x="90" y="262" fill="#cbd5e1" fontSize="13" fontWeight="600">
            d = {formatLength(result.diaMm, result.unitSystem)}
          </text>

          <text x="230" y="262" fill="#cbd5e1" fontSize="13" fontWeight="600">
            Formula = {result.formulaUsed}
          </text>
        </svg>
      </div>
    );
  }

  if (result.diagram === "90") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 460 320" className="h-[300px] w-full">
          <defs>
            <marker id="arrow90" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <path
            d="M80 235 L285 235 Q330 235 330 190 L330 75"
            fill="none"
            stroke="#fb923c"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M80 235 L285 235 Q330 235 330 190 L330 75"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.85"
          />

          <path d="M288 235 A42 42 0 0 0 330 193" fill="none" stroke="#38bdf8" strokeWidth="2" />

          <line
            x1="365"
            y1="80"
            x2="365"
            y2="235"
            stroke="#fb923c"
            strokeWidth="2"
            markerStart="url(#arrow90)"
            markerEnd="url(#arrow90)"
          />

          <text x="300" y="180" fill="#e0f2fe" fontSize="14" fontWeight="700">
            90°
          </text>

          <text x="376" y="160" fill="#fdba74" fontSize="13" fontWeight="700">
            {result.perBendLabel}
          </text>

          <text x="90" y="275" fill="#cbd5e1" fontSize="13" fontWeight="600">
            d = {formatLength(result.diaMm, result.unitSystem)}
          </text>

          <text x="230" y="275" fill="#cbd5e1" fontSize="13" fontWeight="600">
            Formula = {result.formulaUsed}
          </text>
        </svg>
      </div>
    );
  }

  if (result.diagram === "135") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 460 320" className="h-[300px] w-full">
          <defs>
            <marker id="arrow135" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <path
            d="M75 235 L265 235 Q310 235 330 195 L385 95"
            fill="none"
            stroke="#fb923c"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M75 235 L265 235 Q310 235 330 195 L385 95"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.85"
          />

          <line
            x1="395"
            y1="90"
            x2="318"
            y2="212"
            stroke="#fb923c"
            strokeWidth="2"
            markerStart="url(#arrow135)"
            markerEnd="url(#arrow135)"
          />

          <text x="302" y="178" fill="#e0f2fe" fontSize="14" fontWeight="700">
            135°
          </text>

          <text x="352" y="170" fill="#fdba74" fontSize="13" fontWeight="700">
            {result.perBendLabel}
          </text>

          <text x="90" y="275" fill="#cbd5e1" fontSize="13" fontWeight="600">
            d = {formatLength(result.diaMm, result.unitSystem)}
          </text>

          <text x="230" y="275" fill="#cbd5e1" fontSize="13" fontWeight="600">
            Formula = {result.formulaUsed}
          </text>
        </svg>
      </div>
    );
  }

  if (result.diagram === "180") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 460 320" className="h-[300px] w-full">
          <defs>
            <marker id="arrow180" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <path
            d="M130 80 L130 205 Q130 245 170 245 L290 245 Q330 245 330 205 L330 80"
            fill="none"
            stroke="#fb923c"
            strokeWidth="18"
            strokeLinecap="round"
          />

          <path
            d="M130 80 L130 205 Q130 245 170 245 L290 245 Q330 245 330 205 L330 80"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.85"
          />

          <line
            x1="365"
            y1="80"
            x2="365"
            y2="245"
            stroke="#fb923c"
            strokeWidth="2"
            markerStart="url(#arrow180)"
            markerEnd="url(#arrow180)"
          />

          <text x="212" y="55" fill="#e0f2fe" fontSize="14" fontWeight="700">
            180°
          </text>

          <text x="375" y="170" fill="#fdba74" fontSize="13" fontWeight="700">
            {result.perBendLabel}
          </text>

          <text x="120" y="285" fill="#cbd5e1" fontSize="13" fontWeight="600">
            d = {formatLength(result.diaMm, result.unitSystem)}
          </text>

          <text x="250" y="285" fill="#cbd5e1" fontSize="13" fontWeight="600">
            Formula = {result.formulaUsed}
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <svg viewBox="0 0 460 320" className="h-[300px] w-full">
        <defs>
          <marker id="arrowCustom" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
          </marker>
        </defs>

        <path
          d="M75 230 L265 230 Q305 230 330 195 L380 125"
          fill="none"
          stroke="#fb923c"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M75 230 L265 230 Q305 230 330 195 L380 125"
          fill="none"
          stroke="#fed7aa"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.85"
        />

        <line
          x1="390"
          y1="118"
          x2="320"
          y2="210"
          stroke="#fb923c"
          strokeWidth="2"
          markerStart="url(#arrowCustom)"
          markerEnd="url(#arrowCustom)"
        />

        <text x="295" y="178" fill="#e0f2fe" fontSize="14" fontWeight="700">
          {round(result.angle, 1)}°
        </text>

        <text x="345" y="165" fill="#fdba74" fontSize="13" fontWeight="700">
          {result.perBendLabel}
        </text>

        <text x="90" y="275" fill="#cbd5e1" fontSize="13" fontWeight="600">
          d = {formatLength(result.diaMm, result.unitSystem)}
        </text>

        <text x="230" y="275" fill="#cbd5e1" fontSize="13" fontWeight="600">
          Formula = {result.formulaUsed}
        </text>
      </svg>
    </div>
  );
}

export default function BendDeductionCalculatorPage() {
  const [unitSystem, setUnitSystem] = useState("metric");
  const [barDia, setBarDia] = useState("12");
  const [bendAngle, setBendAngle] = useState("90");
  const [customAngle, setCustomAngle] = useState("120");
  const [numberOfBends, setNumberOfBends] = useState("4");
  const [method, setMethod] = useState("standard");
  const [customMultiplier, setCustomMultiplier] = useState("2");
  const [steelRate, setSteelRate] = useState("60");
  const [barMark, setBarMark] = useState("");
  const [memberName, setMemberName] = useState("");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedAngle = useMemo(() => {
    return angleOptions.find((item) => item.id === bendAngle) || angleOptions[1];
  }, [bendAngle]);

  const selectedMethod = useMemo(() => {
    return methodOptions.find((item) => item.id === method) || methodOptions[0];
  }, [method]);

  const quickDiameters =
    unitSystem === "metric" ? metricDiameters : imperialDiameters;

  function clearResult() {
    setResult(null);
    setError("");
    setCopied(false);
  }

  function handleUnitChange(unit) {
    setUnitSystem(unit);
    setBarDia(unit === "metric" ? "12" : "0.5");
    clearResult();
  }

  function getMultiplier(angleValue) {
    if (method === "none") {
      return {
        multiplier: 0,
        formulaUsed: "0",
        explanation: "No bend deduction applied.",
      };
    }

    if (method === "custom") {
      const custom = toNumber(customMultiplier);

      return {
        multiplier: custom,
        formulaUsed: `${round(custom, 2)}d`,
        explanation: "Custom multiplier selected by user.",
      };
    }

    if (method === "angleBased") {
      const multiplier = angleValue / 45;

      return {
        multiplier,
        formulaUsed: `${round(angleValue, 1)} / 45 × d = ${round(
          multiplier,
          2
        )}d`,
        explanation: "Angle based method uses bend angle divided by 45.",
      };
    }

    if (bendAngle === "custom") {
      const multiplier = angleValue / 45;

      return {
        multiplier,
        formulaUsed: `${round(angleValue, 1)} / 45 × d = ${round(
          multiplier,
          2
        )}d`,
        explanation:
          "Custom angle selected, so angle based multiplier is used.",
      };
    }

    return {
      multiplier: selectedAngle.standardMultiplier,
      formulaUsed: selectedAngle.formula,
      explanation: "Standard BBS bend deduction method selected.",
    };
  }

  function calculateBendDeduction() {
    setError("");
    setCopied(false);

    const diaInput = toNumber(barDia);
    const diaMm = getDiaMm(unitSystem, barDia);
    const bends = toNumber(numberOfBends);
    const angleValue =
      bendAngle === "custom" ? toNumber(customAngle) : selectedAngle.angle;
    const rate = Math.max(toNumber(steelRate), 0);

    if (diaInput <= 0 || diaMm <= 0) {
      setError("Please enter valid bar diameter.");
      setResult(null);
      return;
    }

    if (angleValue <= 0 || angleValue > 360) {
      setError("Please enter valid bend angle between 1° and 360°.");
      setResult(null);
      return;
    }

    if (bends <= 0) {
      setError("Please enter valid number of bends.");
      setResult(null);
      return;
    }

    const multiplierData = getMultiplier(angleValue);

    if (multiplierData.multiplier < 0) {
      setError("Deduction multiplier cannot be negative.");
      setResult(null);
      return;
    }

    const deductionPerBendMm = multiplierData.multiplier * diaMm;
    const totalDeductionMm = deductionPerBendMm * bends;
    const totalDeductionM = totalDeductionMm / 1000;

    const unitWeightKgPerM = (diaMm * diaMm) / 162;
    const steelWeightEquivalentKg = unitWeightKgPerM * totalDeductionM;
    const costEquivalent = steelWeightEquivalentKg * rate;

    const diagram =
      bendAngle === "custom" ? "custom" : selectedAngle.diagram || "custom";

    setResult({
      unitSystem,
      barDiaInput: diaInput,
      diaMm,
      bendAngle,
      angle: angleValue,
      angleTitle:
        bendAngle === "custom"
          ? `Custom ${round(angleValue, 1)}° Bend`
          : selectedAngle.title,
      angleHindi:
        bendAngle === "custom"
          ? "कस्टम बेंड"
          : selectedAngle.hindi,
      angleNote:
        bendAngle === "custom"
          ? "Custom bend angle selected by user."
          : selectedAngle.note,
      method,
      methodTitle: selectedMethod.title,
      methodHindi: selectedMethod.hindi,
      methodDesc: selectedMethod.desc,
      multiplier: multiplierData.multiplier,
      formulaUsed: multiplierData.formulaUsed,
      explanation: multiplierData.explanation,
      bends,
      deductionPerBendMm,
      totalDeductionMm,
      totalDeductionM,
      unitWeightKgPerM,
      steelWeightEquivalentKg,
      costEquivalent,
      rate,
      diagram,
      barMark,
      memberName,
      perBendLabel: formatLength(deductionPerBendMm, unitSystem),
    });
  }

  function resetCalculator() {
    setUnitSystem("metric");
    setBarDia("12");
    setBendAngle("90");
    setCustomAngle("120");
    setNumberOfBends("4");
    setMethod("standard");
    setCustomMultiplier("2");
    setSteelRate("60");
    setBarMark("");
    setMemberName("");
    setResult(null);
    setError("");
    setCopied(false);
  }

  async function copyResult() {
    if (!result) return;

    const text = `CivilCalc Pro - Bend Deduction Calculator

Bar Mark: ${result.barMark || "-"}
Member Name: ${result.memberName || "-"}
Bend Angle: ${result.angleTitle}
Method: ${result.methodTitle}
Formula Used: ${result.formulaUsed}

Bar Diameter: ${round(result.diaMm, 2)} mm
No. of Bends: ${round(result.bends, 0)}
Deduction per Bend: ${round(result.deductionPerBendMm, 2)} mm
Total Bend Deduction: ${round(result.totalDeductionMm, 2)} mm = ${round(
      result.totalDeductionM,
      3
    )} m

Steel Weight Equivalent: ${round(result.steelWeightEquivalentKg, 3)} kg
Cost Equivalent: ₹${round(result.costEquivalent, 2)}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

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
                Bend Deduction Calculator
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                Calculate bend deduction for 45°, 90°, 135°, 180° and custom
                bends with formula, dynamic bend diagram and step-by-step BBS
                calculation.
              </p>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                Bar diameter, bend angle और number of bends डालकर Calculate
                button दबाओ। Output में deduction per bend, total deduction,
                diagram और solution मिलेगा।
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-orange-400" size={34} />
                <div>
                  <h2 className="text-xl font-bold">Professional Output</h2>
                  <p className="text-sm text-slate-400">
                    Deduction + diagram + BBS step solution
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-900 p-4">
                  <p className="text-slate-400">90° Bend</p>
                  <p className="mt-1 text-2xl font-black text-orange-400">2d</p>
                </div>

                <div className="rounded-xl bg-slate-900 p-4">
                  <p className="text-slate-400">135° Bend</p>
                  <p className="mt-1 text-2xl font-black text-orange-400">3d</p>
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
                  Bar Diameter {unitSystem === "metric" ? "(mm)" : "(inch)"}
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

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Bend Angle
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  {angleOptions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setBendAngle(item.id);
                        clearResult();
                      }}
                      className={`rounded-xl border p-4 text-left transition ${
                        bendAngle === item.id
                          ? "border-orange-400 bg-orange-500/15"
                          : "border-slate-700 bg-slate-950 hover:border-slate-500"
                      }`}
                    >
                      <p className="font-bold text-white">{item.title}</p>
                      <p className="text-xs text-orange-200">{item.hindi}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        Deduction = {item.formula}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {bendAngle === "custom" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Custom Bend Angle degree
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="360"
                    step="1"
                    value={customAngle}
                    onChange={(e) => {
                      setCustomAngle(e.target.value);
                      clearResult();
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    placeholder="Example: 120"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Deduction Method
                </label>

                <select
                  value={method}
                  onChange={(e) => {
                    setMethod(e.target.value);
                    clearResult();
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                >
                  {methodOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} — {item.desc}
                    </option>
                  ))}
                </select>

                <div className="mt-3 rounded-xl border border-orange-500/20 bg-orange-500/10 p-4 text-sm leading-6 text-orange-100">
                  <strong>{selectedMethod.title}:</strong> {selectedMethod.desc}
                </div>
              </div>

              {method === "custom" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Custom Deduction Multiplier
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
                    placeholder="Example: 2"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Example: 2 means bend deduction = 2d per bend
                  </p>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Number of Bends
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={numberOfBends}
                  onChange={(e) => {
                    setNumberOfBends(e.target.value);
                    clearResult();
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                  placeholder="Example: 4"
                />
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
                    placeholder="Example: Beam, Column"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-200">
                  {error}
                </div>
              )}

              <button
                onClick={calculateBendDeduction}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 px-5 py-4 text-lg font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              >
                <Calculator size={22} />
                Calculate Bend Deduction
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Bend Diagram</h2>
                  <p className="text-sm text-slate-400">
                    Diagram calculate ke baad selected bend angle ke hisab se show hoga
                  </p>
                </div>

                <FileText className="text-orange-400" size={28} />
              </div>

              <BendDiagram result={result} />
            </div>

            {result && (
              <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-slate-900 p-5 md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <CheckCircle className="text-orange-300" size={28} />
                  <div>
                    <h2 className="text-2xl font-black">Calculation Result</h2>
                    <p className="text-sm text-slate-400">
                      Bend deduction output after calculation
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Deduction per Bend</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      {formatLength(result.deductionPerBendMm, result.unitSystem)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {formatSecondaryLength(
                        result.deductionPerBendMm,
                        result.unitSystem
                      )}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Number of Bends</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      {round(result.bends, 0)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Selected bend angle = {round(result.angle, 1)}°
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Total Bend Deduction</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      {formatLength(result.totalDeductionMm, result.unitSystem)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {formatSecondaryLength(result.totalDeductionMm, result.unitSystem)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Steel Weight Equivalent</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      {round(result.steelWeightEquivalentKg, 3)} kg
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Unit wt = D²/162 = {round(result.unitWeightKgPerM, 3)} kg/m
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5 sm:col-span-2">
                    <p className="text-sm text-slate-400">Cost Equivalent</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      ₹{round(result.costEquivalent, 2)}
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
                    <p>Bend Deduction per Bend = Multiplier × Bar Diameter</p>
                    <p>Total Bend Deduction = Deduction per Bend × Number of Bends</p>
                    <p>Selected Formula = {result.formulaUsed}</p>
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
                      <span className="font-bold text-white">Step 2:</span> Bend
                      angle = {round(result.angle, 1)}°
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 3:</span> Method
                      selected = {result.methodTitle}
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 4:</span> Formula
                      used ={" "}
                      <span className="font-bold text-orange-300">
                        {result.formulaUsed}
                      </span>
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 5:</span>{" "}
                      Deduction per bend = {round(result.multiplier, 2)} ×{" "}
                      {round(result.diaMm, 2)} ={" "}
                      <span className="font-bold text-orange-300">
                        {round(result.deductionPerBendMm, 2)} mm
                      </span>
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 6:</span> Total
                      deduction = {round(result.deductionPerBendMm, 2)} ×{" "}
                      {round(result.bends, 0)} ={" "}
                      <span className="font-bold text-orange-300">
                        {round(result.totalDeductionMm, 2)} mm ={" "}
                        {round(result.totalDeductionM, 3)} m
                      </span>
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 7:</span> Steel
                      weight equivalent = D² / 162 × total deduction length ={" "}
                      {round(result.diaMm, 2)}² / 162 ×{" "}
                      {round(result.totalDeductionM, 3)} ={" "}
                      <span className="font-bold text-orange-300">
                        {round(result.steelWeightEquivalentKg, 3)} kg
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
              Bend deduction is used in BBS, stirrup cutting length, crank bars,
              bent-up bars, beam bars, column ties and reinforcement detailing.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-3 flex items-center gap-2 text-orange-300">
              <Info size={20} />
              <h3 className="font-bold">Hindi Explanation</h3>
            </div>

            <p className="text-sm leading-7 text-slate-300">
              Bend deduction bar bending के कारण cutting length में adjustment
              होता है। इससे BBS में bar की actual cutting length सही आती है।
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-3 flex items-center gap-2 text-orange-300">
              <Info size={20} />
              <h3 className="font-bold">Engineering Note</h3>
            </div>

            <p className="text-sm leading-7 text-slate-300">
              Final bend deduction should be checked with project drawings,
              BBS notes, bar bending machine practice and consultant
              specifications.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
