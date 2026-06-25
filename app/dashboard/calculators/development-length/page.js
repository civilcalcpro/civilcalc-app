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

export default function DevelopmentLengthCalculator() {
  const [form, setForm] = useState({
    barDiameter: 12,
    steelGrade: "Fe415",
    concreteGrade: "M20",
    barType: "Deformed Bar",
    stressCondition: "Tension",
    memberType: "Beam",
    numberOfBars: 1,
    unit: "mm",
  });

  const updateForm = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const moneyNumber = (num) =>
    Number(num || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  const result = useMemo(() => {
    const dia = Number(form.barDiameter || 0);
    const fy = steelGrades[form.steelGrade] || 415;
    const baseBondStress = concreteBondStress[form.concreteGrade] || 1.2;

    const steelStress = 0.87 * fy;

    const deformedMultiplier =
      form.barType === "Deformed Bar" ? 1.6 : 1;

    const compressionMultiplier =
      form.stressCondition === "Compression" ? 1.25 : 1;

    const designBondStress =
      baseBondStress * deformedMultiplier * compressionMultiplier;

    const developmentLength =
      (dia * steelStress) / (4 * designBondStress);

    const developmentLengthM = developmentLength / 1000;

    const ldInD = developmentLength / dia;

    const recommendedLength =
      Math.ceil(developmentLength / 25) * 25;

    const totalAnchorageLength =
      recommendedLength * Number(form.numberOfBars || 1);

    let siteNote = "";

    if (form.memberType === "Beam") {
      siteNote =
        "Provide sufficient anchorage beyond the critical section/support zone as per structural drawing.";
    } else if (form.memberType === "Column") {
      siteNote =
        "Check column bar anchorage and continuation with footing/beam junction as per structural drawing.";
    } else if (form.memberType === "Slab") {
      siteNote =
        "Provide anchorage into supporting beam/wall and verify slab reinforcement detailing.";
    } else if (form.memberType === "Footing") {
      siteNote =
        "Check dowel/column bar anchorage inside footing as per structural design.";
    } else {
      siteNote =
        "Use calculated development length as anchorage reference and verify with project drawings.";
    }

    const warning =
      dia > 36
        ? "For bars above 36 mm, special detailing, welding or mechanical couplers may be required as per structural design."
        : "";

    const examAnswer = [
      `Given: Bar diameter = ${dia} mm, Steel grade = ${form.steelGrade}, Concrete grade = ${form.concreteGrade}`,
      `Formula: Ld = φ × σs / 4τbd`,
      `σs = 0.87 × fy = 0.87 × ${fy} = ${steelStress.toFixed(2)} N/mm²`,
      `τbd = ${designBondStress.toFixed(2)} N/mm²`,
      `Ld = ${dia} × ${steelStress.toFixed(2)} / (4 × ${designBondStress.toFixed(2)})`,
      `Development Length = ${developmentLength.toFixed(0)} mm`,
      `Recommended Site Length = ${recommendedLength.toFixed(0)} mm`,
    ];

    return {
      dia,
      fy,
      baseBondStress,
      steelStress,
      deformedMultiplier,
      compressionMultiplier,
      designBondStress,
      developmentLength,
      developmentLengthM,
      ldInD,
      recommendedLength,
      totalAnchorageLength,
      siteNote,
      warning,
      examAnswer,
    };
  }, [form]);

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;

    const orange = [255, 122, 0];
    const navy = [5, 11, 31];
    const dark = [15, 23, 42];
    const grey = [100, 116, 139];

    const safeText = (value) =>
      String(value ?? "-")
        .replace(/₹/g, "Rs.")
        .replace(/–/g, "-")
        .replace(/—/g, "-");

    doc.setFillColor(...navy);
    doc.rect(0, 0, pageWidth, 34, "F");

    doc.setTextColor(...orange);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CivilCalc Pro", margin, 14);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("Development Length Calculation Report", margin, 24);

    let y = 48;

    doc.setTextColor(...dark);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Input Details", margin, y);

    y += 8;

    const inputRows = [
      ["Bar Diameter", `${form.barDiameter} mm`],
      ["Steel Grade", form.steelGrade],
      ["Concrete Grade", form.concreteGrade],
      ["Bar Type", form.barType],
      ["Stress Condition", form.stressCondition],
      ["Member Type", form.memberType],
      ["Number of Bars", form.numberOfBars],
    ];

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    inputRows.forEach(([label, value]) => {
      doc.setTextColor(...grey);
      doc.text(label, margin, y);
      doc.setTextColor(...dark);
      doc.text(safeText(value), 80, y);
      y += 7;
    });

    y += 6;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...dark);
    doc.text("Result Summary", margin, y);

    y += 8;

    const resultRows = [
      ["Development Length", `${result.developmentLength.toFixed(0)} mm`],
      ["Development Length", `${result.developmentLengthM.toFixed(3)} m`],
      ["Ld in Bar Diameter", `${result.ldInD.toFixed(1)}D`],
      ["Recommended Site Length", `${result.recommendedLength.toFixed(0)} mm`],
      [
        "Total Anchorage Length",
        `${result.totalAnchorageLength.toFixed(0)} mm for ${form.numberOfBars} bar(s)`,
      ],
      ["Design Bond Stress", `${result.designBondStress.toFixed(2)} N/mm²`],
      ["Steel Stress", `${result.steelStress.toFixed(2)} N/mm²`],
    ];

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    resultRows.forEach(([label, value]) => {
      doc.setTextColor(...grey);
      doc.text(label, margin, y);
      doc.setTextColor(...dark);
      doc.text(safeText(value), 80, y);
      y += 7;
    });

    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Step-by-step Calculation", margin, y);

    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    result.examAnswer.forEach((line, index) => {
      doc.setTextColor(...dark);
      doc.text(`${index + 1}. ${safeText(line)}`, margin, y);
      y += 7;
    });

    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text("Site Note", margin, y);

    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const noteLines = doc.splitTextToSize(
      safeText(result.siteNote),
      pageWidth - margin * 2
    );
    doc.text(noteLines, margin, y);

    y += noteLines.length * 6 + 8;

    if (result.warning) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(180, 83, 9);
      doc.text("Warning", margin, y);

      y += 7;

      doc.setFont("helvetica", "normal");
      const warningLines = doc.splitTextToSize(
        safeText(result.warning),
        pageWidth - margin * 2
      );
      doc.text(warningLines, margin, y);
    }

    doc.setFontSize(8);
    doc.setTextColor(...grey);
    doc.text(
      "Generated by CivilCalc Pro - This is an engineering calculation aid. Verify final detailing with project structural drawings and qualified engineer.",
      margin,
      286
    );

    doc.save("civilcalc-development-length-report.pdf");
  };

  return (
    <main className="min-h-screen bg-[#050B1F] text-white px-4 py-6 md:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-white/5 p-6">
          <p className="text-orange-400 text-sm font-black">
            RCC REINFORCEMENT DETAILING
          </p>

          <h1 className="text-3xl md:text-5xl font-black mt-2">
            Development Length Calculator
          </h1>

          <p className="text-slate-300 mt-4 max-w-4xl leading-7">
            Calculate required development length of reinforcement bars for RCC
            beams, columns, slabs, footings and staircases with formula,
            step-by-step solution, recommended site length and PDF report.
          </p>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1 space-y-6">
            <Panel title="Input Details">
              <Select
                label="Bar Diameter / बार डायमीटर"
                value={form.barDiameter}
                onChange={(v) => updateForm("barDiameter", Number(v))}
                options={diameters}
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
                label="Stress Condition / स्थिति"
                value={form.stressCondition}
                onChange={(v) => updateForm("stressCondition", v)}
                options={["Tension", "Compression"]}
              />

              <Select
                label="Member Type / मेंबर"
                value={form.memberType}
                onChange={(v) => updateForm("memberType", v)}
                options={["Beam", "Column", "Slab", "Footing", "Staircase", "General RCC"]}
              />

              <Input
                label="Number of Bars / बार संख्या"
                value={form.numberOfBars}
                onChange={(v) => updateForm("numberOfBars", v)}
              />

              <button
                onClick={downloadPDF}
                className="w-full rounded-2xl bg-orange-500 hover:bg-orange-600 py-4 font-black transition"
              >
                Download PDF Report
              </button>
            </Panel>

            <Panel title="Formula Used">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-orange-400 font-mono text-lg overflow-x-auto">
                Ld = φ × σs / 4τbd
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <p>φ = Bar diameter</p>
                <p>σs = 0.87 × fy</p>
                <p>τbd = Design bond stress</p>
              </div>
            </Panel>
          </div>

          <div className="xl:col-span-2 space-y-6">
            <Panel title="Result Summary">
              <div className="rounded-3xl border border-orange-500/40 bg-orange-500/10 p-5">
                <p className="text-orange-300 font-bold">
                  Required Development Length
                </p>

                <h2 className="text-4xl md:text-5xl font-black text-orange-400 mt-2">
                  {result.developmentLength.toFixed(0)} mm
                </h2>

                <p className="text-slate-400 mt-2">
                  Recommended site length:{" "}
                  <span className="text-white font-bold">
                    {result.recommendedLength.toFixed(0)} mm
                  </span>
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Mini
                  label="Development Length"
                  value={`${result.developmentLengthM.toFixed(3)} m`}
                />

                <Mini
                  label="Ld in Diameter"
                  value={`${result.ldInD.toFixed(1)}D`}
                />

                <Mini
                  label="Recommended Length"
                  value={`${result.recommendedLength.toFixed(0)} mm`}
                />

                <Mini
                  label="Design Bond Stress"
                  value={`${result.designBondStress.toFixed(2)} N/mm²`}
                />

                <Mini
                  label="Steel Stress"
                  value={`${result.steelStress.toFixed(2)} N/mm²`}
                />

                <Mini
                  label="Total for Bars"
                  value={`${moneyNumber(result.totalAnchorageLength)} mm`}
                />
              </div>
            </Panel>

            <Panel title="Step-by-step Calculation">
              <div className="space-y-3">
                {result.examAnswer.map((line, index) => (
                  <div
                    key={line}
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

            <Panel title="Site Recommendation">
              <p className="text-slate-300 leading-8">{result.siteNote}</p>

              {result.warning && (
                <div className="mt-4 rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4">
                  <p className="text-yellow-300 font-bold">Warning</p>
                  <p className="text-yellow-100 mt-2">{result.warning}</p>
                </div>
              )}
            </Panel>

            <Panel title="Exam Answer Format">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-300 leading-8">
                <p>
                  Given: Bar diameter = {form.barDiameter} mm, Steel grade ={" "}
                  {form.steelGrade}, Concrete grade = {form.concreteGrade}
                </p>
                <p>
                  Formula: Ld = φ × σs / 4τbd
                </p>
                <p>
                  Development Length ={" "}
                  {result.developmentLength.toFixed(0)} mm
                </p>
                <p>
                  Recommended site length ={" "}
                  {result.recommendedLength.toFixed(0)} mm
                </p>
              </div>
            </Panel>

            <Panel title="Important Notes">
              <ul className="list-disc pl-6 space-y-3 text-slate-300 leading-7">
                <li>
                  This calculator is useful for RCC anchorage length checking in
                  beams, columns, slabs, footings and staircases.
                </li>
                <li>
                  Final reinforcement detailing should always be checked with
                  structural drawing and qualified engineer.
                </li>
                <li>
                  For heavily loaded or special structural members, project
                  design requirements should be followed.
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
      <p className="text-white font-black mt-1">{value}</p>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="block text-sm text-slate-300 mb-2">{label}</span>
      <input
        type="number"
        value={value}
        min="1"
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-orange-500"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
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
          </option>
        ))}
      </select>
    </label>
  );
}
