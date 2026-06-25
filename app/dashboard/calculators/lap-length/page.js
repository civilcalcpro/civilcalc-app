"use client";

import { useMemo, useState } from "react";
import jsPDF from "jspdf";

const concreteBondStress = {
  M15: 1.0,
  M20: 1.2,
  M25: 1.4,
  M30: 1.5,
  M35: 1.7,
  M40: 1.9,
};

const steelGrades = {
  Fe250: 250,
  Fe415: 415,
  Fe500: 500,
  Fe550: 550,
};

const diameters = [8, 10, 12, 16, 20, 25, 28, 32, 36, 40];

const outputUnits = ["mm", "cm", "m", "inch", "ft"];

function roundUp(value, interval) {
  const safeInterval = Number(interval) || 25;
  return Math.ceil(value / safeInterval) * safeInterval;
}

function convertLength(mm, unit) {
  const value = Number(mm || 0);

  if (unit === "cm") return value / 10;
  if (unit === "m") return value / 1000;
  if (unit === "inch") return value / 25.4;
  if (unit === "ft") return value / 304.8;

  return value;
}

function formatLength(mm, unit = "mm") {
  const converted = convertLength(mm, unit);

  if (unit === "mm") return `${converted.toFixed(0)} mm`;
  if (unit === "cm") return `${converted.toFixed(1)} cm`;
  if (unit === "m") return `${converted.toFixed(3)} m`;
  if (unit === "inch") return `${converted.toFixed(2)} inch`;
  if (unit === "ft") return `${converted.toFixed(2)} ft`;

  return `${converted.toFixed(0)} mm`;
}

