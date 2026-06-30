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

const barTypes = [
  {
    id: "single",
    title: "Single Crank Bar",
    hindi: "सिंगल क्रैंक बार",
    desc: "One bent-up crank bar",
  },
  {
    id: "double",
    title: "Double Crank Bar",
    hindi: "डबल क्रैंक बार",
    desc: "Two crank / bent-up bar",
  },
  {
    id: "hooks",
    title: "Crank Bar with Hooks",
    hindi: "हुक वाला क्रैंक बार",
    desc: "Crank bar with end hooks",
  },
  {
    id: "lap",
    title: "Crank Bar with Lap",
    hindi: "लैप वाला क्रैंक बार",
    desc: "Crank bar with lap length addition",
  },
  {
    id: "custom",
    title: "Custom Crank Bar",
    hindi: "कस्टम क्रैंक बार",
    desc: "Manual crank count and additions",
  },
];

const angleOptions = [
  { id: "30", title: "30° Crank", angle: 30 },
  { id: "45", title: "45° Crank", angle: 45 },
  { id: "60", title: "60° Crank", angle: 60 },
  { id: "custom", title: "Custom Angle", angle: 0 },
];

const hookTypes = [
  { id: "hook90", title: "90° Hook", formula: "8d", multiplier: 8 },
  { id: "hook135", title: "135° Hook", formula: "6d", multiplier: 6 },
  { id: "hook180", title: "180° / U Hook", formula: "16d", multiplier: 16 },
  { id: "custom", title: "Custom Hook", formula: "Custom × d", multiplier: "custom" },
];

const bendOptions = [
  { id: "none", title: "No Bend Deduction", formula: "0", multiplier: 0 },
  { id: "angleBased", title: "Angle Based Deduction", formula: "Angle / 45 × d", multiplier: "angle" },
  { id: "45", title: "45° Bend Deduction", formula: "1d", multiplier: 1 },
  { id: "90", title: "90° Bend Deduction", formula: "2d", multiplier: 2 },
  { id: "custom", title: "Custom Bend Deduction", formula: "Custom × d", multiplier: "custom" },
];

const lapTypes = [
  { id: "40d", title: "40d Lap Length", multiplier: 40 },
  { id: "50d", title: "50d Lap Length", multiplier: 50 },
  { id: "custom", title: "Custom Lap Length", multiplier: "custom" },
];

const metricDiameters = [8, 10, 12, 16, 20, 25, 32];
const imperialDiameters = [0.315, 0.375, 0.5, 0.625, 0.75, 1];

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function round(value, digits = 2) {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: digits,
  });
}

function barDiaToMm(value, unitSystem) {
  const num = toNumber(value);
  return unitSystem === "metric" ? num : num * MM_PER_INCH;
}

function longLengthToMm(value, unitSystem) {
  const num = toNumber(value);
  return unitSystem === "metric" ? num : num * MM_PER_FT;
}

function dimensionToMm(value, unitSystem) {
  const num = toNumber(value);
  return unitSystem === "metric" ? num : num * MM_PER_INCH;
}

function formatLength(mm, unitSystem) {
  if (unitSystem === "imperial") {
    return `${round(mm / MM_PER_FT, 3)} ft`;
  }

  return `${round(mm, 1)} mm`;
}

function formatSecondaryLength(mm, unitSystem) {
  if (unitSystem === "imperial") {
    return `${round(mm / MM_PER_INCH, 2)} in`;
  }

  return `${round(mm / 1000, 3)} m`;
}

function formatDimension(mm, unitSystem) {
  if (unitSystem === "imperial") {
    return `${round(mm / MM_PER_INCH, 2)} in`;
  }

  return `${round(mm, 1)} mm`;
}

