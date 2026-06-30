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
    id: "straight",
    title: "Straight Bar",
    hindi: "स्ट्रेट बार",
    desc: "Simple straight reinforcement bar",
  },
  {
    id: "hooks",
    title: "Straight Bar with Hooks",
    hindi: "हुक वाला स्ट्रेट बार",
    desc: "Straight bar with one or both side hooks",
  },
  {
    id: "lbar",
    title: "L Bar / 90° Bend Bar",
    hindi: "L बार / 90° बेंड",
    desc: "Two-leg bent bar",
  },
  {
    id: "ubar",
    title: "U Bar",
    hindi: "U बार",
    desc: "U-shaped bar with two legs",
  },
  {
    id: "lap",
    title: "Bar with Lap Length",
    hindi: "लैप लेंथ वाला बार",
    desc: "Straight bar with lap length addition",
  },
  {
    id: "development",
    title: "Bar with Development Length",
    hindi: "डेवलपमेंट लेंथ वाला बार",
    desc: "Bar with anchorage/development length",
  },
  {
    id: "custom",
    title: "Custom BBS Bar",
    hindi: "कस्टम BBS बार",
    desc: "Manual base length with custom additions",
  },
];

const hookTypes = [
  {
    id: "hook90",
    title: "90° Hook",
    formula: "8d",
    multiplier: 8,
  },
  {
    id: "hook135",
    title: "135° Hook",
    formula: "6d",
    multiplier: 6,
  },
  {
    id: "hook180",
    title: "180° / U Hook",
    formula: "16d",
    multiplier: 16,
  },
  {
    id: "custom",
    title: "Custom Hook",
    formula: "Custom × d",
    multiplier: "custom",
  },
];

const bendOptions = [
  {
    id: "none",
    title: "No Bend Deduction",
    formula: "0",
    multiplier: 0,
  },
  {
    id: "45",
    title: "45° Bend",
    formula: "1d",
    multiplier: 1,
  },
  {
    id: "90",
    title: "90° Bend",
    formula: "2d",
    multiplier: 2,
  },
  {
    id: "135",
    title: "135° Bend",
    formula: "3d",
    multiplier: 3,
  },
  {
    id: "180",
    title: "180° Bend",
    formula: "4d",
    multiplier: 4,
  },
  {
    id: "custom",
    title: "Custom Bend Deduction",
    formula: "Custom × d",
    multiplier: "custom",
  },
];

const lapTypes = [
  {
    id: "40d",
    title: "40d Lap Length",
    multiplier: 40,
  },
  {
    id: "50d",
    title: "50d Lap Length",
    multiplier: 50,
  },
  {
    id: "custom",
    title: "Custom Lap Length",
    multiplier: "custom",
  },
];

