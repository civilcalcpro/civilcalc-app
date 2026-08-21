"use client";

import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAuth } from "@/lib/auth-context";
import { saveCalculationHistory } from "@/lib/calculation-history";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// ===== CONFIG =====
const qualityOptions = {
  Economy: {
    rate: 1400,
    hindi: "इकॉनॉमी",
    desc: "Budget construction with basic finishing",
  },
  Standard: {
    rate: 1800,
    hindi: "स्टैंडर्ड",
    desc: "Good quality family home",
  },
  Premium: {
    rate: 2400,
    hindi: "प्रीमियम",
    desc: "Premium materials and better finishing",
  },
};

const defaultRates = {
  cement: 380,
  sand: 50,
  aggregate: 45,
  steel: 65,
  brick: 10,
};

const hiddenDefaults = {
  architect: 50000,
  structural: 35000,
  approval: 45000,
  water: 25000,
  electricity: 30000,
  borewell: 80000,
  boundaryWall: 120000,
  gstPercent: 0,
};

const costPercentages = {
  Excavation: 3,
  Foundation: 12,
  "RCC Work": 20,
  "Brick Work": 10,
  Plaster: 8,
  Flooring: 8,
  "Doors & Windows": 8,
  Electrical: 7,
  Plumbing: 6,
  Painting: 5,
  Finishing: 5,
  Bedrooms: 4,
  Kitchens: 2,
  Bathrooms: 2,
};

const COLORS = [
  "#FF7A00",
  "#f97316",
  "#fb923c",
  "#fdba74",
  "#ea580c",
  "#f59e0b",
  "#fbbf24",
];

const materialRules = {
  Economy: {
    cementBagsPerSqft: 0.36,
    steelKgPerSqft: 3.2,
    sandCftPerSqft: 1.05,
    aggregateCftPerSqft: 0.85,
    bricksPerSqft: 7.2,
  },
  Standard: {
    cementBagsPerSqft: 0.42,
    steelKgPerSqft: 3.8,
    sandCftPerSqft: 1.18,
    aggregateCftPerSqft: 0.95,
    bricksPerSqft: 8.0,
  },
  Premium: {
    cementBagsPerSqft: 0.48,
    steelKgPerSqft: 4.4,
    sandCftPerSqft: 1.32,
    aggregateCftPerSqft: 1.08,
    bricksPerSqft: 8.6,
  },
};

const createDefaultForm = () => ({
  projectName: "",
  ownerName: "",
  plotLength: "",
  plotWidth: "",
  builtUpArea: "",
  unit: "sqft",
  floors: "Ground",
  bedrooms: "2",
  kitchens: "1",
  bathrooms: "2",
  halls: "1",
  carParking: "0",
  balcony: "0",
  quality: "Standard",
  state: "",
  city: "",
});