function CrankDiagram({ result }) {
  if (!result) {
    return (
      <div className="flex min-h-[310px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-6 text-center">
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

  if (result.barType === "single") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 480 330" className="h-[310px] w-full">
          <defs>
            <marker id="arrow-single" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <path
            d="M65 235 L200 235 L280 125 L410 125"
            fill="none"
            stroke="#fb923c"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M65 235 L200 235 L280 125 L410 125"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="3"
            opacity="0.85"
          />

          <line x1="65" y1="275" x2="410" y2="275" stroke="#38bdf8" strokeWidth="2" markerStart="url(#arrow-single)" markerEnd="url(#arrow-single)" />
          <line x1="200" y1="235" x2="200" y2="125" stroke="#38bdf8" strokeWidth="2" markerStart="url(#arrow-single)" markerEnd="url(#arrow-single)" />
          <line x1="200" y1="125" x2="280" y2="125" stroke="#64748b" strokeWidth="2" strokeDasharray="5 5" />

          <text x="150" y="305" fill="#e0f2fe" fontSize="13" fontWeight="700">
            Straight Length = {formatLength(result.straightLengthMm, result.unitSystem)}
          </text>
          <text x="120" y="185" fill="#e0f2fe" fontSize="13" fontWeight="700">
            H = {formatDimension(result.crankHeightMm, result.unitSystem)}
          </text>
          <text x="245" y="175" fill="#fdba74" fontSize="13" fontWeight="700">
            {round(result.angleDeg, 1)}°
          </text>
          <text x="70" y="78" fill="#fdba74" fontSize="13" fontWeight="700">
            CL = {formatLength(result.cuttingLengthPerBarMm, result.unitSystem)}
          </text>
          <text x="250" y="78" fill="#cbd5e1" fontSize="13" fontWeight="600">
            Extra / crank = {formatDimension(result.extraPerCrankMm, result.unitSystem)}
          </text>
        </svg>
      </div>
    );
  }

  if (result.barType === "lap") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 480 330" className="h-[310px] w-full">
          <defs>
            <marker id="arrow-lap-crank" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <path
            d="M60 230 L140 230 L215 120 L305 120 L380 230 L430 230"
            fill="none"
            stroke="#fb923c"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="255" y1="262" x2="430" y2="262" stroke="#fdba74" strokeWidth="18" strokeLinecap="round" />

          <line x1="255" y1="295" x2="430" y2="295" stroke="#38bdf8" strokeWidth="2" markerStart="url(#arrow-lap-crank)" markerEnd="url(#arrow-lap-crank)" />
          <line x1="215" y1="230" x2="215" y2="120" stroke="#38bdf8" strokeWidth="2" markerStart="url(#arrow-lap-crank)" markerEnd="url(#arrow-lap-crank)" />

          <text x="290" y="318" fill="#e0f2fe" fontSize="13" fontWeight="700">
            Lap = {formatLength(result.lapAddedMm, result.unitSystem)}
          </text>
          <text x="132" y="175" fill="#e0f2fe" fontSize="13" fontWeight="700">
            H = {formatDimension(result.crankHeightMm, result.unitSystem)}
          </text>
          <text x="75" y="78" fill="#fdba74" fontSize="13" fontWeight="700">
            CL = {formatLength(result.cuttingLengthPerBarMm, result.unitSystem)}
          </text>
        </svg>
      </div>
    );
  }

  if (result.barType === "hooks") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 480 330" className="h-[310px] w-full">
          <defs>
            <marker id="arrow-hook-crank" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <path
            d="M65 95 L65 225 L140 225 L215 120 L305 120 L380 225 L415 225 L415 95"
            fill="none"
            stroke="#fb923c"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M65 95 L65 225 L140 225 L215 120 L305 120 L380 225 L415 225 L415 95"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="3"
            opacity="0.85"
          />

          <line x1="140" y1="265" x2="380" y2="265" stroke="#38bdf8" strokeWidth="2" markerStart="url(#arrow-hook-crank)" markerEnd="url(#arrow-hook-crank)" />
          <line x1="215" y1="225" x2="215" y2="120" stroke="#38bdf8" strokeWidth="2" markerStart="url(#arrow-hook-crank)" markerEnd="url(#arrow-hook-crank)" />

          <text x="170" y="292" fill="#e0f2fe" fontSize="13" fontWeight="700">
            Straight = {formatLength(result.straightLengthMm, result.unitSystem)}
          </text>
          <text x="132" y="175" fill="#e0f2fe" fontSize="13" fontWeight="700">
            H = {formatDimension(result.crankHeightMm, result.unitSystem)}
          </text>
          <text x="72" y="75" fill="#cbd5e1" fontSize="13" fontWeight="600">
            Hook Added = {formatLength(result.hookAddedMm, result.unitSystem)}
          </text>
          <text x="75" y="315" fill="#fdba74" fontSize="13" fontWeight="700">
            CL = {formatLength(result.cuttingLengthPerBarMm, result.unitSystem)}
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <svg viewBox="0 0 480 330" className="h-[310px] w-full">
        <defs>
          <marker id="arrow-double" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
          </marker>
        </defs>

        <path
          d="M60 230 L140 230 L215 120 L305 120 L380 230 L430 230"
          fill="none"
          stroke="#fb923c"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M60 230 L140 230 L215 120 L305 120 L380 230 L430 230"
          fill="none"
          stroke="#fed7aa"
          strokeWidth="3"
          opacity="0.85"
        />

        <line x1="60" y1="270" x2="430" y2="270" stroke="#38bdf8" strokeWidth="2" markerStart="url(#arrow-double)" markerEnd="url(#arrow-double)" />
        <line x1="215" y1="230" x2="215" y2="120" stroke="#38bdf8" strokeWidth="2" markerStart="url(#arrow-double)" markerEnd="url(#arrow-double)" />
        <line x1="215" y1="120" x2="305" y2="120" stroke="#64748b" strokeWidth="2" strokeDasharray="5 5" />

        <text x="155" y="300" fill="#e0f2fe" fontSize="13" fontWeight="700">
          Straight Length = {formatLength(result.straightLengthMm, result.unitSystem)}
        </text>
        <text x="132" y="175" fill="#e0f2fe" fontSize="13" fontWeight="700">
          H = {formatDimension(result.crankHeightMm, result.unitSystem)}
        </text>
        <text x="225" y="170" fill="#fdba74" fontSize="13" fontWeight="700">
          {round(result.angleDeg, 1)}°
        </text>
        <text x="75" y="78" fill="#fdba74" fontSize="13" fontWeight="700">
          CL = {formatLength(result.cuttingLengthPerBarMm, result.unitSystem)}
        </text>
        <text x="250" y="78" fill="#cbd5e1" fontSize="13" fontWeight="600">
          Cranks = {round(result.crankCount, 0)}
        </text>
      </svg>
    </div>
  );
}