const devTypes = [
  {
    id: "40d",
    title: "40d Development Length",
    multiplier: 40,
  },
  {
    id: "50d",
    title: "50d Development Length",
    multiplier: 50,
  },
  {
    id: "custom",
    title: "Custom Development Length",
    multiplier: "custom",
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

function barDiaToMm(value, unitSystem) {
  const num = toNumber(value);
  return unitSystem === "metric" ? num : num * MM_PER_INCH;
}

function lengthToMm(value, unitSystem) {
  const num = toNumber(value);
  return unitSystem === "metric" ? num : num * MM_PER_FT;
}

function formatLength(mm, unitSystem) {
  if (unitSystem === "imperial") {
    return `${round(mm / MM_PER_FT, 3)} ft`;
  }

  return `${round(mm, 1)} mm`;
}

function formatLengthSecondary(mm, unitSystem) {
  if (unitSystem === "imperial") {
    return `${round(mm / MM_PER_INCH, 2)} in`;
  }

  return `${round(mm / 1000, 3)} m`;
}

function CuttingDiagram({ result }) {
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

  if (result.barType === "lbar") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 460 320" className="h-[300px] w-full">
          <defs>
            <marker id="arrow-l" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <path
            d="M95 245 L315 245 Q350 245 350 210 L350 75"
            fill="none"
            stroke="#fb923c"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M95 245 L315 245 Q350 245 350 210 L350 75"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="3"
            opacity="0.85"
          />

          <line x1="95" y1="275" x2="350" y2="275" stroke="#38bdf8" strokeWidth="2" markerStart="url(#arrow-l)" markerEnd="url(#arrow-l)" />
          <line x1="385" y1="75" x2="385" y2="245" stroke="#38bdf8" strokeWidth="2" markerStart="url(#arrow-l)" markerEnd="url(#arrow-l)" />

          <text x="170" y="300" fill="#e0f2fe" fontSize="13" fontWeight="700">
            Leg A = {formatLength(result.legAMm, result.unitSystem)}
          </text>

          <text x="392" y="165" fill="#e0f2fe" fontSize="13" fontWeight="700">
            Leg B = {formatLength(result.legBMm, result.unitSystem)}
          </text>

          <text x="105" y="50" fill="#fdba74" fontSize="13" fontWeight="700">
            Cutting Length = {formatLength(result.cuttingLengthPerBarMm, result.unitSystem)}
          </text>
        </svg>
      </div>
    );
  }

  if (result.barType === "ubar") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 460 320" className="h-[300px] w-full">
          <defs>
            <marker id="arrow-u-cut" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <path
            d="M115 70 L115 215 Q115 250 150 250 L310 250 Q345 250 345 215 L345 70"
            fill="none"
            stroke="#fb923c"
            strokeWidth="18"
            strokeLinecap="round"
          />

          <path
            d="M115 70 L115 215 Q115 250 150 250 L310 250 Q345 250 345 215 L345 70"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="3"
            opacity="0.85"
          />

          <line x1="115" y1="282" x2="345" y2="282" stroke="#38bdf8" strokeWidth="2" markerStart="url(#arrow-u-cut)" markerEnd="url(#arrow-u-cut)" />
          <line x1="80" y1="70" x2="80" y2="250" stroke="#38bdf8" strokeWidth="2" markerStart="url(#arrow-u-cut)" markerEnd="url(#arrow-u-cut)" />

          <text x="185" y="305" fill="#e0f2fe" fontSize="13" fontWeight="700">
            Width = {formatLength(result.uWidthMm, result.unitSystem)}
          </text>

          <text x="20" y="165" fill="#e0f2fe" fontSize="13" fontWeight="700">
            Leg = {formatLength(result.uLegMm, result.unitSystem)}
          </text>

          <text x="125" y="45" fill="#fdba74" fontSize="13" fontWeight="700">
            Cutting Length = {formatLength(result.cuttingLengthPerBarMm, result.unitSystem)}
          </text>
        </svg>
      </div>
    );
  }

  if (result.barType === "lap") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 460 320" className="h-[300px] w-full">
          <defs>
            <marker id="arrow-lap" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <line x1="65" y1="145" x2="300" y2="145" stroke="#fb923c" strokeWidth="18" strokeLinecap="round" />
          <line x1="165" y1="185" x2="395" y2="185" stroke="#fdba74" strokeWidth="18" strokeLinecap="round" />

          <line x1="165" y1="220" x2="300" y2="220" stroke="#38bdf8" strokeWidth="2" markerStart="url(#arrow-lap)" markerEnd="url(#arrow-lap)" />

          <text x="188" y="245" fill="#e0f2fe" fontSize="13" fontWeight="700">
            Lap = {formatLength(result.lapAddedMm, result.unitSystem)}
          </text>

          <text x="85" y="105" fill="#cbd5e1" fontSize="13" fontWeight="600">
            Straight Length = {formatLength(result.baseLengthMm, result.unitSystem)}
          </text>

          <text x="105" y="285" fill="#fdba74" fontSize="13" fontWeight="700">
            Cutting Length = {formatLength(result.cuttingLengthPerBarMm, result.unitSystem)}
          </text>
        </svg>
      </div>
    );
  }

  if (result.barType === "development") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 460 320" className="h-[300px] w-full">
          <defs>
            <marker id="arrow-dev" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <rect x="285" y="80" width="105" height="150" fill="#1e293b" stroke="#475569" strokeWidth="2" rx="8" />
          <line x1="70" y1="155" x2="360" y2="155" stroke="#fb923c" strokeWidth="18" strokeLinecap="round" />
          <line x1="285" y1="190" x2="360" y2="190" stroke="#38bdf8" strokeWidth="2" markerStart="url(#arrow-dev)" markerEnd="url(#arrow-dev)" />

          <text x="297" y="215" fill="#e0f2fe" fontSize="13" fontWeight="700">
            Ld = {formatLength(result.developmentAddedMm, result.unitSystem)}
          </text>

          <text x="80" y="120" fill="#cbd5e1" fontSize="13" fontWeight="600">
            Main Length = {formatLength(result.baseLengthMm, result.unitSystem)}
          </text>

          <text x="100" y="275" fill="#fdba74" fontSize="13" fontWeight="700">
            Cutting Length = {formatLength(result.cuttingLengthPerBarMm, result.unitSystem)}
          </text>
        </svg>
      </div>
    );
  }

  if (result.barType === "hooks") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 460 320" className="h-[300px] w-full">
          <defs>
            <marker id="arrow-hooks" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <path
            d="M95 105 L95 185 Q95 220 130 220 L330 220 Q365 220 365 185 L365 105"
            fill="none"
            stroke="#fb923c"
            strokeWidth="18"
            strokeLinecap="round"
          />

          <path
            d="M95 105 L95 185 Q95 220 130 220 L330 220 Q365 220 365 185 L365 105"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="3"
            opacity="0.85"
          />

          <line x1="95" y1="255" x2="365" y2="255" stroke="#38bdf8" strokeWidth="2" markerStart="url(#arrow-hooks)" markerEnd="url(#arrow-hooks)" />

          <text x="150" y="280" fill="#e0f2fe" fontSize="13" fontWeight="700">
            Base Length = {formatLength(result.baseLengthMm, result.unitSystem)}
          </text>

          <text x="105" y="70" fill="#cbd5e1" fontSize="13" fontWeight="600">
            Hook Added = {formatLength(result.hookAddedMm, result.unitSystem)}
          </text>

          <text x="105" y="305" fill="#fdba74" fontSize="13" fontWeight="700">
            Cutting Length = {formatLength(result.cuttingLengthPerBarMm, result.unitSystem)}
          </text>
        </svg>
      </div>
    );
  }

  if (result.barType === "custom") {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <svg viewBox="0 0 460 320" className="h-[300px] w-full">
          <defs>
            <marker id="arrow-custom-cut" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
            </marker>
          </defs>

          <path
            d="M70 235 L150 90 L280 90 L380 170 L315 245 L160 260 Z"
            fill="none"
            stroke="#fb923c"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M70 235 L150 90 L280 90 L380 170 L315 245 L160 260 Z"
            fill="none"
            stroke="#fed7aa"
            strokeWidth="3"
            opacity="0.85"
          />

          <line x1="110" y1="285" x2="350" y2="285" stroke="#38bdf8" strokeWidth="2" markerStart="url(#arrow-custom-cut)" markerEnd="url(#arrow-custom-cut)" />

          <text x="130" y="305" fill="#fdba74" fontSize="13" fontWeight="700">
            Cutting Length = {formatLength(result.cuttingLengthPerBarMm, result.unitSystem)}
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <svg viewBox="0 0 460 320" className="h-[300px] w-full">
        <defs>
          <marker id="arrow-straight" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#fb923c" />
          </marker>
        </defs>

        <line x1="70" y1="160" x2="390" y2="160" stroke="#fb923c" strokeWidth="18" strokeLinecap="round" />
        <line x1="70" y1="205" x2="390" y2="205" stroke="#38bdf8" strokeWidth="2" markerStart="url(#arrow-straight)" markerEnd="url(#arrow-straight)" />

        <text x="145" y="230" fill="#e0f2fe" fontSize="13" fontWeight="700">
          Straight Length = {formatLength(result.baseLengthMm, result.unitSystem)}
        </text>

        <text x="105" y="115" fill="#cbd5e1" fontSize="13" fontWeight="600">
          d = {formatLength(result.diaMm, result.unitSystem)}
        </text>

        <text x="105" y="275" fill="#fdba74" fontSize="13" fontWeight="700">
          Cutting Length = {formatLength(result.cuttingLengthPerBarMm, result.unitSystem)}
        </text>
      </svg>
    </div>
  );
}