// ===== MAIN COMPONENT =====
export default function HomeConstructionCalculator() {
  const { authFetch } = useAuth();
  const [screen, setScreen] = useState("home");
  const [calculated, setCalculated] = useState(false);
  const [savedProjects, setSavedProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(createDefaultForm);
  const [rates, setRates] = useState(defaultRates);
  const [hiddenCosts, setHiddenCosts] = useState(hiddenDefaults);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("homeConstructionProjects")) || [];
    setSavedProjects(saved);
  }, []);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateRate = (field, value) => {
    setRates((prev) => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const updateHiddenCost = (field, value) => {
    setHiddenCosts((prev) => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const money = (num) =>
    `₹${Number(num || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;

  // ===== CALCULATION LOGIC =====
  const result = useMemo(() => {
    const floorCount = form.floors === "Ground" ? 1 : form.floors === "G+1" ? 2 : form.floors === "G+2" ? 3 : 4;

    let baseArea = Number(form.builtUpArea) || 0;

    if (!baseArea) {
      const length = Number(form.plotLength) || 0;
      const width = Number(form.plotWidth) || 0;
      baseArea = length * width;
    }

    if (form.unit === "sqm") {
      baseArea = baseArea * 10.7639;
    }

    const constructionArea = baseArea * floorCount;
    const costPerSqFt = qualityOptions[form.quality]?.rate || 1800;
    const constructionCost = constructionArea * costPerSqFt;

    const bedroomCost = Number(form.bedrooms) * 50000;
    const kitchenCost = Number(form.kitchens) * 80000;
    const bathroomCost = Number(form.bathrooms) * 60000;
    const hallCost = Number(form.halls) * 40000;

    const roomAdditionalCost = bedroomCost + kitchenCost + bathroomCost + hallCost;

    const totalConstructionCost = constructionCost + roomAdditionalCost;

    const gstAmount = totalConstructionCost * (hiddenCosts.gstPercent / 100);

    const additionalHiddenCost =
      hiddenCosts.architect +
      hiddenCosts.structural +
      hiddenCosts.approval +
      hiddenCosts.water +
      hiddenCosts.electricity +
      hiddenCosts.borewell +
      hiddenCosts.boundaryWall +
      gstAmount;

    const grandTotal = totalConstructionCost + additionalHiddenCost;

    const breakdown = Object.entries(costPercentages).map(([item, percent]) => ({
      item,
      percent,
      amount: (totalConstructionCost * percent) / 100,
    }));

    const selectedMaterialRule = materialRules[form.quality] || materialRules.Standard;

    const cementBags = Math.ceil(constructionArea * selectedMaterialRule.cementBagsPerSqft);
    const steelKg = Math.ceil(constructionArea * selectedMaterialRule.steelKgPerSqft);
    const sandCft = Math.ceil(constructionArea * selectedMaterialRule.sandCftPerSqft);
    const aggregateCft = Math.ceil(constructionArea * selectedMaterialRule.aggregateCftPerSqft);
    const bricks = Math.ceil(constructionArea * selectedMaterialRule.bricksPerSqft);

    const materials = [
      {
        name: "Cement",
        qty: cementBags,
        unit: "Bags",
        rate: rates.cement,
        amount: cementBags * rates.cement,
      },
      {
        name: "Steel",
        qty: steelKg,
        unit: "Kg",
        rate: rates.steel,
        amount: steelKg * rates.steel,
      },
      {
        name: "Sand",
        qty: sandCft,
        unit: "Cft",
        rate: rates.sand,
        amount: sandCft * rates.sand,
      },
      {
        name: "Aggregate",
        qty: aggregateCft,
        unit: "Cft",
        rate: rates.aggregate,
        amount: aggregateCft * rates.aggregate,
      },
      {
        name: "Red Clay Brick",
        qty: bricks,
        unit: "Nos",
        rate: rates.brick,
        amount: bricks * rates.brick,
      },
    ];

    const materialCostTotal = materials.reduce((sum, item) => sum + item.amount, 0);

    return {
      floorCount,
      constructionArea,
      costPerSqFt,
      costPerSqM: costPerSqFt * 10.7639,
      constructionCost: totalConstructionCost,
      roomAdditionalCost,
      additionalHiddenCost,
      grandTotal,
      gstAmount,
      materialCostTotal,
      labourAndWorkmanshipCost: totalConstructionCost - materialCostTotal,
      materialCostPercent: (materialCostTotal / totalConstructionCost * 100).toFixed(1),
      labourCostPercent: ((totalConstructionCost - materialCostTotal) / totalConstructionCost * 100).toFixed(1),
      breakdown,
      materials,
    };
  }, [form, rates, hiddenCosts]);

  const startNewEstimate = () => {
    setForm(createDefaultForm());
    setRates(defaultRates);
    setHiddenCosts(hiddenDefaults);
    setCalculated(false);
    setEditingId(null);
    setScreen("calculator");
  };

  const calculate = () => {
    if (!form.builtUpArea && (!form.plotLength || !form.plotWidth)) {
      alert("Please enter Built-up Area or Plot Length + Plot Width.");
      return;
    }
    setCalculated(true);
  };

  const saveProject = () => {
    if (!calculated) calculate();

    const projectData = {
      id: editingId || Date.now(),
      form,
      rates,
      hiddenCosts,
      result,
      updatedAt: new Date().toISOString(),
    };

    let updatedProjects = [...savedProjects];

    if (editingId) {
      updatedProjects = updatedProjects.map((p) => (p.id === editingId ? projectData : p));
    } else {
      updatedProjects.unshift(projectData);
    }

    localStorage.setItem("homeConstructionProjects", JSON.stringify(updatedProjects));
    setSavedProjects(updatedProjects);
    setEditingId(projectData.id);
    alert("✅ Project Saved Successfully");
  };

const downloadPDF = async () => {
  if (!calculated) {
    alert("Please calculate estimate first.");
    return;
  }

  const doc = new jsPDF("p", "mm", "a4");
  
  // PAGE 1 - TITLE + SUMMARY
  doc.setFontSize(20);
  doc.text("Home Construction Cost Estimate", 10, 15);
  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 10, 22);
  
  doc.setFontSize(12);
  doc.text(`Project: ${form.projectName || "N/A"}`, 10, 30);
  doc.text(`Owner: ${form.ownerName || "N/A"}`, 10, 36);

  // Summary table
  autoTable(doc, {
    startY: 42,
    head: [["Item", "Amount"]],
    body: [
      ["Construction Cost", money(result.constructionCost)],
      ["Material Cost", money(result.materialCostTotal)],
      ["Labour Cost", money(result.labourAndWorkmanshipCost)],
      ["Hidden Costs", money(result.additionalHiddenCost)],
      ["GRAND TOTAL", money(result.grandTotal)],
    ],
  });

  // PAGE 2 - FLOOR PLAN
  doc.addPage();
  doc.setFontSize(14);
  doc.text("Floor Plan", 10, 15);

  // Capture canvas and add to PDF
  const canvas = document.querySelector("canvas[width='700']");
  if (canvas) {
    const imgData = canvas.toDataURL("image/png");
    doc.addImage(imgData, "PNG", 10, 25, 190, 160);
  }

  // PAGE 3 - COST BREAKDOWN
  doc.addPage();
  doc.setFontSize(14);
  doc.text("Detailed Cost Breakdown", 10, 15);

  autoTable(doc, {
    startY: 25,
    head: [["Work Category", "Percentage", "Amount"]],
    body: result.breakdown.map((b) => [
      b.item,
      `${b.percent}%`,
      money(b.amount),
    ]),
  });

  // PAGE 4 - MATERIALS
  doc.addPage();
  doc.setFontSize(14);
  doc.text("Material Requirements", 10, 15);

  autoTable(doc, {
    startY: 25,
    head: [["Material", "Quantity", "Unit", "Rate", "Amount"]],
    body: result.materials.map((m) => [
      m.name,
      m.qty.toString(),
      m.unit,
      money(m.rate),
      money(m.amount),
    ]),
  });

  doc.save(`${form.projectName || "estimate"}.pdf`);
};

    doc.setFontSize(12);
    doc.text("Construction Area: " + result.constructionArea.toFixed(0) + " sq ft", 10, doc.lastAutoTable.finalY + 10);
    doc.text("Cost per Sq Ft: " + money(result.costPerSqFt), 10, doc.lastAutoTable.finalY + 17);

    doc.save(`${form.projectName || "estimate"}.pdf`);
  };

  // ===== HOME SCREEN =====
  if (screen === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-white/5 p-8">
            <h1 className="text-5xl font-black">Home Design & Cost Estimator</h1>
            <p className="text-slate-300 mt-4 text-lg max-w-3xl">
              Complete house construction estimate with cost breakdown, material quantities, BOQ and PDF report.
            </p>

            <button
              onClick={startNewEstimate}
              className="mt-6 bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-2xl font-black text-lg transition"
            >
              + New Home Calculator
            </button>
          </div>

          {savedProjects.length > 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-black mb-6">Saved Projects</h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedProjects.map((project) => (
                  <div key={project.id} className="rounded-2xl border border-white/10 p-4 bg-black/20 hover:bg-black/40 transition">
                    <h3 className="font-bold text-lg">{project.form?.projectName || "Untitled"}</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {new Date(project.updatedAt).toLocaleDateString("en-IN")}
                    </p>
                    <div className="text-orange-400 font-black text-2xl mt-3">
                      {money(project.result?.grandTotal || 0)}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Area: {project.result?.constructionArea?.toFixed(0) || 0} sq ft
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <button
                        onClick={() => {
                          setForm(project.form);
                          setRates(project.rates);
                          setHiddenCosts(project.hiddenCosts);
                          setCalculated(true);
                          setEditingId(project.id);
                          setScreen("calculator");
                        }}
                        className="bg-orange-500/20 hover:bg-orange-500/40 px-3 py-2 rounded-lg font-bold text-sm transition"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => {
                          const updated = savedProjects.filter((p) => p.id !== project.id);
                          localStorage.setItem("homeConstructionProjects", JSON.stringify(updated));
                          setSavedProjects(updated);
                        }}
                        className="bg-red-500/20 hover:bg-red-500/40 px-3 py-2 rounded-lg font-bold text-sm transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== CALCULATOR SCREEN =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pb-20">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <div className="flex justify-between items-center rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-white/5 p-6">
          <div>
            <button onClick={() => setScreen("home")} className="text-orange-400 font-bold mb-2">
              ← Back to Projects
            </button>
            <h1 className="text-4xl font-black">Home Construction Cost Calculator</h1>
          </div>

          <button
            onClick={calculate}
            className="bg-orange-500 hover:bg-orange-600 rounded-2xl px-8 py-4 font-black transition"
          >
            Calculate Cost
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDEBAR - INPUT FORM */}
          <div className="space-y-6">
            {/* Plot Details */}
            <Panel title="Step 1 — Plot Details">
              <Input label="Project Name" value={form.projectName} onChange={(v) => updateForm("projectName", v)} />
              <Input label="Owner Name" value={form.ownerName} onChange={(v) => updateForm("ownerName", v)} />

              <div className="grid grid-cols-2 gap-3">
                <Input label="Plot Length (ft)" value={form.plotLength} onChange={(v) => updateForm("plotLength", v)} />
                <Input label="Plot Width (ft)" value={form.plotWidth} onChange={(v) => updateForm("plotWidth", v)} />
              </div>

              <Input label="OR Built-up Area" value={form.builtUpArea} onChange={(v) => updateForm("builtUpArea", v)} />

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Unit"
                  value={form.unit}
                  onChange={(v) => updateForm("unit", v)}
                  options={["sqft", "sqm"]}
                />
                <Select
                  label="Floors"
                  value={form.floors}
                  onChange={(v) => updateForm("floors", v)}
                  options={["Ground", "G+1", "G+2"]}
                />
              </div>
            </Panel>

            {/* Rooms */}
            <Panel title="Step 2 — Room Configuration">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Bedrooms" value={form.bedrooms} onChange={(v) => updateForm("bedrooms", v)} />
                <Input label="Kitchens" value={form.kitchens} onChange={(v) => updateForm("kitchens", v)} />
                <Input label="Bathrooms" value={form.bathrooms} onChange={(v) => updateForm("bathrooms", v)} />
                <Input label="Halls" value={form.halls} onChange={(v) => updateForm("halls", v)} />
              </div>
            </Panel>

            {/* Quality */}
            <Panel title="Step 3 — Quality & Construction">
              {Object.entries(qualityOptions).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => updateForm("quality", key)}
                  className={`w-full text-left rounded-2xl p-4 border transition ${
                    form.quality === key
                      ? "border-orange-500 bg-orange-500/15"
                      : "border-white/10 bg-white/5 hover:border-orange-500/40"
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold">{key}</h3>
                      <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                    </div>
                    <span className="text-orange-400 font-black">{money(item.rate)}/sq ft</span>
                  </div>
                </button>
              ))}
            </Panel>

            {/* Location */}
            <Panel title="Step 4 — Location">
              <div className="grid grid-cols-2 gap-3">
                <Input label="State" value={form.state} onChange={(v) => updateForm("state", v)} />
                <Input label="City" value={form.city} onChange={(v) => updateForm("city", v)} />
              </div>
            </Panel>

            {/* Material Rates */}
            <Panel title="Step 5 — Material Rates">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Cement ₹/bag" value={rates.cement} onChange={(v) => updateRate("cement", v)} />
                <Input label="Sand ₹/cft" value={rates.sand} onChange={(v) => updateRate("sand", v)} />
                <Input label="Aggregate ₹/cft" value={rates.aggregate} onChange={(v) => updateRate("aggregate", v)} />
                <Input label="Steel ₹/kg" value={rates.steel} onChange={(v) => updateRate("steel", v)} />
                <Input label="Brick ₹/nos" value={rates.brick} onChange={(v) => updateRate("brick", v)} />
              </div>
            </Panel>

            {/* Hidden Costs */}
            <Panel title="Step 6 — Hidden Costs">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Architect" value={hiddenCosts.architect} onChange={(v) => updateHiddenCost("architect", v)} />
                <Input label="Structural" value={hiddenCosts.structural} onChange={(v) => updateHiddenCost("structural", v)} />
                <Input label="Approval" value={hiddenCosts.approval} onChange={(v) => updateHiddenCost("approval", v)} />
                <Input label="Water" value={hiddenCosts.water} onChange={(v) => updateHiddenCost("water", v)} />
                <Input label="Electricity" value={hiddenCosts.electricity} onChange={(v) => updateHiddenCost("electricity", v)} />
                <Input label="Borewell" value={hiddenCosts.borewell} onChange={(v) => updateHiddenCost("borewell", v)} />
                <Input label="Boundary Wall" value={hiddenCosts.boundaryWall} onChange={(v) => updateHiddenCost("boundaryWall", v)} />
                <Input label="GST %" value={hiddenCosts.gstPercent} onChange={(v) => updateHiddenCost("gstPercent", v)} />
              </div>
            </Panel>
          </div>

          {/* RIGHT SIDE - RESULTS */}
          {!calculated && (
            <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/[0.04] p-6 flex items-center justify-center min-h-96">
              <div className="text-center">
                <p className="text-slate-400 text-lg">Click "Calculate Cost" button to see results</p>
              </div>
            </div>
          )}

          {calculated && (
            <div className="lg:col-span-2 space-y-6">
              {/* Summary */}
              <Panel title="Construction Summary">
                <div className="rounded-3xl bg-gradient-to-br from-orange-500/25 to-black/30 border border-orange-500/40 p-6">
                  <p className="text-orange-300 font-bold">Grand Total Project Budget</p>
                  <h2 className="text-5xl font-black text-orange-400 mt-2">{money(result.grandTotal)}</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  <MiniCard label="Construction Cost" value={money(result.constructionCost)} />
                  <MiniCard label="Material Cost" value={money(result.materialCostTotal)} />
                  <MiniCard label="Labour Cost" value={money(result.labourAndWorkmanshipCost)} />
                  <MiniCard label="Hidden Cost" value={money(result.additionalHiddenCost)} />
                  <MiniCard label="Construction Area" value={`${result.constructionArea.toFixed(0)} sq ft`} />
                  <MiniCard label="Cost / Sq Ft" value={money(result.costPerSqFt)} />
                  <MiniCard label="Floors" value={result.floorCount} />
                  <MiniCard label="Configuration" value={`${form.bedrooms}BHK`} />
                </div>
              </Panel>

              {/* Cost Breakdown Chart */}
              <Panel title="Cost Breakdown">
                <div className="h-64 rounded-2xl bg-black/20 border border-white/10 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={result.breakdown} dataKey="amount" nameKey="item" outerRadius={80}>
                        {result.breakdown.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => money(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  {result.breakdown.map((item) => (
                    <div key={item.item} className="flex justify-between text-sm">
                      <span className="text-slate-400">{item.item}</span>
                      <span className="font-bold">{money(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Materials */}
              <Panel title="Material Requirements">
                <div className="space-y-3">
                  {result.materials.map((m) => (
                    <div key={m.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-bold">{m.name}</h3>
                        <span className="text-orange-400 font-bold">{money(m.amount)}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm text-slate-400">
                        <span>Qty: {m.qty} {m.unit}</span>
                        <span>Rate: {money(m.rate)}/{m.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={saveProject}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 rounded-2xl px-6 py-4 font-black transition"
                >
                  Save Project
                </button>
                <button
                  onClick={downloadPDF}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 rounded-2xl px-6 py-4 font-black transition"
                >
                  Download PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== SUB-COMPONENTS =====
function Panel({ title, children }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <h2 className="text-lg font-black text-orange-400 mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-slate-300 mb-1 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-white outline-none focus:border-orange-500"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-sm text-slate-300 mb-1 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl bg-slate-900 border border-white/10 px-4 py-3 text-white outline-none focus:border-orange-500"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function MiniCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-black/20 border border-white/10 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-black text-white mt-1">{value}</p>
    </div>
  );
}
