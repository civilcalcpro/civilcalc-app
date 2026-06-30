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
const MM_PER_FT = 304.8;

const shapeOptions = [
  {
    id: "rectangular",
    title: "Rectangular Stirrup",
    hindi: "आयताकार स्टिरप",
    desc: "Beam/column rectangular stirrup",
  },
  {
    id: "square",
    title: "Square Stirrup",
    hindi: "वर्गाकार स्टिरप",
    desc: "Column square tie/stirrup",
  },
  {
    id: "circular",
    title: "Circular Stirrup",
    hindi: "गोल स्टिरप",
    desc: "Circular column tie",
  },
  {
    id: "diamond",
    title: "Diamond Stirrup",
    hindi: "डायमंड स्टिरप",
    desc: "Diamond-shaped lateral tie",
  },
  {
    id: "custom",
    title: "Custom Stirrup",
    hindi: "कस्टम स्टिरप",
    desc: "Manual straight/perimeter length",
  },
];

const hookOptions = [
  {
    id: "hook90",
    title: "90° Hook",
    hindi: "90° हुक",
    formula: "8d",
    multiplier: 8,
    minMm: 0,
    angle: "90°",
    note: "Common 90° stirrup hook extension.",
  },
  {
    id: "hook135",
    title: "135° Hook",
    hindi: "135° हुक",
    formula: "6d",
    multiplier: 6,
    minMm: 0,
    angle: "135°",
    note: "Common 135° stirrup hook extension.",
  },
  {
    id: "hook180",
    title: "180° Hook",
    hindi: "180° हुक",
    formula: "4d",
    multiplier: 4,
    minMm: 0,
    angle: "180°",
    note: "Common 180° stirrup hook extension.",
  },
  {
    id: "seismic135",
    title: "Seismic 135° Hook",
    hindi: "सीस्मिक 135° हुक",
    formula: "max(6d, 75 mm)",
    multiplier: 6,
    minMm: 75,
    angle: "135°",
    note: "Useful for ductile detailing where 135° hook extension should not be less than 75 mm.",
  },
];

const bendMethods = [
  {
    id: "standard3",
    title: "Standard BBS Deduction",
    formula: "3 × 2d",
    desc: "Most common rectangular stirrup site/BBS method",
  },
  {
    id: "allCorners",
    title: "All Corner Deduction",
    formula: "Corner bends × 2d",
    desc: "Deducts 2d for every corner bend",
  },
  {
    id: "none",
    title: "No Bend Deduction",
    formula: "0",
    desc: "Use when drawing already gives centerline length",
  },
  {
    id: "custom",
    title: "Custom Bend Deduction",
    formula: "Custom bends × custom d",
    desc: "Use consultant/project-specific deduction",
  },
];

const metricDiameters = [6, 8, 10, 12, 16];
const imperialDiameters = [0.25, 0.375, 0.5, 0.625];

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function round(value, digits = 2) {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: digits,
  });
}

function toMm(value, unitSystem) {
  const num = toNumber(value);
  return unitSystem === "metric" ? num : num * MM_PER_INCH;
}

function lengthToMm(value, unitSystem) {
  const num = toNumber(value);
  return unitSystem === "metric" ? num : num * MM_PER_FT;
}

function formatLength(mm, unitSystem) {
  if (unitSystem === "imperial") {
    return `${round(mm / MM_PER_INCH, 2)} in`;
  }

  return `${round(mm, 1)} mm`;
}

function formatLengthSecondary(mm, unitSystem) {
  if (unitSystem === "imperial") {
    return `${round(mm / MM_PER_FT, 3)} ft`;
  }

  return `${round(mm / 1000, 3)} m`;
}