export default function CuttingLengthCalculatorPage() {
  const [unitSystem, setUnitSystem] = useState("metric");
  const [barType, setBarType] = useState("straight");

  const [straightLength, setStraightLength] = useState("3000");
  const [legA, setLegA] = useState("1500");
  const [legB, setLegB] = useState("1000");
  const [uWidth, setUWidth] = useState("600");
  const [uLeg, setULeg] = useState("1200");
  const [customBaseLength, setCustomBaseLength] = useState("3000");

  const [barDia, setBarDia] = useState("12");

  const [hookOption, setHookOption] = useState("none");
  const [hookType, setHookType] = useState("hook180");
  const [customHookMultiplier, setCustomHookMultiplier] = useState("9");
  const [customHookCount, setCustomHookCount] = useState("2");

  const [bendType, setBendType] = useState("none");
  const [bendCount, setBendCount] = useState("0");
  const [customBendMultiplier, setCustomBendMultiplier] = useState("2");

  const [addLap, setAddLap] = useState("no");
  const [lapType, setLapType] = useState("40d");
  const [lapCount, setLapCount] = useState("1");
  const [customLapLength, setCustomLapLength] = useState("600");

  const [addDevelopment, setAddDevelopment] = useState("no");
  const [developmentType, setDevelopmentType] = useState("40d");
  const [developmentSides, setDevelopmentSides] = useState("1");
  const [customDevelopmentLength, setCustomDevelopmentLength] = useState("600");

  const [numberOfBars, setNumberOfBars] = useState("1");
  const [steelRate, setSteelRate] = useState("60");

  const [barMark, setBarMark] = useState("");
  const [memberName, setMemberName] = useState("");
  const [remarks, setRemarks] = useState("");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedBarType = useMemo(() => {
    return barTypes.find((item) => item.id === barType) || barTypes[0];
  }, [barType]);

  const selectedHookType = useMemo(() => {
    return hookTypes.find((item) => item.id === hookType) || hookTypes[2];
  }, [hookType]);

  const selectedBendType = useMemo(() => {
    return bendOptions.find((item) => item.id === bendType) || bendOptions[0];
  }, [bendType]);

  const selectedLapType = useMemo(() => {
    return lapTypes.find((item) => item.id === lapType) || lapTypes[0];
  }, [lapType]);

  const selectedDevelopmentType = useMemo(() => {
    return devTypes.find((item) => item.id === developmentType) || devTypes[0];
  }, [developmentType]);

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
      setLegA("1500");
      setLegB("1000");
      setUWidth("600");
      setULeg("1200");
      setCustomBaseLength("3000");
      setCustomLapLength("600");
      setCustomDevelopmentLength("600");
      setBarDia("12");
    } else {
      setStraightLength("10");
      setLegA("5");
      setLegB("3");
      setUWidth("2");
      setULeg("4");
      setCustomBaseLength("10");
      setCustomLapLength("2");
      setCustomDevelopmentLength("2");
      setBarDia("0.5");
    }

    clearResult();
  }

  function handleBarTypeChange(type) {
    setBarType(type);

    if (type === "straight") {
      setHookOption("none");
      setBendType("none");
      setBendCount("0");
      setAddLap("no");
      setAddDevelopment("no");
    }

    if (type === "hooks") {
      setHookOption("both");
      setHookType("hook180");
      setBendType("none");
      setBendCount("0");
    }

    if (type === "lbar") {
      setHookOption("none");
      setBendType("90");
      setBendCount("1");
      setAddLap("no");
      setAddDevelopment("no");
    }

    if (type === "ubar") {
      setHookOption("none");
      setBendType("90");
      setBendCount("2");
      setAddLap("no");
      setAddDevelopment("no");
    }

    if (type === "lap") {
      setHookOption("none");
      setBendType("none");
      setBendCount("0");
      setAddLap("yes");
      setAddDevelopment("no");
    }

    if (type === "development") {
      setHookOption("none");
      setBendType("none");
      setBendCount("0");
      setAddLap("no");
      setAddDevelopment("yes");
    }

    clearResult();
  }

  function getHookCount() {
    if (hookOption === "none") return 0;
    if (hookOption === "one") return 1;
    if (hookOption === "both") return 2;
    return Math.max(toNumber(customHookCount), 0);
  }

  function getBaseLengthMm() {
    if (barType === "lbar") {
      return lengthToMm(legA, unitSystem) + lengthToMm(legB, unitSystem);
    }

    if (barType === "ubar") {
      return lengthToMm(uWidth, unitSystem) + 2 * lengthToMm(uLeg, unitSystem);
    }

    if (barType === "custom") {
      return lengthToMm(customBaseLength, unitSystem);
    }

    return lengthToMm(straightLength, unitSystem);
  }

  function getHookLengthMm(diaMm) {
    const hookCount = getHookCount();

    if (hookCount <= 0) {
      return {
        hookPerEndMm: 0,
        hookAddedMm: 0,
        hookCount,
        hookFormula: "No hook",
        hookMultiplier: 0,
      };
    }

    const hookMultiplier =
      selectedHookType.multiplier === "custom"
        ? Math.max(toNumber(customHookMultiplier), 0)
        : selectedHookType.multiplier;

    const hookPerEndMm = hookMultiplier * diaMm;

    return {
      hookPerEndMm,
      hookAddedMm: hookPerEndMm * hookCount,
      hookCount,
      hookFormula:
        selectedHookType.multiplier === "custom"
          ? `${round(hookMultiplier, 2)}d`
          : selectedHookType.formula,
      hookMultiplier,
    };
  }

  function getBendDeductionMm(diaMm) {
    if (bendType === "none") {
      return {
        bendDeductionMm: 0,
        bendFormula: "No bend deduction",
        bendMultiplier: 0,
      };
    }

    const count = Math.max(toNumber(bendCount), 0);
    const multiplier =
      selectedBendType.multiplier === "custom"
        ? Math.max(toNumber(customBendMultiplier), 0)
        : selectedBendType.multiplier;

    return {
      bendDeductionMm: multiplier * diaMm * count,
      bendFormula:
        selectedBendType.multiplier === "custom"
          ? `${round(multiplier, 2)}d × ${round(count, 0)} bends`
          : `${selectedBendType.formula} × ${round(count, 0)} bends`,
      bendMultiplier: multiplier,
    };
  }

  function getLapLengthMm(diaMm) {
    if (addLap !== "yes") {
      return {
        lapAddedMm: 0,
        lapPerLapMm: 0,
        lapFormula: "No lap length",
        lapCountValue: 0,
      };
    }

    const count = Math.max(toNumber(lapCount), 0);

    if (selectedLapType.multiplier === "custom") {
      const customLengthMm = lengthToMm(customLapLength, unitSystem);

      return {
        lapAddedMm: customLengthMm * count,
        lapPerLapMm: customLengthMm,
        lapFormula: `${formatLength(customLengthMm, unitSystem)} × ${round(
          count,
          0
        )} laps`,
        lapCountValue: count,
      };
    }

    const lapPerLapMm = selectedLapType.multiplier * diaMm;

    return {
      lapAddedMm: lapPerLapMm * count,
      lapPerLapMm,
      lapFormula: `${selectedLapType.multiplier}d × ${round(count, 0)} laps`,
      lapCountValue: count,
    };
  }

  function getDevelopmentLengthMm(diaMm) {
    if (addDevelopment !== "yes") {
      return {
        developmentAddedMm: 0,
        developmentPerSideMm: 0,
        developmentFormula: "No development length",
        developmentSidesValue: 0,
      };
    }

    const sides = Math.max(toNumber(developmentSides), 0);

    if (selectedDevelopmentType.multiplier === "custom") {
      const customLengthMm = lengthToMm(customDevelopmentLength, unitSystem);

      return {
        developmentAddedMm: customLengthMm * sides,
        developmentPerSideMm: customLengthMm,
        developmentFormula: `${formatLength(customLengthMm, unitSystem)} × ${round(
          sides,
          0
        )} side`,
        developmentSidesValue: sides,
      };
    }

    const developmentPerSideMm = selectedDevelopmentType.multiplier * diaMm;

    return {
      developmentAddedMm: developmentPerSideMm * sides,
      developmentPerSideMm,
      developmentFormula: `${selectedDevelopmentType.multiplier}d × ${round(
        sides,
        0
      )} side`,
      developmentSidesValue: sides,
    };
  }

  function calculateCuttingLength() {
    setError("");
    setCopied(false);

    const diaMm = barDiaToMm(barDia, unitSystem);
    const baseLengthMm = getBaseLengthMm();
    const bars = Math.max(toNumber(numberOfBars), 0);
    const rate = Math.max(toNumber(steelRate), 0);

    if (diaMm <= 0) {
      setError("Please enter valid bar diameter.");
      setResult(null);
      return;
    }

    if (baseLengthMm <= 0) {
      setError("Please enter valid base/straight length.");
      setResult(null);
      return;
    }

    if (bars <= 0) {
      setError("Please enter valid number of bars.");
      setResult(null);
      return;
    }

    const hook = getHookLengthMm(diaMm);

    if (hook.hookCount > 0 && hook.hookMultiplier <= 0) {
      setError("Please enter valid hook multiplier.");
      setResult(null);
      return;
    }

    const bend = getBendDeductionMm(diaMm);

    if (bendType !== "none" && toNumber(bendCount) <= 0) {
      setError("Please enter valid number of bends.");
      setResult(null);
      return;
    }

    const lap = getLapLengthMm(diaMm);

    if (addLap === "yes" && lap.lapCountValue <= 0) {
      setError("Please enter valid number of laps.");
      setResult(null);
      return;
    }

    const development = getDevelopmentLengthMm(diaMm);

    if (addDevelopment === "yes" && development.developmentSidesValue <= 0) {
      setError("Please enter valid development length sides.");
      setResult(null);
      return;
    }

    const cuttingLengthPerBarMm =
      baseLengthMm +
      hook.hookAddedMm +
      lap.lapAddedMm +
      development.developmentAddedMm -
      bend.bendDeductionMm;

    if (cuttingLengthPerBarMm <= 0) {
      setError("Calculated cutting length is invalid. Please check deductions.");
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
      diaMm,
      baseLengthMm,

      legAMm: lengthToMm(legA, unitSystem),
      legBMm: lengthToMm(legB, unitSystem),
      uWidthMm: lengthToMm(uWidth, unitSystem),
      uLegMm: lengthToMm(uLeg, unitSystem),

      hookTitle: selectedHookType.title,
      hookFormula: hook.hookFormula,
      hookPerEndMm: hook.hookPerEndMm,
      hookCount: hook.hookCount,
      hookAddedMm: hook.hookAddedMm,

      bendTitle: selectedBendType.title,
      bendFormula: bend.bendFormula,
      bendMultiplier: bend.bendMultiplier,
      bendCount: Math.max(toNumber(bendCount), 0),
      bendDeductionMm: bend.bendDeductionMm,

      lapFormula: lap.lapFormula,
      lapPerLapMm: lap.lapPerLapMm,
      lapCountValue: lap.lapCountValue,
      lapAddedMm: lap.lapAddedMm,

      developmentFormula: development.developmentFormula,
      developmentPerSideMm: development.developmentPerSideMm,
      developmentSidesValue: development.developmentSidesValue,
      developmentAddedMm: development.developmentAddedMm,

      cuttingLengthPerBarMm,
      bars,
      totalLengthMm,
      totalLengthM,
      unitWeightKgPerM,
      totalSteelWeightKg,
      approxCost,
      rate,

      barMark,
      memberName,
      remarks,
    });
  }

  function resetCalculator() {
    setUnitSystem("metric");
    setBarType("straight");
    setStraightLength("3000");
    setLegA("1500");
    setLegB("1000");
    setUWidth("600");
    setULeg("1200");
    setCustomBaseLength("3000");
    setBarDia("12");
    setHookOption("none");
    setHookType("hook180");
    setCustomHookMultiplier("9");
    setCustomHookCount("2");
    setBendType("none");
    setBendCount("0");
    setCustomBendMultiplier("2");
    setAddLap("no");
    setLapType("40d");
    setLapCount("1");
    setCustomLapLength("600");
    setAddDevelopment("no");
    setDevelopmentType("40d");
    setDevelopmentSides("1");
    setCustomDevelopmentLength("600");
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

    const text = `CivilCalc Pro - Cutting Length Calculator

Bar Mark: ${result.barMark || "-"}
Member Name: ${result.memberName || "-"}
Bar Type: ${result.barTypeTitle}
Bar Diameter: ${round(result.diaMm, 2)} mm

Base Length: ${round(result.baseLengthMm, 2)} mm
Hook Added: ${round(result.hookAddedMm, 2)} mm
Lap Added: ${round(result.lapAddedMm, 2)} mm
Development Added: ${round(result.developmentAddedMm, 2)} mm
Bend Deduction: ${round(result.bendDeductionMm, 2)} mm

Cutting Length per Bar: ${round(result.cuttingLengthPerBarMm, 2)} mm
Number of Bars: ${round(result.bars, 0)}
Total Cutting Length: ${round(result.totalLengthMm, 2)} mm = ${round(
      result.totalLengthM,
      3
    )} m
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
                Cutting Length Calculator
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                Calculate reinforcement bar cutting length with hooks, bends,
                lap length, development length, total steel weight and
                approximate steel cost.
              </p>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                Bar length, diameter, hook, bend deduction, lap/development
                details डालकर Calculate button दबाओ। Output में diagram और
                step-by-step solution मिलेगा।
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-orange-400" size={34} />
                <div>
                  <h2 className="text-xl font-bold">Professional Output</h2>
                  <p className="text-sm text-slate-400">
                    Cutting length + diagram + steel weight
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-900 p-4">
                  <p className="text-slate-400">Formula</p>
                  <p className="mt-1 text-2xl font-black text-orange-400">
                    L + H - BD
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900 p-4">
                  <p className="text-slate-400">Weight</p>
                  <p className="mt-1 text-2xl font-black text-orange-400">
                    D²/162
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
                    <p className="text-xs text-slate-400">Length in ft</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Bar Type / Calculation Type
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

              {["straight", "hooks", "lap", "development"].includes(barType) && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Straight Length {unitSystem === "metric" ? "(mm)" : "(ft)"}
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
              )}

              {barType === "lbar" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      Leg A {unitSystem === "metric" ? "(mm)" : "(ft)"}
                    </label>

                    <input
                      type="number"
                      value={legA}
                      onChange={(e) => {
                        setLegA(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      Leg B {unitSystem === "metric" ? "(mm)" : "(ft)"}
                    </label>

                    <input
                      type="number"
                      value={legB}
                      onChange={(e) => {
                        setLegB(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    />
                  </div>
                </div>
              )}

              {barType === "ubar" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      U Bar Width {unitSystem === "metric" ? "(mm)" : "(ft)"}
                    </label>

                    <input
                      type="number"
                      value={uWidth}
                      onChange={(e) => {
                        setUWidth(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      U Bar Leg Height {unitSystem === "metric" ? "(mm)" : "(ft)"}
                    </label>

                    <input
                      type="number"
                      value={uLeg}
                      onChange={(e) => {
                        setULeg(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    />
                  </div>
                </div>
              )}

              {barType === "custom" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Manual Base Length {unitSystem === "metric" ? "(mm)" : "(ft)"}
                  </label>

                  <input
                    type="number"
                    value={customBaseLength}
                    onChange={(e) => {
                      setCustomBaseLength(e.target.value);
                      clearResult();
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                  />
                </div>
              )}

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
                  Bend Deduction
                </label>

                <select
                  value={bendType}
                  onChange={(e) => {
                    setBendType(e.target.value);
                    if (e.target.value === "none") setBendCount("0");
                    if (e.target.value !== "none" && bendCount === "0") setBendCount("1");
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      Number of Bends
                    </label>

                    <input
                      type="number"
                      value={bendCount}
                      onChange={(e) => {
                        setBendCount(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    />
                  </div>

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
                </div>
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

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Add Development Length?
                </label>

                <select
                  value={addDevelopment}
                  onChange={(e) => {
                    setAddDevelopment(e.target.value);
                    clearResult();
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              {addDevelopment === "yes" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      Development Length Type
                    </label>

                    <select
                      value={developmentType}
                      onChange={(e) => {
                        setDevelopmentType(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    >
                      {devTypes.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      Development Sides
                    </label>

                    <select
                      value={developmentSides}
                      onChange={(e) => {
                        setDevelopmentSides(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    >
                      <option value="1">One Side</option>
                      <option value="2">Both Side</option>
                    </select>
                  </div>

                  {developmentType === "custom" && (
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-300">
                        Custom Development Length{" "}
                        {unitSystem === "metric" ? "(mm)" : "(ft)"}
                      </label>

                      <input
                        type="number"
                        value={customDevelopmentLength}
                        onChange={(e) => {
                          setCustomDevelopmentLength(e.target.value);
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
                    placeholder="Example: B1"
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
                  placeholder="Example: As per structural drawing"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-200">
                  {error}
                </div>
              )}

              <button
                onClick={calculateCuttingLength}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 px-5 py-4 text-lg font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              >
                <Calculator size={22} />
                Calculate Cutting Length
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Bar Diagram</h2>
                  <p className="text-sm text-slate-400">
                    Diagram calculate ke baad selected bar type ke hisab se show hoga
                  </p>
                </div>

                <FileText className="text-orange-400" size={28} />
              </div>

              <CuttingDiagram result={result} />
            </div>

            {result && (
              <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-slate-900 p-5 md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <CheckCircle className="text-orange-300" size={28} />
                  <div>
                    <h2 className="text-2xl font-black">Calculation Result</h2>
                    <p className="text-sm text-slate-400">
                      Cutting length output after calculation
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
                      {formatLengthSecondary(
                        result.cuttingLengthPerBarMm,
                        result.unitSystem
                      )}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Number of Bars</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      {round(result.bars, 0)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {result.barTypeTitle}
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

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
                    <p className="text-sm text-slate-400">Bend Deduction</p>
                    <p className="mt-2 text-2xl font-black text-orange-300">
                      {formatLength(result.bendDeductionMm, result.unitSystem)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {result.bendFormula}
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

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Development Added</p>
                    <p className="mt-2 text-2xl font-black text-orange-300">
                      {formatLength(result.developmentAddedMm, result.unitSystem)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {result.developmentFormula}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
                  <h3 className="text-lg font-black text-orange-200">
                    Formula Used
                  </h3>

                  <div className="mt-3 space-y-2 text-sm leading-7 text-orange-50">
                    <p>
                      Cutting Length = Base Length + Hook Length + Lap Length +
                      Development Length - Bend Deduction
                    </p>
                    <p>
                      Total Cutting Length = Cutting Length per Bar × Number of Bars
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
                      <span className="font-bold text-white">Step 1:</span> Bar
                      type = {result.barTypeTitle}
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 2:</span> Bar
                      diameter, d = {round(result.diaMm, 2)} mm
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 3:</span> Base
                      length ={" "}
                      <span className="font-bold text-orange-300">
                        {round(result.baseLengthMm, 2)} mm
                      </span>
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 4:</span> Hook
                      length added = {round(result.hookAddedMm, 2)} mm
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 5:</span> Lap
                      length added = {round(result.lapAddedMm, 2)} mm
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 6:</span>{" "}
                      Development length added ={" "}
                      {round(result.developmentAddedMm, 2)} mm
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 7:</span> Bend
                      deduction = {round(result.bendDeductionMm, 2)} mm
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 8:</span>{" "}
                      Cutting length per bar = {round(result.baseLengthMm, 2)} +{" "}
                      {round(result.hookAddedMm, 2)} +{" "}
                      {round(result.lapAddedMm, 2)} +{" "}
                      {round(result.developmentAddedMm, 2)} -{" "}
                      {round(result.bendDeductionMm, 2)} ={" "}
                      <span className="font-bold text-orange-300">
                        {round(result.cuttingLengthPerBarMm, 2)} mm
                      </span>
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 9:</span> Total
                      cutting length = {round(result.cuttingLengthPerBarMm, 2)} ×{" "}
                      {round(result.bars, 0)} ={" "}
                      <span className="font-bold text-orange-300">
                        {round(result.totalLengthMm, 2)} mm ={" "}
                        {round(result.totalLengthM, 3)} m
                      </span>
                    </p>

                    <p>
                      <span className="font-bold text-white">Step 10:</span> Steel
                      weight = D² / 162 × total length ={" "}
                      {round(result.diaMm, 2)}² / 162 ×{" "}
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
              Cutting length is used in BBS preparation, beam bars, slab bars,
              column bars, footing reinforcement, lap bars and development
              length detailing.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-3 flex items-center gap-2 text-orange-300">
              <Info size={20} />
              <h3 className="font-bold">Hindi Explanation</h3>
            </div>

            <p className="text-sm leading-7 text-slate-300">
              Cutting length bar की actual काटने वाली length होती है। इसमें
              straight length के साथ hook, lap और development length add होती है
              और bend deduction minus होता है।
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-3 flex items-center gap-2 text-orange-300">
              <Info size={20} />
              <h3 className="font-bold">Engineering Note</h3>
            </div>

            <p className="text-sm leading-7 text-slate-300">
              Final cutting length should always be checked with structural
              drawings, BBS notes, IS code requirements and consultant
              specifications.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