export default function LapLengthCalculator() {
  const [form, setForm] = useState({
    barDiameter1: 16,
    barDiameter2: 16,
    steelGrade: "Fe415",
    concreteGrade: "M20",
    barType: "Deformed Bar",
    lapCondition: "Flexural Tension",
    memberType: "Column",
    lapLocation: "Normal",
    numberOfLaps: 1,
    barsLappedAtSection: "50% or less",
    preferredUnit: "mm",
    roundingInterval: 25,
  });

  const updateForm = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const result = useMemo(() => {
    const dia1 = Number(form.barDiameter1 || 0);
    const dia2 = Number(form.barDiameter2 || 0);
    const governingDia = Math.min(dia1, dia2);

    const fy = steelGrades[form.steelGrade] || 415;
    const baseBondStress = concreteBondStress[form.concreteGrade] || 1.2;

    const steelStress = 0.87 * fy;

    const deformedMultiplier = form.barType === "Deformed Bar" ? 1.6 : 1;

    const tensionBondStress = baseBondStress * deformedMultiplier;
    const compressionBondStress = tensionBondStress * 1.25;

    const ldTension =
      (governingDia * steelStress) / (4 * tensionBondStress);

    const ldCompression =
      (governingDia * steelStress) / (4 * compressionBondStress);

    const min30D = 30 * governingDia;
    const min24D = 24 * governingDia;
    const minStraightLap = Math.max(15 * governingDia, 200);

    let baseLapLength = 0;
    let ruleApplied = "";
    let ldReference = ldTension;

    if (form.lapCondition === "Flexural Tension") {
      baseLapLength = Math.max(ldTension, min30D);
      ruleApplied = "Lap length = max(Ld in tension, 30D)";
      ldReference = ldTension;
    }

    if (form.lapCondition === "Direct Tension") {
      baseLapLength = Math.max(2 * ldTension, min30D);
      ruleApplied = "Lap length = max(2Ld in tension, 30D)";
      ldReference = ldTension;
    }

    if (form.lapCondition === "Compression") {
      baseLapLength = Math.max(ldCompression, min24D);
      ruleApplied = "Lap length = max(Ld in compression, 24D)";
      ldReference = ldCompression;
    }

    let locationFactor = 1;
    let locationNote = "Normal lap condition selected. No extra location factor applied.";

    if (form.lapLocation === "Top Bar With Low Cover") {
      locationFactor = 1.4;
      locationNote =
        "Top bar with low cover selected. Lap length increased by 1.4 factor.";
    }

    if (form.lapLocation === "Corner / Close Lap") {
      locationFactor = 1.4;
      locationNote =
        "Corner or closely spaced lap selected. Lap length increased by 1.4 factor.";
    }

    if (form.lapLocation === "Both Critical Conditions") {
      locationFactor = 2.0;
      locationNote =
        "Both critical lap conditions selected. Lap length increased by 2.0 factor.";
    }

    const factoredLapLength = baseLapLength * locationFactor;

    const recommendedLapLength = roundUp(
      factoredLapLength,
      Number(form.roundingInterval || 25)
    );

    const totalLapLength =
      recommendedLapLength * Number(form.numberOfLaps || 1);

    const staggerDistance = recommendedLapLength * 1.3;

    let siteNote = "";

    if (form.memberType === "Column") {
      siteNote =
        "Column bars ke lap ko preferably same level par mat rakho. Laps ko stagger karo aur beam-column joint zone me lap avoid karo as per structural drawing.";
    } else if (form.memberType === "Beam") {
      siteNote =
        "Beam reinforcement me lap ko maximum bending moment zone me avoid karo. Bottom/top bars ke lap location structural drawing ke according verify karo.";
    } else if (form.memberType === "Slab") {
      siteNote =
        "Slab bars me lap length provide karte time spacing, cover aur alternate lap staggering ka dhyan rakho.";
    } else if (form.memberType === "Footing") {
      siteNote =
        "Footing/dowel bars me lap aur anchorage structural drawing ke according check karo. Column dowels ke lap me proper confinement maintain karo.";
    } else if (form.memberType === "Staircase") {
      siteNote =
        "Staircase reinforcement me lap location support zone aur main tension zone ke according carefully check karo.";
    } else {
      siteNote =
        "Lap length ko site execution se pehle structural drawing aur engineer ke detailing notes ke saath verify karo.";
    }

    const warnings = [];

    if (dia1 > 36 || dia2 > 36) {
      warnings.push(
        "Bars larger than 36 mm ke liye lap splice generally avoid hota hai. Welding, mechanical coupler ya special detailing required ho sakti hai."
      );
    }

    if (form.barsLappedAtSection !== "50% or less") {
      warnings.push(
        "Ek hi section par 50% se zyada bars lap karna avoid karo. Special precautions, staggered laps ya additional confinement required ho sakta hai."
      );
    }

    if (dia1 !== dia2) {
      warnings.push(
        `Different diameter bars selected. Lap length smaller diameter ${governingDia} mm ke basis par calculate ki gayi hai.`
      );
    }

    const examSteps = [
      `Given: Bar diameters = ${dia1} mm and ${dia2} mm`,
      `Governing bar diameter = smaller diameter = ${governingDia} mm`,
      `Steel grade = ${form.steelGrade}, fy = ${fy} N/mm²`,
      `Concrete grade = ${form.concreteGrade}, base bond stress = ${baseBondStress} N/mm²`,
      `Steel stress: σs = 0.87 × fy = 0.87 × ${fy} = ${steelStress.toFixed(
        2
      )} N/mm²`,
      `Tension bond stress = ${tensionBondStress.toFixed(2)} N/mm²`,
      `Ld in tension = D × σs / 4τbd = ${ldTension.toFixed(0)} mm`,
      `Selected condition = ${form.lapCondition}`,
      `Rule applied: ${ruleApplied}`,
      `Base lap length = ${baseLapLength.toFixed(0)} mm`,
      `Location factor = ${locationFactor}`,
      `Calculated lap length = ${factoredLapLength.toFixed(0)} mm`,
      `Recommended site lap length = ${recommendedLapLength.toFixed(0)} mm`,
    ];

    return {
      dia1,
      dia2,
      governingDia,
      fy,
      baseBondStress,
      steelStress,
      tensionBondStress,
      compressionBondStress,
      ldTension,
      ldCompression,
      ldReference,
      min30D,
      min24D,
      minStraightLap,
      baseLapLength,
      locationFactor,
      locationNote,
      factoredLapLength,
      recommendedLapLength,
      totalLapLength,
      staggerDistance,
      ruleApplied,
      siteNote,
      warnings,
      examSteps,
    };
  }, [form]);

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;

    const orange = [255, 122, 0];
    const navy = [5, 11, 31];
    const dark = [15, 23, 42];
    const grey = [100, 116, 139];

    const safeText = (value) =>
      String(value ?? "-")
        .replace(/₹/g, "Rs.")
        .replace(/σ/g, "sigma")
        .replace(/τ/g, "tau")
        .replace(/φ/g, "D")
        .replace(/²/g, "2")
        .replace(/–/g, "-")
        .replace(/—/g, "-");

    let y = 0;

    const checkPage = (needed = 12) => {
      if (y + needed > pageHeight - 18) {
        doc.addPage();
        y = 18;
      }
    };

    const title = (text) => {
      checkPage(16);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...dark);
      doc.text(safeText(text), margin, y);
      y += 8;
    };

    const row = (label, value) => {
      checkPage(8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...grey);
      doc.text(safeText(label), margin, y);
      doc.setTextColor(...dark);
      doc.text(safeText(value), 82, y);
      y += 7;
    };

    const paragraph = (text) => {
      checkPage(16);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...dark);
      const lines = doc.splitTextToSize(safeText(text), pageWidth - margin * 2);
      doc.text(lines, margin, y);
      y += lines.length * 6 + 4;
    };

    doc.setFillColor(...navy);
    doc.rect(0, 0, pageWidth, 36, "F");

    doc.setTextColor(...orange);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CivilCalc Pro", margin, 14);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("Lap Length Calculation Report", margin, 25);

    y = 48;

    title("Input Details");
    row("Bar Diameter 1", `${form.barDiameter1} mm`);
    row("Bar Diameter 2", `${form.barDiameter2} mm`);
    row("Governing Diameter", `${result.governingDia} mm`);
    row("Steel Grade", form.steelGrade);
    row("Concrete Grade", form.concreteGrade);
    row("Bar Type", form.barType);
    row("Lap Condition", form.lapCondition);
    row("Member Type", form.memberType);
    row("Lap Location", form.lapLocation);
    row("Number of Laps", form.numberOfLaps);

    y += 5;

    title("Result Summary");
    row("Required Lap Length", formatLength(result.factoredLapLength, "mm"));
    row("Recommended Site Lap", formatLength(result.recommendedLapLength, "mm"));
    row("Preferred Unit Output", formatLength(result.recommendedLapLength, form.preferredUnit));
    row("Lap Length in D", `${(result.recommendedLapLength / result.governingDia).toFixed(1)}D`);
    row("Total Lap Length", formatLength(result.totalLapLength, "mm"));
    row("Stagger Distance", formatLength(result.staggerDistance, "mm"));
    row("Rule Applied", result.ruleApplied);

    y += 5;

    title("Step-by-step Calculation");
    result.examSteps.forEach((step, index) => {
      paragraph(`${index + 1}. ${step}`);
    });

    y += 3;

    title("Site Recommendation");
    paragraph(result.siteNote);

    if (result.warnings.length > 0) {
      title("Warnings");
      result.warnings.forEach((warning, index) => {
        paragraph(`${index + 1}. ${warning}`);
      });
    }

    checkPage(16);
    doc.setFontSize(8);
    doc.setTextColor(...grey);
    doc.text(
      "Generated by CivilCalc Pro. This is a calculation aid. Verify final RCC detailing with structural drawings and qualified engineer.",
      margin,
      pageHeight - 10
    );

    doc.save("civilcalc-lap-length-report.pdf");
  };

  return (
    <main className="min-h-screen bg-[#050B1F] text-white px-4 py-6 md:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-white/5 p-6">
          <p className="text-orange-400 text-sm font-black tracking-wide">
            RCC REINFORCEMENT DETAILING
          </p>

          <h1 className="text-3xl md:text-5xl font-black mt-2">
            Lap Length Calculator
          </h1>

          <p className="text-slate-300 mt-4 max-w-4xl leading-7">
            RCC bars ke overlap/splice length ko calculate karo with English +
            Hindi input, unit conversion, step-by-step solution, site
            recommendation, warning system and PDF report.
          </p>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1 space-y-6">
            <Panel title="Input Details / इनपुट डिटेल्स">
              <Select
                label="Bar Diameter 1 / पहला बार डायमीटर"
                value={form.barDiameter1}
                onChange={(v) => updateForm("barDiameter1", Number(v))}
                options={diameters}
                suffix="mm"
              />

              <Select
                label="Bar Diameter 2 / दूसरा बार डायमीटर"
                value={form.barDiameter2}
                onChange={(v) => updateForm("barDiameter2", Number(v))}
                options={diameters}
                suffix="mm"
              />

              <Select
                label="Steel Grade / स्टील ग्रेड"
                value={form.steelGrade}
                onChange={(v) => updateForm("steelGrade", v)}
                options={Object.keys(steelGrades)}
              />

              <Select
                label="Concrete Grade / कंक्रीट ग्रेड"
                value={form.concreteGrade}
                onChange={(v) => updateForm("concreteGrade", v)}
                options={Object.keys(concreteBondStress)}
              />

              <Select
                label="Bar Type / बार टाइप"
                value={form.barType}
                onChange={(v) => updateForm("barType", v)}
                options={["Deformed Bar", "Plain Bar"]}
              />

              <Select
                label="Lap Condition / लैप कंडीशन"
                value={form.lapCondition}
                onChange={(v) => updateForm("lapCondition", v)}
                options={["Flexural Tension", "Direct Tension", "Compression"]}
              />

              <Select
                label="Member Type / मेंबर टाइप"
                value={form.memberType}
                onChange={(v) => updateForm("memberType", v)}
                options={[
                  "Column",
                  "Beam",
                  "Slab",
                  "Footing",
                  "Staircase",
                  "General RCC",
                ]}
              />

              <Select
                label="Lap Location / लैप लोकेशन"
                value={form.lapLocation}
                onChange={(v) => updateForm("lapLocation", v)}
                options={[
                  "Normal",
                  "Top Bar With Low Cover",
                  "Corner / Close Lap",
                  "Both Critical Conditions",
                ]}
              />

              <Select
                label="Bars Lapped at Same Section / एक सेक्शन पर लैप बार"
                value={form.barsLappedAtSection}
                onChange={(v) => updateForm("barsLappedAtSection", v)}
                options={["50% or less", "More than 50%"]}
              />

              <NumberInput
                label="Number of Laps / लैप की संख्या"
                value={form.numberOfLaps}
                onChange={(v) => updateForm("numberOfLaps", v)}
                min="1"
              />

              <Select
                label="Preferred Output Unit / आउटपुट यूनिट"
                value={form.preferredUnit}
                onChange={(v) => updateForm("preferredUnit", v)}
                options={outputUnits}
              />

              <Select
                label="Site Rounding / साइट राउंडिंग"
                value={form.roundingInterval}
                onChange={(v) => updateForm("roundingInterval", Number(v))}
                options={[10, 25, 50, 100]}
                suffix="mm"
              />

              <button
                onClick={downloadPDF}
                className="w-full rounded-2xl bg-orange-500 hover:bg-orange-600 py-4 font-black transition"
              >
                Download PDF Report
              </button>
            </Panel>

            <Panel title="Formula Used / फार्मूला">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-orange-400 font-mono text-base overflow-x-auto">
                Ld = D × σs / 4τbd
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <p>D = Governing bar diameter</p>
                <p>σs = 0.87 × fy</p>
                <p>τbd = Design bond stress</p>
                <p>Lap = based on tension / compression condition</p>
              </div>
            </Panel>
          </div>

          <div className="xl:col-span-2 space-y-6">
            <Panel title="Result Summary / रिजल्ट">
              <div className="rounded-3xl border border-orange-500/40 bg-orange-500/10 p-5">
                <p className="text-orange-300 font-bold">
                  Recommended Lap Length / साइट पर रखने योग्य लैप
                </p>

                <h2 className="text-4xl md:text-5xl font-black text-orange-400 mt-2">
                  {formatLength(result.recommendedLapLength, form.preferredUnit)}
                </h2>

                <p className="text-slate-400 mt-3">
                  Exact calculated lap:{" "}
                  <span className="text-white font-bold">
                    {formatLength(result.factoredLapLength, "mm")}
                  </span>
                </p>

                <p className="text-slate-400 mt-1">
                  Governing diameter:{" "}
                  <span className="text-white font-bold">
                    {result.governingDia} mm
                  </span>
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Mini
                  label="Lap Length in mm"
                  value={formatLength(result.recommendedLapLength, "mm")}
                />

                <Mini
                  label="Lap Length in meter"
                  value={formatLength(result.recommendedLapLength, "m")}
                />

                <Mini
                  label="Lap Length in feet"
                  value={formatLength(result.recommendedLapLength, "ft")}
                />

                <Mini
                  label="Lap Length in D"
                  value={`${(
                    result.recommendedLapLength / result.governingDia
                  ).toFixed(1)}D`}
                />

                <Mini
                  label="Stagger Distance"
                  value={formatLength(result.staggerDistance, "mm")}
                />

                <Mini
                  label="Total for Laps"
                  value={formatLength(result.totalLapLength, form.preferredUnit)}
                />
              </div>
            </Panel>

            <Panel title="Unit Conversion / यूनिट कन्वर्जन">
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <Mini
                  label="Millimeter"
                  value={formatLength(result.recommendedLapLength, "mm")}
                />
                <Mini
                  label="Centimeter"
                  value={formatLength(result.recommendedLapLength, "cm")}
                />
                <Mini
                  label="Meter"
                  value={formatLength(result.recommendedLapLength, "m")}
                />
                <Mini
                  label="Inch"
                  value={formatLength(result.recommendedLapLength, "inch")}
                />
                <Mini
                  label="Feet"
                  value={formatLength(result.recommendedLapLength, "ft")}
                />
              </div>
            </Panel>

            <Panel title="Engineering Values / इंजीनियरिंग वैल्यू">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Mini
                  label="Ld in Tension"
                  value={formatLength(result.ldTension, "mm")}
                />

                <Mini
                  label="Ld in Compression"
                  value={formatLength(result.ldCompression, "mm")}
                />

                <Mini
                  label="30D Minimum"
                  value={formatLength(result.min30D, "mm")}
                />

                <Mini
                  label="24D Minimum"
                  value={formatLength(result.min24D, "mm")}
                />

                <Mini
                  label="Minimum Straight Lap"
                  value={formatLength(result.minStraightLap, "mm")}
                />

                <Mini
                  label="Location Factor"
                  value={`${result.locationFactor} ×`}
                />
              </div>
            </Panel>

            <Panel title="Rule Applied / लागू नियम">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <p className="text-orange-400 font-black">
                  {result.ruleApplied}
                </p>

                <p className="text-slate-300 mt-3 leading-7">
                  {result.locationNote}
                </p>

                <p className="text-slate-300 mt-3 leading-7">
                  Different diameter bars ke case me lap length smaller diameter
                  ke basis par calculate hoti hai.
                </p>
              </div>
            </Panel>

            <Panel title="Step-by-step Calculation / स्टेप बाय स्टेप">
              <div className="space-y-3">
                {result.examSteps.map((line, index) => (
                  <div
                    key={`${line}-${index}`}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <p className="text-orange-400 font-bold">
                      Step {index + 1}
                    </p>
                    <p className="text-slate-300 mt-1">{line}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Site Recommendation / साइट नोट">
              <p className="text-slate-300 leading-8">{result.siteNote}</p>

              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-orange-400 font-bold">
                  Practical Note / प्रैक्टिकल नोट
                </p>
                <p className="text-slate-300 mt-2 leading-7">
                  Recommended lap length ko site par usually rounded value me
                  use karo, laps ko stagger karo, aur ek hi section par saare
                  bars lap mat karo.
                </p>
              </div>
            </Panel>

            {result.warnings.length > 0 && (
              <Panel title="Warnings / सावधानी">
                <div className="space-y-3">
                  {result.warnings.map((warning, index) => (
                    <div
                      key={`${warning}-${index}`}
                      className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4"
                    >
                      <p className="text-yellow-300 font-bold">
                        Warning {index + 1}
                      </p>
                      <p className="text-yellow-100 mt-2 leading-7">
                        {warning}
                      </p>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            <Panel title="Exam Answer Format / एग्जाम आंसर">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-300 leading-8">
                <p>
                  Given: Bar diameter = {result.governingDia} mm, Steel grade ={" "}
                  {form.steelGrade}, Concrete grade = {form.concreteGrade}
                </p>
                <p>Condition: {form.lapCondition}</p>
                <p>Formula: {result.ruleApplied}</p>
                <p>
                  Calculated Lap Length ={" "}
                  {formatLength(result.factoredLapLength, "mm")}
                </p>
                <p>
                  Recommended Site Lap Length ={" "}
                  {formatLength(result.recommendedLapLength, "mm")}
                </p>
              </div>
            </Panel>

            <Panel title="Important Notes / जरूरी बातें">
              <ul className="list-disc pl-6 space-y-3 text-slate-300 leading-7">
                <li>
                  Lap length final karne se pehle structural drawing aur bar
                  bending schedule check karna zaroori hai.
                </li>
                <li>
                  Lap ko maximum stress zone me avoid karna chahiye wherever
                  possible.
                </li>
                <li>
                  Column, beam, slab aur footing ke lap rules project detailing
                  notes ke according change ho sakte hain.
                </li>
                <li>
                  Seismic/ductile detailing wale projects me structural engineer
                  ki detailing follow karo.
                </li>
              </ul>
            </Panel>
          </div>
        </section>
      </div>
    </main>
  );
}

function Panel({ title, children }) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 md:p-6 space-y-4">
      <h2 className="text-xl font-black text-white">{title}</h2>
      {children}
    </section>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-white font-black mt-1 break-words">{value}</p>
    </div>
  );
}

function NumberInput({ label, value, onChange, min = "0" }) {
  return (
    <label className="block">
      <span className="block text-sm text-slate-300 mb-2">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-500"
      />
    </label>
  );
}

function Select({ label, value, onChange, options, suffix = "" }) {
  return (
    <label className="block">
      <span className="block text-sm text-slate-300 mb-2">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
            {suffix ? ` ${suffix}` : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