export default function CrankBarCalculatorPage() {
  const [unitSystem, setUnitSystem] = useState("metric");
  const [barType, setBarType] = useState("double");

  const [straightLength, setStraightLength] = useState("3000");
  const [heightMode, setHeightMode] = useState("manual");
  const [crankHeight, setCrankHeight] = useState("150");
  const [memberThickness, setMemberThickness] = useState("150");
  const [topCover, setTopCover] = useState("25");
  const [bottomCover, setBottomCover] = useState("25");

  const [angleType, setAngleType] = useState("45");
  const [customAngle, setCustomAngle] = useState("45");
  const [crankCount, setCrankCount] = useState("2");

  const [barDia, setBarDia] = useState("12");

  const [bendType, setBendType] = useState("angleBased");
  const [bendCountMode, setBendCountMode] = useState("auto");
  const [manualBendCount, setManualBendCount] = useState("4");
  const [customBendMultiplier, setCustomBendMultiplier] = useState("1");

  const [hookOption, setHookOption] = useState("none");
  const [hookType, setHookType] = useState("hook180");
  const [customHookMultiplier, setCustomHookMultiplier] = useState("9");
  const [customHookCount, setCustomHookCount] = useState("2");

  const [addLap, setAddLap] = useState("no");
  const [lapType, setLapType] = useState("40d");
  const [lapCount, setLapCount] = useState("1");
  const [customLapLength, setCustomLapLength] = useState("600");

  const [numberOfBars, setNumberOfBars] = useState("1");
  const [steelRate, setSteelRate] = useState("60");

  const [barMark, setBarMark] = useState("");
  const [memberName, setMemberName] = useState("");
  const [remarks, setRemarks] = useState("");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedBarType = useMemo(() => {
    return barTypes.find((item) => item.id === barType) || barTypes[1];
  }, [barType]);

  const selectedAngle = useMemo(() => {
    return angleOptions.find((item) => item.id === angleType) || angleOptions[1];
  }, [angleType]);

  const selectedHook = useMemo(() => {
    return hookTypes.find((item) => item.id === hookType) || hookTypes[2];
  }, [hookType]);

  const selectedBend = useMemo(() => {
    return bendOptions.find((item) => item.id === bendType) || bendOptions[1];
  }, [bendType]);

  const selectedLap = useMemo(() => {
    return lapTypes.find((item) => item.id === lapType) || lapTypes[0];
  }, [lapType]);

  const quickDiameters =
    unitSystem === "metric" ? metricDiameters : imperialDiameters;

  function clearResult() {
    setResult(null);
    setError("");
    setCopied(false);
  }

  function handleUnitChange(unit) {
    setUnitSystem(unit);

    if (unit === "metric") {
      setStraightLength("3000");
      setCrankHeight("150");
      setMemberThickness("150");
      setTopCover("25");
      setBottomCover("25");
      setBarDia("12");
      setCustomLapLength("600");
    } else {
      setStraightLength("10");
      setCrankHeight("6");
      setMemberThickness("6");
      setTopCover("1");
      setBottomCover("1");
      setBarDia("0.5");
      setCustomLapLength("2");
    }

    clearResult();
  }

  function handleBarTypeChange(type) {
    setBarType(type);

    if (type === "single") {
      setCrankCount("1");
      setHookOption("none");
      setAddLap("no");
    }

    if (type === "double") {
      setCrankCount("2");
      setHookOption("none");
      setAddLap("no");
    }

    if (type === "hooks") {
      setCrankCount("2");
      setHookOption("both");
      setAddLap("no");
    }

    if (type === "lap") {
      setCrankCount("2");
      setHookOption("none");
      setAddLap("yes");
    }

    if (type === "custom") {
      setCrankCount("1");
    }

    clearResult();
  }

  function getHookCount() {
    if (hookOption === "none") return 0;
    if (hookOption === "one") return 1;
    if (hookOption === "both") return 2;
    return Math.max(toNumber(customHookCount), 0);
  }

  function getCrankHeightMm(diaMm) {
    if (heightMode === "manual") {
      return dimensionToMm(crankHeight, unitSystem);
    }

    const thicknessMm = dimensionToMm(memberThickness, unitSystem);
    const topCoverMm = dimensionToMm(topCover, unitSystem);
    const bottomCoverMm = dimensionToMm(bottomCover, unitSystem);

    return thicknessMm - topCoverMm - bottomCoverMm - diaMm;
  }

  function getHookLengthMm(diaMm) {
    const count = getHookCount();

    if (count <= 0) {
      return {
        hookCountValue: 0,
        hookPerEndMm: 0,
        hookAddedMm: 0,
        hookFormula: "No hook",
        hookMultiplier: 0,
      };
    }

    const multiplier =
      selectedHook.multiplier === "custom"
        ? Math.max(toNumber(customHookMultiplier), 0)
        : selectedHook.multiplier;

    const hookPerEndMm = multiplier * diaMm;

    return {
      hookCountValue: count,
      hookPerEndMm,
      hookAddedMm: hookPerEndMm * count,
      hookFormula:
        selectedHook.multiplier === "custom"
          ? `${round(multiplier, 2)}d`
          : selectedHook.formula,
      hookMultiplier: multiplier,
    };
  }

  function getBendDeductionMm(diaMm, angleDeg, crankCountValue) {
    if (bendType === "none") {
      return {
        bendDeductionMm: 0,
        bendCountValue: 0,
        bendMultiplier: 0,
        bendFormula: "No bend deduction",
      };
    }

    const bendCountValue =
      bendCountMode === "auto"
        ? crankCountValue * 2
        : Math.max(toNumber(manualBendCount), 0);

    let multiplier = 0;

    if (bendType === "angleBased") {
      multiplier = angleDeg / 45;
    } else if (bendType === "custom") {
      multiplier = Math.max(toNumber(customBendMultiplier), 0);
    } else {
      multiplier = selectedBend.multiplier;
    }

    return {
      bendDeductionMm: multiplier * diaMm * bendCountValue,
      bendCountValue,
      bendMultiplier: multiplier,
      bendFormula:
        bendType === "angleBased"
          ? `${round(angleDeg, 1)} / 45 × d × ${round(bendCountValue, 0)} bends`
          : `${round(multiplier, 2)}d × ${round(bendCountValue, 0)} bends`,
    };
  }

  function getLapLengthMm(diaMm) {
    if (addLap !== "yes") {
      return {
        lapAddedMm: 0,
        lapPerLapMm: 0,
        lapCountValue: 0,
        lapFormula: "No lap length",
      };
    }

    const count = Math.max(toNumber(lapCount), 0);

    if (selectedLap.multiplier === "custom") {
      const customLengthMm = longLengthToMm(customLapLength, unitSystem);

      return {
        lapAddedMm: customLengthMm * count,
        lapPerLapMm: customLengthMm,
        lapCountValue: count,
        lapFormula: `${formatLength(customLengthMm, unitSystem)} × ${round(count, 0)} laps`,
      };
    }

    const lapPerLapMm = selectedLap.multiplier * diaMm;

    return {
      lapAddedMm: lapPerLapMm * count,
      lapPerLapMm,
      lapCountValue: count,
      lapFormula: `${selectedLap.multiplier}d × ${round(count, 0)} laps`,
    };
  }

  function calculateCrankBar() {
    setError("");
    setCopied(false);

    const straightLengthMm = longLengthToMm(straightLength, unitSystem);
    const diaMm = barDiaToMm(barDia, unitSystem);
    const crankCountValue = Math.max(toNumber(crankCount), 0);
    const bars = Math.max(toNumber(numberOfBars), 0);
    const rate = Math.max(toNumber(steelRate), 0);
    const angleDeg = angleType === "custom" ? toNumber(customAngle) : selectedAngle.angle;

    if (straightLengthMm <= 0) {
      setError("Please enter valid straight length.");
      setResult(null);
      return;
    }

    if (diaMm <= 0) {
      setError("Please enter valid bar diameter.");
      setResult(null);
      return;
    }

    if (angleDeg <= 0 || angleDeg >= 90) {
      setError("Please enter valid crank angle between 1° and 89°.");
      setResult(null);
      return;
    }

    if (crankCountValue <= 0) {
      setError("Please enter valid number of cranks.");
      setResult(null);
      return;
    }

    if (bars <= 0) {
      setError("Please enter valid number of bars.");
      setResult(null);
      return;
    }

    const crankHeightMm = getCrankHeightMm(diaMm);

    if (crankHeightMm <= 0) {
      setError("Crank height is invalid. Check height/thickness/cover inputs.");
      setResult(null);
      return;
    }

    const theta = (angleDeg * Math.PI) / 180;
    const sinTheta = Math.sin(theta);
    const tanTheta = Math.tan(theta);

    if (sinTheta <= 0 || tanTheta <= 0) {
      setError("Invalid angle for crank calculation.");
      setResult(null);
      return;
    }

    const inclinedLengthPerCrankMm = crankHeightMm / sinTheta;
    const horizontalProjectionPerCrankMm = crankHeightMm / tanTheta;
    const extraPerCrankMm = inclinedLengthPerCrankMm - horizontalProjectionPerCrankMm;
    const totalCrankExtraMm = extraPerCrankMm * crankCountValue;

    const hook = getHookLengthMm(diaMm);

    if (hook.hookCountValue > 0 && hook.hookMultiplier <= 0) {
      setError("Please enter valid hook multiplier.");
      setResult(null);
      return;
    }

    const bend = getBendDeductionMm(diaMm, angleDeg, crankCountValue);

    if (bendType !== "none" && bend.bendCountValue <= 0) {
      setError("Please enter valid number of bend deductions.");
      setResult(null);
      return;
    }

    const lap = getLapLengthMm(diaMm);

    if (addLap === "yes" && lap.lapCountValue <= 0) {
      setError("Please enter valid lap count.");
      setResult(null);
      return;
    }

    const cuttingLengthPerBarMm =
      straightLengthMm +
      totalCrankExtraMm +
      hook.hookAddedMm +
      lap.lapAddedMm -
      bend.bendDeductionMm;

    if (cuttingLengthPerBarMm <= 0) {
      setError("Calculated cutting length is invalid. Please check deduction values.");
      setResult(null);
      return;
    }

    const totalLengthMm = cuttingLengthPerBarMm * bars;
    const totalLengthM = totalLengthMm / 1000;
    const unitWeightKgPerM = (diaMm * diaMm) / 162;
    const totalSteelWeightKg = unitWeightKgPerM * totalLengthM;
    const approxCost = totalSteelWeightKg * rate;

    setResult({
      unitSystem,
      barType,
      barTypeTitle: selectedBarType.title,
      straightLengthMm,
      diaMm,
      angleDeg,
      crankCount: crankCountValue,
      crankHeightMm,
      inclinedLengthPerCrankMm,
      horizontalProjectionPerCrankMm,
      extraPerCrankMm,
      totalCrankExtraMm,
      factor: extraPerCrankMm / crankHeightMm,

      hookTitle: selectedHook.title,
      hookFormula: hook.hookFormula,
      hookPerEndMm: hook.hookPerEndMm,
      hookCountValue: hook.hookCountValue,
      hookAddedMm: hook.hookAddedMm,

      bendTitle: selectedBend.title,
      bendFormula: bend.bendFormula,
      bendCountValue: bend.bendCountValue,
      bendMultiplier: bend.bendMultiplier,
      bendDeductionMm: bend.bendDeductionMm,

      lapFormula: lap.lapFormula,
      lapPerLapMm: lap.lapPerLapMm,
      lapCountValue: lap.lapCountValue,
      lapAddedMm: lap.lapAddedMm,

      cuttingLengthPerBarMm,
      bars,
      totalLengthMm,
      totalLengthM,
      unitWeightKgPerM,
      totalSteelWeightKg,
      approxCost,
      rate,

      heightMode,
      memberThicknessMm: dimensionToMm(memberThickness, unitSystem),
      topCoverMm: dimensionToMm(topCover, unitSystem),
      bottomCoverMm: dimensionToMm(bottomCover, unitSystem),

      barMark,
      memberName,
      remarks,
    });
  }

  function resetCalculator() {
    setUnitSystem("metric");
    setBarType("double");
    setStraightLength("3000");
    setHeightMode("manual");
    setCrankHeight("150");
    setMemberThickness("150");
    setTopCover("25");
    setBottomCover("25");
    setAngleType("45");
    setCustomAngle("45");
    setCrankCount("2");
    setBarDia("12");
    setBendType("angleBased");
    setBendCountMode("auto");
    setManualBendCount("4");
    setCustomBendMultiplier("1");
    setHookOption("none");
    setHookType("hook180");
    setCustomHookMultiplier("9");
    setCustomHookCount("2");
    setAddLap("no");
    setLapType("40d");
    setLapCount("1");
    setCustomLapLength("600");
    setNumberOfBars("1");
    setSteelRate("60");
    setBarMark("");
    setMemberName("");
    setRemarks("");
    setResult(null);
    setError("");
    setCopied(false);
  }

  async function copyResult() {
    if (!result) return;

    const text = `CivilCalc Pro - Crank Bar Calculator

Bar Mark: ${result.barMark || "-"}
Member Name: ${result.memberName || "-"}
Bar Type: ${result.barTypeTitle}

Straight Length: ${round(result.straightLengthMm, 2)} mm
Bar Diameter: ${round(result.diaMm, 2)} mm
Crank Height: ${round(result.crankHeightMm, 2)} mm
Crank Angle: ${round(result.angleDeg, 2)}°
Number of Cranks: ${round(result.crankCount, 0)}

Inclined Length per Crank: ${round(result.inclinedLengthPerCrankMm, 2)} mm
Extra Length per Crank: ${round(result.extraPerCrankMm, 2)} mm
Total Crank Extra Length: ${round(result.totalCrankExtraMm, 2)} mm
Hook Added: ${round(result.hookAddedMm, 2)} mm
Lap Added: ${round(result.lapAddedMm, 2)} mm
Bend Deduction: ${round(result.bendDeductionMm, 2)} mm

Cutting Length per Bar: ${round(result.cuttingLengthPerBarMm, 2)} mm
Number of Bars: ${round(result.bars, 0)}
Total Cutting Length: ${round(result.totalLengthMm, 2)} mm = ${round(result.totalLengthM, 3)} m
Steel Weight: ${round(result.totalSteelWeightKg, 3)} kg
Approx Cost: ₹${round(result.approxCost, 2)}

Remarks: ${result.remarks || "-"}`;

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
                Crank Bar Calculator
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                Calculate crank bar / bent-up bar cutting length with crank
                height, crank angle, hook length, lap length, bend deduction,
                total steel weight and approximate steel cost.
              </p>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                Straight length, crank height, angle और bar diameter डालकर
                Calculate button दबाओ। Output में diagram और step-by-step
                solution मिलेगा।
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-orange-400" size={34} />
                <div>
                  <h2 className="text-xl font-bold">Professional Output</h2>
                  <p className="text-sm text-slate-400">
                    Crank extra + cutting length + diagram
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-900 p-4">
                  <p className="text-slate-400">45° Crank</p>
                  <p className="mt-1 text-2xl font-black text-orange-400">
                    0.42H
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900 p-4">
                  <p className="text-slate-400">Formula</p>
                  <p className="mt-1 text-2xl font-black text-orange-400">
                    cosecθ-cotθ
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
                    <p className="text-xs text-slate-400">Length in mm</p>
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
                    <p className="text-xs text-slate-400">Length in ft / inch</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Bar Type
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  {barTypes.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleBarTypeChange(item.id)}
                      className={`rounded-xl border p-4 text-left transition ${
                        barType === item.id
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

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Main Straight Length {unitSystem === "metric" ? "(mm)" : "(ft)"}
                </label>

                <input
                  type="number"
                  value={straightLength}
                  onChange={(e) => {
                    setStraightLength(e.target.value);
                    clearResult();
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Crank Height Method
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setHeightMode("manual");
                      clearResult();
                    }}
                    className={`rounded-xl border p-4 text-left transition ${
                      heightMode === "manual"
                        ? "border-orange-400 bg-orange-500/15 text-orange-200"
                        : "border-slate-700 bg-slate-950 text-slate-300"
                    }`}
                  >
                    <p className="font-bold">Manual Height</p>
                    <p className="text-xs text-slate-400">Enter crank height</p>
                  </button>

                  <button
                    onClick={() => {
                      setHeightMode("auto");
                      clearResult();
                    }}
                    className={`rounded-xl border p-4 text-left transition ${
                      heightMode === "auto"
                        ? "border-orange-400 bg-orange-500/15 text-orange-200"
                        : "border-slate-700 bg-slate-950 text-slate-300"
                    }`}
                  >
                    <p className="font-bold">Auto Height</p>
                    <p className="text-xs text-slate-400">Thickness - covers - dia</p>
                  </button>
                </div>
              </div>

              {heightMode === "manual" ? (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Crank Height H {unitSystem === "metric" ? "(mm)" : "(inch)"}
                  </label>

                  <input
                    type="number"
                    value={crankHeight}
                    onChange={(e) => {
                      setCrankHeight(e.target.value);
                      clearResult();
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                  />
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      Thickness {unitSystem === "metric" ? "(mm)" : "(inch)"}
                    </label>

                    <input
                      type="number"
                      value={memberThickness}
                      onChange={(e) => {
                        setMemberThickness(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      Top Cover {unitSystem === "metric" ? "(mm)" : "(inch)"}
                    </label>

                    <input
                      type="number"
                      value={topCover}
                      onChange={(e) => {
                        setTopCover(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      Bottom Cover {unitSystem === "metric" ? "(mm)" : "(inch)"}
                    </label>

                    <input
                      type="number"
                      value={bottomCover}
                      onChange={(e) => {
                        setBottomCover(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Crank Angle
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  {angleOptions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setAngleType(item.id);
                        clearResult();
                      }}
                      className={`rounded-xl border p-4 text-left transition ${
                        angleType === item.id
                          ? "border-orange-400 bg-orange-500/15"
                          : "border-slate-700 bg-slate-950 hover:border-slate-500"
                      }`}
                    >
                      <p className="font-bold text-white">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {item.id === "45" ? "Common BBS: extra ≈ 0.42H" : "Angle based crank formula"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {angleType === "custom" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Custom Crank Angle degree
                  </label>

                  <input
                    type="number"
                    value={customAngle}
                    onChange={(e) => {
                      setCustomAngle(e.target.value);
                      clearResult();
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Number of Cranks
                </label>

                <input
                  type="number"
                  value={crankCount}
                  onChange={(e) => {
                    setCrankCount(e.target.value);
                    clearResult();
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Bar Diameter {unitSystem === "metric" ? "(mm)" : "(inch)"}
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
                  Bend Deduction
                </label>

                <select
                  value={bendType}
                  onChange={(e) => {
                    setBendType(e.target.value);
                    clearResult();
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                >
                  {bendOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} — {item.formula}
                    </option>
                  ))}
                </select>
              </div>

              {bendType !== "none" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Bend Count Method
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setBendCountMode("auto");
                        clearResult();
                      }}
                      className={`rounded-xl border p-4 text-left transition ${
                        bendCountMode === "auto"
                          ? "border-orange-400 bg-orange-500/15 text-orange-200"
                          : "border-slate-700 bg-slate-950 text-slate-300"
                      }`}
                    >
                      <p className="font-bold">Auto</p>
                      <p className="text-xs text-slate-400">2 bends per crank</p>
                    </button>

                    <button
                      onClick={() => {
                        setBendCountMode("manual");
                        clearResult();
                      }}
                      className={`rounded-xl border p-4 text-left transition ${
                        bendCountMode === "manual"
                          ? "border-orange-400 bg-orange-500/15 text-orange-200"
                          : "border-slate-700 bg-slate-950 text-slate-300"
                      }`}
                    >
                      <p className="font-bold">Manual</p>
                      <p className="text-xs text-slate-400">Enter bend count</p>
                    </button>
                  </div>
                </div>
              )}

              {bendType !== "none" && bendCountMode === "manual" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Manual Bend Count
                  </label>

                  <input
                    type="number"
                    value={manualBendCount}
                    onChange={(e) => {
                      setManualBendCount(e.target.value);
                      clearResult();
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                  />
                </div>
              )}

              {bendType === "custom" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Custom Bend Multiplier
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
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Hook Option
                </label>

                <select
                  value={hookOption}
                  onChange={(e) => {
                    setHookOption(e.target.value);
                    clearResult();
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                >
                  <option value="none">No Hook</option>
                  <option value="one">One Side Hook</option>
                  <option value="both">Both Side Hook</option>
                  <option value="custom">Custom Hook Count</option>
                </select>
              </div>

              {hookOption !== "none" && (
                <>
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
                      {hookTypes.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.title} — {item.formula}
                        </option>
                      ))}
                    </select>
                  </div>

                  {hookOption === "custom" && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-300">
                        Custom Hook Count
                      </label>

                      <input
                        type="number"
                        value={customHookCount}
                        onChange={(e) => {
                          setCustomHookCount(e.target.value);
                          clearResult();
                        }}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                      />
                    </div>
                  )}

                  {hookType === "custom" && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-300">
                        Custom Hook Multiplier
                      </label>

                      <input
                        type="number"
                        value={customHookMultiplier}
                        onChange={(e) => {
                          setCustomHookMultiplier(e.target.value);
                          clearResult();
                        }}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                      />
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Add Lap Length?
                </label>

                <select
                  value={addLap}
                  onChange={(e) => {
                    setAddLap(e.target.value);
                    clearResult();
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              {addLap === "yes" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      Lap Type
                    </label>

                    <select
                      value={lapType}
                      onChange={(e) => {
                        setLapType(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    >
                      {lapTypes.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      Number of Laps
                    </label>

                    <input
                      type="number"
                      value={lapCount}
                      onChange={(e) => {
                        setLapCount(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    />
                  </div>

                  {lapType === "custom" && (
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-300">
                        Custom Lap Length {unitSystem === "metric" ? "(mm)" : "(ft)"}
                      </label>

                      <input
                        type="number"
                        value={customLapLength}
                        onChange={(e) => {
                          setCustomLapLength(e.target.value);
                          clearResult();
                        }}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Number of Bars
                  </label>

                  <input
                    type="number"
                    value={numberOfBars}
                    onChange={(e) => {
                      setNumberOfBars(e.target.value);
                      clearResult();
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Steel Rate ₹/kg
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
                    placeholder="Example: CB1"
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
                    placeholder="Example: Slab S1"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Remarks, optional
                </label>

                <textarea
                  value={remarks}
                  onChange={(e) => {
                    setRemarks(e.target.value);
                    clearResult();
                  }}
                  className="min-h-[90px] w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                  placeholder="Example: Bent-up bar as per slab reinforcement drawing"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-200">
                  {error}
                </div>
              )}

              <button
                onClick={calculateCrankBar}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 px-5 py-4 text-lg font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              >
                <Calculator size={22} />
                Calculate Crank Bar Length
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Crank Bar Diagram</h2>
                  <p className="text-sm text-slate-400">
                    Diagram calculate ke baad selected crank type ke hisab se show hoga
                  </p>
                </div>

                <FileText className="text-orange-400" size={28} />
              </div>

              <CrankDiagram result={result} />
            </div>

            {result && (
              <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-slate-900 p-5 md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <CheckCircle className="text-orange-300" size={28} />
                  <div>
                    <h2 className="text-2xl font-black">Calculation Result</h2>
                    <p className="text-sm text-slate-400">
                      Crank bar output after calculation
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Cutting Length / Bar</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      {formatLength(result.cuttingLengthPerBarMm, result.unitSystem)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {formatSecondaryLength(result.cuttingLengthPerBarMm, result.unitSystem)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Crank Extra Length</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      {formatLength(result.totalCrankExtraMm, result.unitSystem)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Per crank = {formatDimension(result.extraPerCrankMm, result.unitSystem)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Total Cutting Length</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      {formatLength(result.totalLengthMm, result.unitSystem)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {formatSecondaryLength(result.totalLengthMm, result.unitSystem)}
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

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Inclined Length / Crank</p>
                    <p className="mt-2 text-2xl font-black text-orange-300">
                      {formatDimension(result.inclinedLengthPerCrankMm, result.unitSystem)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      H / sinθ
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Bend Deduction</p>
                    <p className="mt-2 text-2xl font-black text-orange-300">
                      {formatLength(result.bendDeductionMm, result.unitSystem)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {result.bendFormula}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Hook Added</p>
                    <p className="mt-2 text-2xl font-black text-orange-300">
                      {formatLength(result.hookAddedMm, result.unitSystem)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {result.hookFormula}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Lap Added</p>
                    <p className="mt-2 text-2xl font-black text-orange-300">
                      {formatLength(result.lapAddedMm, result.unitSystem)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {result.lapFormula}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
                  <h3 className="text-lg font-black text-orange-200">
                    Formula Used
                  </h3>

                  <div className="mt-3 space-y-2 text-sm leading-7 text-orange-50">
                    <p>Inclined Length per Crank = H / sinθ</p>
                    <p>Horizontal Projection = H / tanθ</p>
                    <p>Extra Length per Crank = H × (cosecθ - cotθ)</p>
                    <p>
                      Cutting Length = Straight Length + Crank Extra Length +
                      Hook Length + Lap Length - Bend Deduction
                    </p>
                    <p>Steel Weight = D² / 162 × Total Length in meter</p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                  <h3 className="mb-4 text-lg font-black">
                    Step-by-step Solution
                  </h3>

                  <div className="space-y-3 text-sm leading-7 text-slate-300">
                    <p>
                      <span className="font-bold text-white">Step 1:</span> Bar type = {result.barTypeTitle}
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 2:</span> Straight length ={" "}
                      <span className="font-bold text-orange-300">
                        {round(result.straightLengthMm, 2)} mm
                      </span>
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 3:</span> Crank height, H ={" "}
                      {round(result.crankHeightMm, 2)} mm
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 4:</span> Crank angle, θ ={" "}
                      {round(result.angleDeg, 2)}°
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 5:</span> Inclined length per crank = H / sinθ ={" "}
                      {round(result.inclinedLengthPerCrankMm, 2)} mm
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 6:</span> Horizontal projection = H / tanθ ={" "}
                      {round(result.horizontalProjectionPerCrankMm, 2)} mm
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 7:</span> Extra length per crank ={" "}
                      {round(result.extraPerCrankMm, 2)} mm. Factor ={" "}
                      {round(result.factor, 3)}H
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 8:</span> Total crank extra length ={" "}
                      {round(result.extraPerCrankMm, 2)} × {round(result.crankCount, 0)} ={" "}
                      <span className="font-bold text-orange-300">
                        {round(result.totalCrankExtraMm, 2)} mm
                      </span>
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 9:</span> Cutting length per bar ={" "}
                      {round(result.straightLengthMm, 2)} + {round(result.totalCrankExtraMm, 2)} +{" "}
                      {round(result.hookAddedMm, 2)} + {round(result.lapAddedMm, 2)} -{" "}
                      {round(result.bendDeductionMm, 2)} ={" "}
                      <span className="font-bold text-orange-300">
                        {round(result.cuttingLengthPerBarMm, 2)} mm
                      </span>
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 10:</span> Total cutting length ={" "}
                      {round(result.cuttingLengthPerBarMm, 2)} × {round(result.bars, 0)} ={" "}
                      <span className="font-bold text-orange-300">
                        {round(result.totalLengthMm, 2)} mm = {round(result.totalLengthM, 3)} m
                      </span>
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 11:</span> Steel weight = D² / 162 × total length ={" "}
                      {round(result.diaMm, 2)}² / 162 × {round(result.totalLengthM, 3)} ={" "}
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
              Crank bar calculation is used in slabs, beams, bent-up bars,
              negative reinforcement, BBS preparation and site bar cutting.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-3 flex items-center gap-2 text-orange-300">
              <Info size={20} />
              <h3 className="font-bold">Hindi Explanation</h3>
            </div>

            <p className="text-sm leading-7 text-slate-300">
              Crank bar में bar को ऊपर या नीचे bend किया जाता है। Crank के कारण
              inclined portion बनता है, इसलिए cutting length में extra length
              add होती है।
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-3 flex items-center gap-2 text-orange-300">
              <Info size={20} />
              <h3 className="font-bold">Engineering Note</h3>
            </div>

            <p className="text-sm leading-7 text-slate-300">
              Final crank bar cutting length should always be checked with
              structural drawings, BBS notes, slab thickness, covers and site
              bending practice.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