function StirrupDiagram({ result }) {
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

  if (result.shape === "circular") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 460 320" className="h-[300px] w-full">
          <defs>
            <marker
              id="arrow-circle"
              markerWidth="8"
              markerHeight="8"
              refX="4"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <circle
            cx="230"
            cy="155"
            r="95"
            fill="none"
            stroke="#fb923c"
            strokeWidth="18"
          />

          <circle
            cx="230"
            cy="155"
            r="95"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="3"
            opacity="0.8"
          />

          <line
            x1="135"
            y1="155"
            x2="325"
            y2="155"
            stroke="#38bdf8"
            strokeWidth="2"
            markerStart="url(#arrow-circle)"
            markerEnd="url(#arrow-circle)"
          />

          <text x="180" y="145" fill="#e0f2fe" fontSize="13" fontWeight="700">
            Effective dia = {formatLength(result.effectiveDiameterMm, result.unitSystem)}
          </text>

          <text x="120" y="280" fill="#cbd5e1" fontSize="13" fontWeight="600">
            Bar dia = {formatLength(result.barDiaMm, result.unitSystem)}
          </text>

          <text x="265" y="280" fill="#fdba74" fontSize="13" fontWeight="700">
            CL = {formatLength(result.cuttingLengthMm, result.unitSystem)}
          </text>
        </svg>
      </div>
    );
  }

  if (result.shape === "diamond") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 460 320" className="h-[300px] w-full">
          <defs>
            <marker
              id="arrow-diamond"
              markerWidth="8"
              markerHeight="8"
              refX="4"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <polygon
            points="230,45 370,155 230,265 90,155"
            fill="none"
            stroke="#fb923c"
            strokeWidth="18"
            strokeLinejoin="round"
          />

          <polygon
            points="230,45 370,155 230,265 90,155"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="3"
            opacity="0.85"
          />

          <line
            x1="90"
            y1="155"
            x2="370"
            y2="155"
            stroke="#38bdf8"
            strokeWidth="2"
            markerStart="url(#arrow-diamond)"
            markerEnd="url(#arrow-diamond)"
          />

          <line
            x1="230"
            y1="45"
            x2="230"
            y2="265"
            stroke="#38bdf8"
            strokeWidth="2"
            markerStart="url(#arrow-diamond)"
            markerEnd="url(#arrow-diamond)"
          />

          <text x="175" y="142" fill="#e0f2fe" fontSize="13" fontWeight="700">
            W = {formatLength(result.effectiveWidthMm, result.unitSystem)}
          </text>

          <text x="238" y="158" fill="#e0f2fe" fontSize="13" fontWeight="700">
            D = {formatLength(result.effectiveDepthMm, result.unitSystem)}
          </text>

          <text x="105" y="295" fill="#cbd5e1" fontSize="13" fontWeight="600">
            {result.hookTitle} | {result.hookFormula}
          </text>

          <text x="270" y="295" fill="#fdba74" fontSize="13" fontWeight="700">
            CL = {formatLength(result.cuttingLengthMm, result.unitSystem)}
          </text>
        </svg>
      </div>
    );
  }

  if (result.shape === "custom") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 460 320" className="h-[300px] w-full">
          <defs>
            <marker
              id="arrow-custom-stirrup"
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
            d="M90 230 L150 80 L270 80 L370 170 L310 250 L160 260 Z"
            fill="none"
            stroke="#fb923c"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M90 230 L150 80 L270 80 L370 170 L310 250 L160 260 Z"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="3"
            opacity="0.85"
          />

          <line
            x1="120"
            y1="285"
            x2="340"
            y2="285"
            stroke="#fb923c"
            strokeWidth="2"
            markerStart="url(#arrow-custom-stirrup)"
            markerEnd="url(#arrow-custom-stirrup)"
          />

          <text x="145" y="305" fill="#fdba74" fontSize="13" fontWeight="700">
            Cutting Length = {formatLength(result.cuttingLengthMm, result.unitSystem)}
          </text>

          <text x="135" y="45" fill="#cbd5e1" fontSize="13" fontWeight="600">
            Custom stirrup from manual straight length
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <svg viewBox="0 0 460 320" className="h-[300px] w-full">
        <defs>
          <marker
            id="arrow-rect"
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
          </marker>
        </defs>

        <rect
          x="105"
          y="65"
          width="250"
          height="180"
          rx="18"
          fill="none"
          stroke="#fb923c"
          strokeWidth="18"
        />

        <rect
          x="105"
          y="65"
          width="250"
          height="180"
          rx="18"
          fill="none"
          stroke="#fed7aa"
          strokeWidth="3"
          opacity="0.85"
        />

        <path
          d="M355 80 L390 45"
          stroke="#fb923c"
          strokeWidth="12"
          strokeLinecap="round"
        />

        <path
          d="M105 230 L70 265"
          stroke="#fb923c"
          strokeWidth="12"
          strokeLinecap="round"
        />

        <line
          x1="105"
          y1="40"
          x2="355"
          y2="40"
          stroke="#38bdf8"
          strokeWidth="2"
          markerStart="url(#arrow-rect)"
          markerEnd="url(#arrow-rect)"
        />

        <line
          x1="75"
          y1="65"
          x2="75"
          y2="245"
          stroke="#38bdf8"
          strokeWidth="2"
          markerStart="url(#arrow-rect)"
          markerEnd="url(#arrow-rect)"
        />

        <text x="178" y="30" fill="#e0f2fe" fontSize="13" fontWeight="700">
          A = {formatLength(result.effectiveWidthMm, result.unitSystem)}
        </text>

        <text x="18" y="160" fill="#e0f2fe" fontSize="13" fontWeight="700">
          B = {formatLength(result.effectiveDepthMm, result.unitSystem)}
        </text>

        <text x="275" y="285" fill="#fdba74" fontSize="13" fontWeight="700">
          CL = {formatLength(result.cuttingLengthMm, result.unitSystem)}
        </text>

        <text x="110" y="285" fill="#cbd5e1" fontSize="13" fontWeight="600">
          {result.hookTitle} | {result.hookFormula}
        </text>
      </svg>
    </div>
  );
}

