"use client";

import React, { useMemo, useState } from "react";

export default function HouseConstructionCostCalculator() {
  const [project, setProject] = useState({
    projectName: "",
    location: "",
    plotArea: "",
    builtUpArea: "",
    floors: "1",
    constructionType: "Standard",
  });

  const predefinedRates = {
    Basic: { cement: 360, steel: 58, sand: 45, aggregate: 38, brick: 8, labour: 280 },
    Standard: { cement: 390, steel: 62, sand: 50, aggregate: 42, brick: 10, labour: 350 },
    Premium: { cement: 430, steel: 68, sand: 58, aggregate: 48, brick: 12, labour: 450 },
    Luxury: { cement: 480, steel: 75, sand: 70, aggregate: 60, brick: 15, labour: 600 },
  };

  const [useCustomRates, setUseCustomRates] = useState(false);

  const [rates, setRates] = useState(predefinedRates.Standard);

  const updateProject = (field, value) => {
    const updated = { ...project, [field]: value };
    setProject(updated);

    if (field === "constructionType" && !useCustomRates) {
      setRates(predefinedRates[value]);
    }
  };

  const updateRate = (field, value) => {
    setRates({ ...rates, [field]: Number(value) || 0 });
  };

  const builtUpArea = Number(project.builtUpArea) || 0;

  const calculations = useMemo(() => {
    const cementQty = builtUpArea * 0.4;
    const steelQty = builtUpArea * 4;
    const sandQty = builtUpArea * 0.045;
    const aggregateQty = builtUpArea * 0.09;
    const brickQty = builtUpArea * 8;

    const cementCost = cementQty * rates.cement;
    const steelCost = steelQty * rates.steel;
    const sandCost = sandQty * rates.sand;
    const aggregateCost = aggregateQty * rates.aggregate;
    const brickCost = brickQty * rates.brick;
    const labourCost = builtUpArea * rates.labour;

    const materialCost = cementCost + steelCost + sandCost + aggregateCost + brickCost;
    const finishingCost = builtUpArea * 450;
    const electricalCost = builtUpArea * 180;
    const plumbingCost = builtUpArea * 160;
    const miscellaneousCost = builtUpArea * 120;

    const totalConstructionCost =
      materialCost +
      labourCost +
      finishingCost +
      electricalCost +
      plumbingCost +
      miscellaneousCost;

    return {
      cementQty,
      steelQty,
      sandQty,
      aggregateQty,
      brickQty,
      cementCost,
      steelCost,
      sandCost,
      aggregateCost,
      brickCost,
      materialCost,
      labourCost,
      finishingCost,
      electricalCost,
      plumbingCost,
      miscellaneousCost,
      totalConstructionCost,
      costPerSqFt: builtUpArea ? totalConstructionCost / builtUpArea : 0,
      costPerSqM: builtUpArea ? totalConstructionCost / (builtUpArea * 0.092903) : 0,
    };
  }, [builtUpArea, rates]);

  const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const exportCSV = () => {
    const rows = [
      ["Project Name", project.projectName],
      ["Location", project.location],
      ["Plot Area", project.plotArea],
      ["Built-up Area", project.builtUpArea],
      ["Floors", project.floors],
      ["Construction Type", project.constructionType],
      [],
      ["Item", "Quantity/Cost"],
      ["Cement Quantity", `${calculations.cementQty.toFixed(2)} bags`],
      ["Steel Quantity", `${calculations.steelQty.toFixed(2)} kg`],
      ["Sand Quantity", `${calculations.sandQty.toFixed(2)} cft`],
      ["Aggregate Quantity", `${calculations.aggregateQty.toFixed(2)} cft`],
      ["Brick Quantity", `${calculations.brickQty.toFixed(0)} nos`],
      ["Total Material Cost", money(calculations.materialCost)],
      ["Labour Cost", money(calculations.labourCost)],
      ["Total Construction Cost", money(calculations.totalConstructionCost)],
      ["Cost Per Sq Ft", money(calculations.costPerSqFt)],
      ["Cost Per Sq M", money(calculations.costPerSqM)],
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "house-construction-cost.csv";
    a.click();
  };

  const printPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#050B1F] text-white px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-2xl border border-orange-500/30 bg-white/5 p-5 shadow-xl">
          <p className="text-orange-400 text-sm font-semibold">CivilCalc Pro</p>
          <h1 className="text-2xl md:text-4xl font-bold mt-2">
            House Construction Cost Calculator
          </h1>
          <p className="text-gray-300 mt-2">
            Estimate complete house construction cost with material quantity,
            labour, finishing, electrical, plumbing and grand total.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-bold mb-4 text-orange-400">
                Step 1 — Project Details
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <input className="inputBox" placeholder="Project Name" value={project.projectName} onChange={(e) => updateProject("projectName", e.target.value)} />
                <input className="inputBox" placeholder="Location / City" value={project.location} onChange={(e) => updateProject("location", e.target.value)} />
                <input className="inputBox" placeholder="Plot Area sq ft" value={project.plotArea} onChange={(e) => updateProject("plotArea", e.target.value)} />
                <input className="inputBox" placeholder="Built-up Area sq ft" value={project.builtUpArea} onChange={(e) => updateProject("builtUpArea", e.target.value)} />
                <input className="inputBox" placeholder="Number of Floors" value={project.floors} onChange={(e) => updateProject("floors", e.target.value)} />

                <select className="inputBox" value={project.constructionType} onChange={(e) => updateProject("constructionType", e.target.value)}>
                  <option>Basic</option>
                  <option>Standard</option>
                  <option>Premium</option>
                  <option>Luxury</option>
                </select>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-bold mb-4 text-orange-400">
                Step 2 — Cost Inputs
              </h2>

              <div className="flex gap-3 mb-4">
                <button onClick={() => { setUseCustomRates(false); setRates(predefinedRates[project.constructionType]); }} className={`btn ${!useCustomRates ? "bg-orange-500" : "bg-white/10"}`}>
                  Market Rates
                </button>
                <button onClick={() => setUseCustomRates(true)} className={`btn ${useCustomRates ? "bg-orange-500" : "bg-white/10"}`}>
                  Custom Rates
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {["cement", "steel", "sand", "aggregate", "brick", "labour"].map((item) => (
                  <div key={item}>
                    <label className="text-sm text-gray-300 capitalize">{item} Rate</label>
                    <input
                      className="inputBox mt-1"
                      disabled={!useCustomRates}
                      value={rates[item]}
                      onChange={(e) => updateRate(item, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-bold mb-4 text-orange-400">
                Step 3 — Material Quantities
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <Result label="Cement" value={`${calculations.cementQty.toFixed(2)} Bags`} />
                <Result label="Steel" value={`${calculations.steelQty.toFixed(2)} Kg`} />
                <Result label="Sand" value={`${calculations.sandQty.toFixed(2)} Cft`} />
                <Result label="Aggregate" value={`${calculations.aggregateQty.toFixed(2)} Cft`} />
                <Result label="Bricks" value={`${calculations.brickQty.toFixed(0)} Nos`} />
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-bold mb-4 text-orange-400">
                Step 4 — Cost Breakdown
              </h2>

              <div className="space-y-3">
                <Breakdown label="Cement Cost" value={money(calculations.cementCost)} />
                <Breakdown label="Steel Cost" value={money(calculations.steelCost)} />
                <Breakdown label="Sand Cost" value={money(calculations.sandCost)} />
                <Breakdown label="Aggregate Cost" value={money(calculations.aggregateCost)} />
                <Breakdown label="Brick Cost" value={money(calculations.brickCost)} />
                <Breakdown label="Labour Cost" value={money(calculations.labourCost)} />
                <Breakdown label="Finishing Cost" value={money(calculations.finishingCost)} />
                <Breakdown label="Electrical Cost" value={money(calculations.electricalCost)} />
                <Breakdown label="Plumbing Cost" value={money(calculations.plumbingCost)} />
                <Breakdown label="Miscellaneous Cost" value={money(calculations.miscellaneousCost)} />
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-bold mb-4 text-orange-400">
                SEO Information
              </h2>

              <h3 className="font-bold">What is House Construction Cost?</h3>
              <p className="text-gray-300 mb-3">
                House construction cost is the total estimated amount required to build a house, including materials, labour, finishing, electrical, plumbing and miscellaneous expenses.
              </p>

              <h3 className="font-bold">House Construction Cost Formula</h3>
              <p className="text-gray-300 mb-3">
                Total Construction Cost = Material Cost + Labour Cost + Finishing Cost + Electrical Cost + Plumbing Cost + Miscellaneous Cost.
              </p>

              <h3 className="font-bold">FAQs</h3>
              <p className="text-gray-300">
                This building cost calculator helps estimate cost per square foot, material quantities and total construction cost instantly.
              </p>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="sticky top-5 rounded-2xl border border-orange-500/40 bg-orange-500/10 p-5 shadow-2xl">
              <p className="text-sm text-orange-300 font-semibold">Grand Total</p>
              <h2 className="text-4xl font-black mt-2">
                {money(calculations.totalConstructionCost)}
              </h2>

              <div className="mt-5 space-y-2">
                <Breakdown label="Material Cost" value={money(calculations.materialCost)} />
                <Breakdown label="Labour Cost" value={money(calculations.labourCost)} />
                <Breakdown label="Cost / Sq Ft" value={money(calculations.costPerSqFt)} />
                <Breakdown label="Cost / Sq M" value={money(calculations.costPerSqM)} />
              </div>

              <div className="grid gap-3 mt-5">
                <button onClick={printPDF} className="btn bg-orange-500 hover:bg-orange-600">
                  Generate PDF
                </button>
                <button onClick={exportCSV} className="btn bg-white/10 hover:bg-white/20">
                  Export CSV
                </button>
                <button className="btn bg-white/10 hover:bg-white/20">
                  Save Project
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .inputBox {
          width: 100%;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 12px 14px;
          color: white;
          outline: none;
        }

        .inputBox::placeholder {
          color: rgba(255, 255, 255, 0.45);
        }

        .inputBox:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        .btn {
          border-radius: 14px;
          padding: 12px 16px;
          font-weight: 700;
          transition: 0.2s;
        }

        @media print {
          button {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

function Result({ label, value }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}

function Breakdown({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
      <span className="text-gray-300">{label}</span>
      <span className="font-bold text-white">{value}</span>
    </div>
  );
}