export default function StirrupLengthCalculatorPage() {
  const [unitSystem, setUnitSystem] = useState("metric");
  const [shape, setShape] = useState("rectangular");

  const [width, setWidth] = useState("230");
  const [depth, setDepth] = useState("450");
  const [diameter, setDiameter] = useState("450");
  const [clearCover, setClearCover] = useState("25");
  const [barDia, setBarDia] = useState("8");

  const [hookType, setHookType] = useState("hook135");
  const [hookEnds, setHookEnds] = useState("2");

  const [quantityMode, setQuantityMode] = useState("direct");
  const [numberOfStirrups, setNumberOfStirrups] = useState("20");
  const [memberLength, setMemberLength] = useState("3000");
  const [spacing, setSpacing] = useState("150");

  const [bendMethod, setBendMethod] = useState("standard3");
  const [customBendCount, setCustomBendCount] = useState("3");
  const [customBendMultiplier, setCustomBendMultiplier] = useState("2");

  const [customStraightLength, setCustomStraightLength] = useState("1200");
  const [steelRate, setSteelRate] = useState("60");

  const [barMark, setBarMark] = useState("");
  const [memberName, setMemberName] = useState("");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedHook = useMemo(() => {
    return hookOptions.find((item) => item.id === hookType) || hookOptions[1];
  }, [hookType]);

  function clearResult() {
    setResult(null);
    setError("");
    setCopied(false);
  }

  function handleUnitChange(unit) {
    setUnitSystem(unit);

    if (unit === "metric") {
      setWidth("230");
      setDepth("450");
      setDiameter("450");
      setClearCover("25");
      setBarDia("8");
      setMemberLength("3000");
      setSpacing("150");
      setCustomStraightLength("1200");
    } else {
      setWidth("9");
      setDepth("18");
      setDiameter("18");
      setClearCover("1");
      setBarDia("0.315");
      setMemberLength("10");
      setSpacing("0.5");
      setCustomStraightLength("4");
    }

    clearResult();
  }

  function calculateQuantity() {
    if (quantityMode === "direct") {
      return Math.max(toNumber(numberOfStirrups), 0);
    }

    const memberLengthMm = lengthToMm(memberLength, unitSystem);
    const spacingMm = lengthToMm(spacing, unitSystem);

    if (memberLengthMm <= 0 || spacingMm <= 0) return 0;

    return Math.floor(memberLengthMm / spacingMm) + 1;
  }

  function calculateBendDeduction(diaMm, cornerBends) {
    if (bendMethod === "none") {
      return {
        value: 0,
        formula: "No bend deduction applied",
      };
    }

    if (bendMethod === "standard3") {
      if (shape === "circular") {
        return {
          value: 0,
          formula: "Circular stirrup: corner bend deduction not applied",
        };
      }

      return {
        value: 3 * 2 * diaMm,
        formula: `3 × 2d = 3 × 2 × ${round(diaMm, 2)}`,
      };
    }

    if (bendMethod === "allCorners") {
      if (shape === "circular") {
        return {
          value: 0,
          formula: "Circular stirrup: corner bend deduction not applied",
        };
      }

      return {
        value: cornerBends * 2 * diaMm,
        formula: `${cornerBends} × 2d = ${cornerBends} × 2 × ${round(diaMm, 2)}`,
      };
    }

    const count = Math.max(toNumber(customBendCount), 0);
    const multiplier = Math.max(toNumber(customBendMultiplier), 0);

    return {
      value: count * multiplier * diaMm,
      formula: `${count} × ${multiplier}d = ${count} × ${multiplier} × ${round(
        diaMm,
        2
      )}`,
    };
  }

  function calculateStirrupLength() {
    setError("");
    setCopied(false);

    const coverMm = toMm(clearCover, unitSystem);
    const diaMm = toMm(barDia, unitSystem);
    const hookEndCount = Math.max(toNumber(hookEnds), 0);
    const qty = calculateQuantity();
    const rate = Math.max(toNumber(steelRate), 0);

    if (diaMm <= 0) {
      setError("Please enter valid stirrup bar diameter.");
      setResult(null);
      return;
    }

    if (coverMm < 0) {
      setError("Please enter valid clear cover.");
      setResult(null);
      return;
    }

    if (hookEndCount <= 0) {
      setError("Please enter valid hook ends.");
      setResult(null);
      return;
    }

    if (qty <= 0) {
      setError("Please enter valid number of stirrups or spacing details.");
      setResult(null);
      return;
    }

    let effectiveWidthMm = 0;
    let effectiveDepthMm = 0;
    let effectiveDiameterMm = 0;
    let perimeterMm = 0;
    let cornerBends = 0;
    let shapeFormula = "";

    if (shape === "rectangular") {
      const widthMm = toMm(width, unitSystem);
      const depthMm = toMm(depth, unitSystem);

      effectiveWidthMm = widthMm - 2 * coverMm;
      effectiveDepthMm = depthMm - 2 * coverMm;

      if (effectiveWidthMm <= 0 || effectiveDepthMm <= 0) {
        setError("Clear cover is too large for given width/depth.");
        setResult(null);
        return;
      }

      perimeterMm = 2 * (effectiveWidthMm + effectiveDepthMm);
      cornerBends = 4;
      shapeFormula = `2(A + B) = 2(${round(effectiveWidthMm, 2)} + ${round(
        effectiveDepthMm,
        2
      )})`;
    }

    if (shape === "square") {
      const sideMm = toMm(width, unitSystem);

      effectiveWidthMm = sideMm - 2 * coverMm;
      effectiveDepthMm = effectiveWidthMm;

      if (effectiveWidthMm <= 0) {
        setError("Clear cover is too large for given side size.");
        setResult(null);
        return;
      }

      perimeterMm = 4 * effectiveWidthMm;
      cornerBends = 4;
      shapeFormula = `4A = 4 × ${round(effectiveWidthMm, 2)}`;
    }

    if (shape === "circular") {
      const diameterMm = toMm(diameter, unitSystem);

      effectiveDiameterMm = diameterMm - 2 * coverMm;

      if (effectiveDiameterMm <= 0) {
        setError("Clear cover is too large for given diameter.");
        setResult(null);
        return;
      }

      perimeterMm = Math.PI * effectiveDiameterMm;
      cornerBends = 0;
      shapeFormula = `πD = 3.1416 × ${round(effectiveDiameterMm, 2)}`;
    }

    if (shape === "diamond") {
      const widthMm = toMm(width, unitSystem);
      const depthMm = toMm(depth, unitSystem);

      effectiveWidthMm = widthMm - 2 * coverMm;
      effectiveDepthMm = depthMm - 2 * coverMm;

      if (effectiveWidthMm <= 0 || effectiveDepthMm <= 0) {
        setError("Clear cover is too large for given width/depth.");
        setResult(null);
        return;
      }

      const sideLength = Math.sqrt(
        Math.pow(effectiveWidthMm / 2, 2) + Math.pow(effectiveDepthMm / 2, 2)
      );

      perimeterMm = 4 * sideLength;
      cornerBends = 4;
      shapeFormula = `4 × √((A/2)² + (B/2)²)`;
    }

    if (shape === "custom") {
      perimeterMm = lengthToMm(customStraightLength, unitSystem);

      if (perimeterMm <= 0) {
        setError("Please enter valid custom straight/perimeter length.");
        setResult(null);
        return;
      }

      cornerBends = Math.max(toNumber(customBendCount), 0);
      shapeFormula = "Custom straight/perimeter length";
    }

    const hookBaseMm = selectedHook.multiplier * diaMm;
    const hookPerEndMm = Math.max(hookBaseMm, selectedHook.minMm || 0);
    const totalHookLengthMm = hookPerEndMm * hookEndCount;

    const bend = calculateBendDeduction(diaMm, cornerBends);
    const bendDeductionMm = bend.value;

    const cuttingLengthMm = perimeterMm + totalHookLengthMm - bendDeductionMm;

    if (cuttingLengthMm <= 0) {
      setError("Calculated cutting length is invalid. Please check inputs.");
      setResult(null);
      return;
    }

    const totalLengthMm = cuttingLengthMm * qty;
    const totalLengthM = totalLengthMm / 1000;

    const unitWeightKgPerM = (diaMm * diaMm) / 162;
    const totalSteelWeightKg = unitWeightKgPerM * totalLengthM;
    const approxCost = totalSteelWeightKg * rate;

    setResult({
      unitSystem,
      shape,
      shapeTitle:
        shapeOptions.find((item) => item.id === shape)?.title || "Stirrup",
      hookTitle: selectedHook.title,
      hookFormula: selectedHook.formula,
      hookAngle: selectedHook.angle,
      hookNote: selectedHook.note,

      widthMm: toMm(width, unitSystem),
      depthMm: toMm(depth, unitSystem),
      diameterMm: toMm(diameter, unitSystem),
      coverMm,
      barDiaMm: diaMm,

      effectiveWidthMm,
      effectiveDepthMm,
      effectiveDiameterMm,

      shapeFormula,
      perimeterMm,
      cornerBends,

      hookPerEndMm,
      hookEndCount,
      totalHookLengthMm,

      bendMethod,
      bendFormula: bend.formula,
      bendDeductionMm,

      cuttingLengthMm,
      qty,
      totalLengthMm,
      totalLengthM,

      unitWeightKgPerM,
      totalSteelWeightKg,
      approxCost,
      rate,

      memberLengthMm:
        quantityMode === "spacing" ? lengthToMm(memberLength, unitSystem) : 0,
      spacingMm: quantityMode === "spacing" ? lengthToMm(spacing, unitSystem) : 0,
      quantityMode,

      barMark,
      memberName,
    });
  }

  function resetCalculator() {
    setUnitSystem("metric");
    setShape("rectangular");
    setWidth("230");
    setDepth("450");
    setDiameter("450");
    setClearCover("25");
    setBarDia("8");
    setHookType("hook135");
    setHookEnds("2");
    setQuantityMode("direct");
    setNumberOfStirrups("20");
    setMemberLength("3000");
    setSpacing("150");
    setBendMethod("standard3");
    setCustomBendCount("3");
    setCustomBendMultiplier("2");
    setCustomStraightLength("1200");
    setSteelRate("60");
    setBarMark("");
    setMemberName("");
    setResult(null);
    setError("");
    setCopied(false);
  }

  async function copyResult() {
    if (!result) return;

    const text = `CivilCalc Pro - Stirrup Length Calculator

Bar Mark: ${result.barMark || "-"}
Member Name: ${result.memberName || "-"}
Shape: ${result.shapeTitle}
Hook Type: ${result.hookTitle}
Hook Formula: ${result.hookFormula}

Bar Dia: ${round(result.barDiaMm, 2)} mm
Clear Cover: ${round(result.coverMm, 2)} mm
Perimeter / Straight Length: ${round(result.perimeterMm, 2)} mm
Hook Length Total: ${round(result.totalHookLengthMm, 2)} mm
Bend Deduction: ${round(result.bendDeductionMm, 2)} mm

Cutting Length of 1 Stirrup: ${round(result.cuttingLengthMm, 2)} mm
No. of Stirrups: ${round(result.qty, 0)}
Total Cutting Length: ${round(result.totalLengthMm, 2)} mm = ${round(
      result.totalLengthM,
      3
    )} m
Steel Weight: ${round(result.totalSteelWeightKg, 3)} kg
Approx Cost: ₹${round(result.approxCost, 2)}`;

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
                Stirrup Length Calculator
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                Calculate rectangular, square, circular, diamond and custom
                stirrup cutting length with hook length, bend deduction, steel
                weight and approximate cost.
              </p>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                Beam/column size, clear cover, stirrup dia, hook type और quantity
                डालकर Calculate button दबाओ। Output में diagram और step-by-step
                solution मिलेगा।
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-orange-400" size={34} />
                <div>
                  <h2 className="text-xl font-bold">Professional Output</h2>
                  <p className="text-sm text-slate-400">
                    Cutting length + diagram + weight + cost
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-900 p-4">
                  <p className="text-slate-400">Default Hook</p>
                  <p className="mt-1 text-2xl font-black text-orange-400">135°</p>
                </div>

                <div className="rounded-xl bg-slate-900 p-4">
                  <p className="text-slate-400">Formula</p>
                  <p className="mt-1 text-2xl font-black text-orange-400">
                    2(A+B)
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
                  Stirrup Shape
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  {shapeOptions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setShape(item.id);
                        clearResult();
                      }}
                      className={`rounded-xl border p-4 text-left transition ${
                        shape === item.id
                          ? "border-orange-400 bg-orange-500/15"
                          : "border-slate-700 bg-slate-950 hover:border-slate-500"
                      }`}
                    >
                      <p className="font-bold text-white">{item.title}</p>
                      <p className="text-xs text-orange-200">{item.hindi}</p>
                      <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {shape !== "circular" && shape !== "custom" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      {shape === "square"
                        ? `Side Size ${unitSystem === "metric" ? "(mm)" : "(inch)"}`
                        : `Member Width ${unitSystem === "metric" ? "(mm)" : "(inch)"}`}
                    </label>

                    <input
                      type="number"
                      value={width}
                      onChange={(e) => {
                        setWidth(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    />
                  </div>

                  {shape !== "square" && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-300">
                        Member Depth {unitSystem === "metric" ? "(mm)" : "(inch)"}
                      </label>

                      <input
                        type="number"
                        value={depth}
                        onChange={(e) => {
                          setDepth(e.target.value);
                          clearResult();
                        }}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                      />
                    </div>
                  )}
                </div>
              )}

              {shape === "circular" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Member Diameter {unitSystem === "metric" ? "(mm)" : "(inch)"}
                  </label>

                  <input
                    type="number"
                    value={diameter}
                    onChange={(e) => {
                      setDiameter(e.target.value);
                      clearResult();
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                  />
                </div>
              )}

              {shape === "custom" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Custom Straight / Perimeter Length{" "}
                    {unitSystem === "metric" ? "(mm)" : "(ft)"}
                  </label>

                  <input
                    type="number"
                    value={customStraightLength}
                    onChange={(e) => {
                      setCustomStraightLength(e.target.value);
                      clearResult();
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                  />
                </div>
              )}

              {shape !== "custom" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Clear Cover {unitSystem === "metric" ? "(mm)" : "(inch)"}
                  </label>

                  <input
                    type="number"
                    value={clearCover}
                    onChange={(e) => {
                      setClearCover(e.target.value);
                      clearResult();
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Effective size = member size - 2 × clear cover
                  </p>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Stirrup Bar Diameter {unitSystem === "metric" ? "(mm)" : "(inch)"}
                </label>

                <input
                  type="number"
                  step={unitSystem === "metric" ? "1" : "0.001"}
                  value={barDia}
                  onChange={(e) => {
                    setBarDia(e.target.value);
                    clearResult();
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
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
                  Hook Type
                </label>

                <select
                  value={hookType}
                  onChange={(e) => {
                    setHookType(e.target.value);
                    clearResult();
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                >
                  {hookOptions.map((item) => (
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
                  Hook Ends
                </label>

                <input
                  type="number"
                  value={hookEnds}
                  onChange={(e) => {
                    setHookEnds(e.target.value);
                    clearResult();
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Usually closed stirrup has 2 hook ends.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Quantity Method
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setQuantityMode("direct");
                      clearResult();
                    }}
                    className={`rounded-xl border p-4 text-left transition ${
                      quantityMode === "direct"
                        ? "border-orange-400 bg-orange-500/15 text-orange-200"
                        : "border-slate-700 bg-slate-950 text-slate-300"
                    }`}
                  >
                    <p className="font-bold">Direct Quantity</p>
                    <p className="text-xs text-slate-400">Enter no. of stirrups</p>
                  </button>

                  <button
                    onClick={() => {
                      setQuantityMode("spacing");
                      clearResult();
                    }}
                    className={`rounded-xl border p-4 text-left transition ${
                      quantityMode === "spacing"
                        ? "border-orange-400 bg-orange-500/15 text-orange-200"
                        : "border-slate-700 bg-slate-950 text-slate-300"
                    }`}
                  >
                    <p className="font-bold">From Spacing</p>
                    <p className="text-xs text-slate-400">Length / spacing + 1</p>
                  </button>
                </div>
              </div>

              {quantityMode === "direct" ? (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Number of Stirrups
                  </label>

                  <input
                    type="number"
                    value={numberOfStirrups}
                    onChange={(e) => {
                      setNumberOfStirrups(e.target.value);
                      clearResult();
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                  />
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      Member Length {unitSystem === "metric" ? "(mm)" : "(ft)"}
                    </label>

                    <input
                      type="number"
                      value={memberLength}
                      onChange={(e) => {
                        setMemberLength(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      Spacing {unitSystem === "metric" ? "(mm)" : "(ft)"}
                    </label>

                    <input
                      type="number"
                      value={spacing}
                      onChange={(e) => {
                        setSpacing(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Bend Deduction Method
                </label>

                <select
                  value={bendMethod}
                  onChange={(e) => {
                    setBendMethod(e.target.value);
                    clearResult();
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                >
                  {bendMethods.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} — {item.formula}
                    </option>
                  ))}
                </select>
              </div>

              {bendMethod === "custom" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      Custom Bend Count
                    </label>

                    <input
                      type="number"
                      value={customBendCount}
                      onChange={(e) => {
                        setCustomBendCount(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      Deduction Multiplier
                    </label>

                    <input
                      type="number"
                      value={customBendMultiplier}
                      onChange={(e) => {
                        setCustomBendMultiplier(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Steel Rate ₹/kg, optional
                </label>

                <input
                  type="number"
                  value={steelRate}
                  onChange={(e) => {
                    setSteelRate(e.target.value);
                    clearResult();
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
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
                    placeholder="Example: S1"
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
                    placeholder="Example: Beam B1"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-200">
                  {error}
                </div>
              )}

              <button
                onClick={calculateStirrupLength}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 px-5 py-4 text-lg font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              >
                <Calculator size={22} />
                Calculate Stirrup Length
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Stirrup Diagram</h2>
                  <p className="text-sm text-slate-400">
                    Diagram calculate ke baad selected shape ke hisab se show hoga
                  </p>
                </div>

                <FileText className="text-orange-400" size={28} />
              </div>

              <StirrupDiagram result={result} />
            </div>

            {result && (
              <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-slate-900 p-5 md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <CheckCircle className="text-orange-300" size={28} />
                  <div>
                    <h2 className="text-2xl font-black">Calculation Result</h2>
                    <p className="text-sm text-slate-400">
                      Stirrup cutting length output after calculation
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Cutting Length / Stirrup</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      {formatLength(result.cuttingLengthMm, result.unitSystem)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {formatLengthSecondary(result.cuttingLengthMm, result.unitSystem)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">No. of Stirrups</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      {round(result.qty, 0)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {result.quantityMode === "spacing"
                        ? "Calculated from member length and spacing"
                        : "Direct quantity input"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Total Cutting Length</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      {formatLength(result.totalLengthMm, result.unitSystem)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {formatLengthSecondary(result.totalLengthMm, result.unitSystem)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Total Steel Weight</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      {round(result.totalSteelWeightKg, 3)} kg
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Unit wt = D²/162 = {round(result.unitWeightKgPerM, 3)} kg/m
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5 sm:col-span-2">
                    <p className="text-sm text-slate-400">Approx. Steel Cost</p>
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
                    <p>Effective Size = Member Size - 2 × Clear Cover</p>
                    <p>Perimeter / Straight Length = {result.shapeFormula}</p>
                    <p>
                      Cutting Length = Perimeter + Hook Length - Bend Deduction
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
                      <span className="font-bold text-white">Step 1:</span>{" "}
                      Stirrup shape = {result.shapeTitle}
                    </p>

                    {result.shape !== "custom" && result.shape !== "circular" && (
                      <>
                        <p>
                          <span className="font-bold text-white">Step 2:</span>{" "}
                          Effective width, A = Width - 2 × cover ={" "}
                          {round(result.effectiveWidthMm, 2)} mm
                        </p>

                        <p>
                          <span className="font-bold text-white">Step 3:</span>{" "}
                          Effective depth, B = Depth - 2 × cover ={" "}
                          {round(result.effectiveDepthMm, 2)} mm
                        </p>
                      </>
                    )}

                    {result.shape === "circular" && (
                      <p>
                        <span className="font-bold text-white">Step 2:</span>{" "}
                        Effective diameter = Diameter - 2 × cover ={" "}
                        {round(result.effectiveDiameterMm, 2)} mm
                      </p>
                    )}

                    <p>
                      <span className="font-bold text-white">
                        Step {result.shape === "custom" ? "2" : result.shape === "circular" ? "3" : "4"}:
                      </span>{" "}
                      Perimeter / straight length = {result.shapeFormula} ={" "}
                      <span className="font-bold text-orange-300">
                        {round(result.perimeterMm, 2)} mm
                      </span>
                    </p>

                    <p>
                      <span className="font-bold text-white">
                        Step {result.shape === "custom" ? "3" : result.shape === "circular" ? "4" : "5"}:
                      </span>{" "}
                      Hook length per end = {result.hookFormula} ={" "}
                      {round(result.hookPerEndMm, 2)} mm
                    </p>

                    <p>
                      <span className="font-bold text-white">
                        Step {result.shape === "custom" ? "4" : result.shape === "circular" ? "5" : "6"}:
                      </span>{" "}
                      Total hook length = {round(result.hookPerEndMm, 2)} ×{" "}
                      {round(result.hookEndCount, 0)} ={" "}
                      {round(result.totalHookLengthMm, 2)} mm
                    </p>

                    <p>
                      <span className="font-bold text-white">
                        Step {result.shape === "custom" ? "5" : result.shape === "circular" ? "6" : "7"}:
                      </span>{" "}
                      Bend deduction = {result.bendFormula} ={" "}
                      {round(result.bendDeductionMm, 2)} mm
                    </p>

                    <p>
                      <span className="font-bold text-white">
                        Step {result.shape === "custom" ? "6" : result.shape === "circular" ? "7" : "8"}:
                      </span>{" "}
                      Cutting length = {round(result.perimeterMm, 2)} +{" "}
                      {round(result.totalHookLengthMm, 2)} -{" "}
                      {round(result.bendDeductionMm, 2)} ={" "}
                      <span className="font-bold text-orange-300">
                        {round(result.cuttingLengthMm, 2)} mm
                      </span>
                    </p>

                    <p>
                      <span className="font-bold text-white">
                        Step {result.shape === "custom" ? "7" : result.shape === "circular" ? "8" : "9"}:
                      </span>{" "}
                      Total cutting length = {round(result.cuttingLengthMm, 2)} ×{" "}
                      {round(result.qty, 0)} ={" "}
                      <span className="font-bold text-orange-300">
                        {round(result.totalLengthMm, 2)} mm ={" "}
                        {round(result.totalLengthM, 3)} m
                      </span>
                    </p>

                    <p>
                      <span className="font-bold text-white">
                        Step {result.shape === "custom" ? "8" : result.shape === "circular" ? "9" : "10"}:
                      </span>{" "}
                      Steel weight = D² / 162 × total length ={" "}
                      {round(result.barDiaMm, 2)}² / 162 ×{" "}
                      {round(result.totalLengthM, 3)} ={" "}
                      <span className="font-bold text-orange-300">
                        {round(result.totalSteelWeightKg, 3)} kg
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
              Stirrup length is used in beam stirrups, column ties, footing
              reinforcement, seismic detailing and BBS preparation.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-3 flex items-center gap-2 text-orange-300">
              <Info size={20} />
              <h3 className="font-bold">Hindi Explanation</h3>
            </div>

            <p className="text-sm leading-7 text-slate-300">
              Stirrup cutting length निकालने के लिए member size से clear cover
              घटाकर effective size निकाला जाता है, फिर hook length add और bend
              deduction minus किया जाता है।
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-3 flex items-center gap-2 text-orange-300">
              <Info size={20} />
              <h3 className="font-bold">Engineering Note</h3>
            </div>

            <p className="text-sm leading-7 text-slate-300">
              Final cutting length should always be checked with structural
              drawings, bar bending schedule notes and consultant specifications.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
