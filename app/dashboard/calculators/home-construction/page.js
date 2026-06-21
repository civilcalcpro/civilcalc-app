"use client";

import React, { useMemo, useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const qualityOptions = {
  Economy: {
    rate: 1400,
    desc: "Budget construction / कम बजट निर्माण",
  },
  Standard: {
    rate: 1800,
    desc: "Good quality family house / अच्छा फैमिली हाउस",
  },
  Premium: {
    rate: 2400,
    desc: "Premium finish and materials / प्रीमियम क्वालिटी",
  },
};

const defaultRates = {
  cement: 380,
  sand: 50,
  aggregate: 45,
  steel: 65,
  brick: 10,
};

const costPercentages = {
  Excavation: 3,
  Foundation: 12,
  "RCC Work": 22,
  "Brick Work": 10,
  Plaster: 8,
  Flooring: 10,
  "Doors & Windows": 9,
  Electrical: 7,
  Plumbing: 6,
  Painting: 5,
  Finishing: 8,
};

const COLORS = [
  "#FF7A00",
  "#f97316",
  "#fb923c",
  "#fdba74",
  "#c2410c",
  "#ea580c",
  "#f59e0b",
  "#fbbf24",
  "#fed7aa",
  "#9a3412",
  "#7c2d12",
];

export default function HomeConstructionCalculator() {
  const [form, setForm] = useState({
    projectName: "",
    ownerName: "",
    plotLength: "",
    plotWidth: "",
    builtUpArea: "",
    unit: "sqft",
    floors: "Ground",
    customFloors: "",
    quality: "Standard",
    state: "",
    city: "",
  });

  const [rates, setRates] = useState(defaultRates);
  const [calculated, setCalculated] = useState(false);
  const [savedProjects, setSavedProjects] = useState([]);
  const [openBoq, setOpenBoq] = useState("Foundation");

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

  const getFloorCount = () => {
    if (form.floors === "Ground") return 1;
    if (form.floors === "G+1") return 2;
    if (form.floors === "G+2") return 3;
    return Number(form.customFloors) || 1;
  };

  const result = useMemo(() => {
    const floorCount = getFloorCount();

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
    const costPerSqFt = qualityOptions[form.quality].rate;
    const totalCost = constructionArea * costPerSqFt;

    const breakdown = Object.entries(costPercentages).map(([item, percent]) => ({
      item,
      percent,
      amount: (totalCost * percent) / 100,
    }));

    const cementBags = constructionArea * 0.4;
    const steelKg = constructionArea * 4;
    const sandCft = constructionArea * 0.045;
    const aggregateCft = constructionArea * 0.09;
    const bricks = constructionArea * 8;

    const materials = [
      {
        name: "Cement / सीमेंट",
        qty: cementBags,
        unit: "Bags",
        rate: rates.cement,
        amount: cementBags * rates.cement,
      },
      {
        name: "Steel / स्टील",
        qty: steelKg,
        unit: "Kg",
        rate: rates.steel,
        amount: steelKg * rates.steel,
      },
      {
        name: "Sand / रेत",
        qty: sandCft,
        unit: "Cft",
        rate: rates.sand,
        amount: sandCft * rates.sand,
      },
      {
        name: "Aggregate / गिट्टी",
        qty: aggregateCft,
        unit: "Cft",
        rate: rates.aggregate,
        amount: aggregateCft * rates.aggregate,
      },
      {
        name: "Bricks / ईंट",
        qty: bricks,
        unit: "Nos",
        rate: rates.brick,
        amount: bricks * rates.brick,
      },
    ];

    const boq = {
      Foundation: {
        concrete: constructionArea * 0.015,
        cement: cementBags * 0.18,
        sand: sandCft * 0.2,
        aggregate: aggregateCft * 0.25,
        steel: steelKg * 0.18,
        cost: totalCost * 0.12,
      },
      RCC: {
        concrete: constructionArea * 0.04,
        cement: cementBags * 0.35,
        steel: steelKg * 0.45,
        sand: sandCft * 0.35,
        aggregate: aggregateCft * 0.45,
        cost: totalCost * 0.22,
      },
      Brickwork: {
        bricks: bricks * 0.75,
        cement: cementBags * 0.15,
        sand: sandCft * 0.25,
        cost: totalCost * 0.1,
      },
      Plaster: {
        cement: cementBags * 0.12,
        sand: sandCft * 0.2,
        area: constructionArea * 2.5,
        cost: totalCost * 0.08,
      },
      Flooring: {
        area: constructionArea,
        tiles: constructionArea * 1.05,
        adhesive: constructionArea * 0.08,
        cost: totalCost * 0.1,
      },
      Finishing: {
        paint: constructionArea * 0.18,
        doors: Math.ceil(constructionArea / 350),
        windows: Math.ceil(constructionArea / 300),
        cost: totalCost * 0.08,
      },
    };

    return {
      floorCount,
      constructionArea,
      costPerSqFt,
      totalCost,
      breakdown,
      materials,
      boq,
    };
  }, [form, rates]);

  const money = (num) =>
    `₹${Number(num || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;

  const calculate = () => {
    if (!form.builtUpArea && (!form.plotLength || !form.plotWidth)) {
      alert("Built-up Area या Plot Length + Width डालना जरूरी है");
      return;
    }
    setCalculated(true);
  };

  const saveProject = () => {
    const data = {
      id: Date.now(),
      form,
      rates,
      result,
      date: new Date().toLocaleString("en-IN"),
    };

    const updated = [data, ...savedProjects];
    localStorage.setItem("homeConstructionProjects", JSON.stringify(updated));
    setSavedProjects(updated);
    alert("Project saved successfully");
  };

  const reopenProject = (project) => {
    setForm(project.form);
    setRates(project.rates);
    setCalculated(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProject = (id) => {
    const updated = savedProjects.filter((p) => p.id !== id);
    localStorage.setItem("homeConstructionProjects", JSON.stringify(updated));
    setSavedProjects(updated);
  };

  const shareEstimate = async () => {
    const text = `CivilCalc Pro Home Construction Estimate\nTotal Cost: ${money(
      result.totalCost
    )}\nArea: ${result.constructionArea.toFixed(0)} sq ft\nCost/sq ft: ${money(
      result.costPerSqFt
    )}`;

    if (navigator.share) {
      await navigator.share({ title: "Home Construction Estimate", text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Estimate copied");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(255, 122, 0);
    doc.text("CivilCalc Pro", 14, 22);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text("Home Construction Estimate", 14, 36);

    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 14, 48);
    doc.text(`Project Name: ${form.projectName || "Not Provided"}`, 14, 58);
    doc.text(`Owner Name: ${form.ownerName || "Not Provided"}`, 14, 68);

    doc.addPage();
    doc.setFontSize(16);
    doc.text("Project Details", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Field", "Value"]],
      body: [
        ["Plot Size", `${form.plotLength || "-"} x ${form.plotWidth || "-"} ft`],
        ["Built-up Area", `${form.builtUpArea || "-"} ${form.unit}`],
        ["Floors", form.floors === "Custom" ? form.customFloors : form.floors],
        ["Location", `${form.city || "-"}, ${form.state || "-"}`],
        ["Construction Type", form.quality],
      ],
    });

    doc.addPage();
    doc.setFontSize(16);
    doc.text("Cost Summary", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Item", "Value"]],
      body: [
        ["Total Cost", money(result.totalCost)],
        ["Construction Area", `${result.constructionArea.toFixed(0)} sq ft`],
        ["Cost Per Sq Ft", money(result.costPerSqFt)],
      ],
    });

    doc.addPage();
    doc.setFontSize(16);
    doc.text("Material Breakdown", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Material", "Quantity", "Unit", "Rate", "Amount"]],
      body: result.materials.map((m) => [
        m.name,
        m.qty.toFixed(2),
        m.unit,
        money(m.rate),
        money(m.amount),
      ]),
    });

    doc.addPage();
    doc.setFontSize(16);
    doc.text("Stage-wise BOQ", 14, 20);

    let y = 30;
    Object.entries(result.boq).forEach(([stage, data]) => {
      doc.setFontSize(13);
      doc.text(stage, 14, y);
      y += 5;

      autoTable(doc, {
        startY: y,
        head: [["Item", "Quantity"]],
        body: Object.entries(data).map(([k, v]) => [
          k,
          k === "cost" ? money(v) : Number(v).toFixed(2),
        ]),
      });

      y = doc.lastAutoTable.finalY + 10;

      if (y > 250) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("CivilCalc-Pro-Home-Construction-Estimate.pdf");
  };

  return (
    <div className="min-h-screen bg-[#050B1F] text-white pb-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        <header className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-white/5 p-5 md:p-7">
          <p className="text-orange-400 font-semibold text-sm">
            CivilCalc Pro • Home Construction Assistant
          </p>
          <h1 className="text-2xl md:text-4xl font-black mt-2">
            Home Construction Cost Calculator
          </h1>
          <p className="text-slate-300 mt-2">
            घर बनाने का पूरा खर्च, material quantity, stage-wise BOQ और PDF report एक ही जगह.
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section className="space-y-6 xl:col-span-1">
            <Card title="Step 1 — Plot Details / प्लॉट डिटेल्स">
              <Input label="Project Name / प्रोजेक्ट नाम" value={form.projectName} onChange={(v) => updateForm("projectName", v)} />
              <Input label="Owner Name / मालिक का नाम" value={form.ownerName} onChange={(v) => updateForm("ownerName", v)} />

              <div className="grid grid-cols-2 gap-3">
                <Input label="Plot Length ft" value={form.plotLength} onChange={(v) => updateForm("plotLength", v)} />
                <Input label="Plot Width ft" value={form.plotWidth} onChange={(v) => updateForm("plotWidth", v)} />
              </div>

              <Input label="OR Built-up Area / बना हुआ एरिया" value={form.builtUpArea} onChange={(v) => updateForm("builtUpArea", v)} />

              <div className="grid grid-cols-2 gap-3">
                <Select label="Unit / यूनिट" value={form.unit} onChange={(v) => updateForm("unit", v)} options={["sqft", "sqm"]} />
                <Select label="Floors / मंजिल" value={form.floors} onChange={(v) => updateForm("floors", v)} options={["Ground", "G+1", "G+2", "Custom"]} />
              </div>

              {form.floors === "Custom" && (
                <Input label="Custom Floors / मंजिल संख्या" value={form.customFloors} onChange={(v) => updateForm("customFloors", v)} />
              )}
            </Card>

            <Card title="Step 2 — Construction Type / क्वालिटी">
              <div className="grid gap-3">
                {Object.entries(qualityOptions).map(([key, q]) => (
                  <button
                    key={key}
                    onClick={() => updateForm("quality", key)}
                    className={`text-left rounded-2xl p-4 border transition ${
                      form.quality === key
                        ? "border-orange-500 bg-orange-500/15"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold">{key}</h3>
                      <span className="text-orange-400 font-bold">
                        {money(q.rate)}/sq ft
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{q.desc}</p>
                  </button>
                ))}
              </div>
            </Card>

            <Card title="Step 3 — Location / लोकेशन">
              <div className="grid grid-cols-2 gap-3">
                <Input label="State / राज्य" value={form.state} onChange={(v) => updateForm("state", v)} />
                <Input label="City / शहर" value={form.city} onChange={(v) => updateForm("city", v)} />
              </div>
            </Card>

            <Card title="Step 4 — Material Rates / मटेरियल रेट">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Cement ₹/bag" value={rates.cement} onChange={(v) => updateRate("cement", v)} />
                <Input label="Sand ₹/cft" value={rates.sand} onChange={(v) => updateRate("sand", v)} />
                <Input label="Aggregate ₹/cft" value={rates.aggregate} onChange={(v) => updateRate("aggregate", v)} />
                <Input label="Steel ₹/kg" value={rates.steel} onChange={(v) => updateRate("steel", v)} />
                <Input label="Brick ₹/piece" value={rates.brick} onChange={(v) => updateRate("brick", v)} />
              </div>

              <button
                onClick={calculate}
                className="w-full mt-5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black py-4 shadow-lg"
              >
                Calculate Construction Cost
              </button>
            </Card>
          </section>

          <section className="space-y-6 xl:col-span-1">
            <Card title="Total Cost / कुल खर्च">
              <div className="rounded-3xl bg-gradient-to-br from-orange-500/20 to-black/30 border border-orange-500/40 p-5">
                <p className="text-orange-300 font-semibold">Grand Total</p>
                <h2 className="text-4xl font-black text-orange-400 mt-2">
                  {calculated ? money(result.totalCost) : "₹0"}
                </h2>
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <Mini label="Area" value={`${result.constructionArea.toFixed(0)} sq ft`} />
                  <Mini label="Rate" value={`${money(result.costPerSqFt)}/sq ft`} />
                </div>
              </div>
            </Card>

            <Card title="Cost Breakdown / खर्च का विवरण">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={result.breakdown} dataKey="amount" nameKey="item" outerRadius={90}>
                      {result.breakdown.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => money(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {result.breakdown.map((b) => (
                  <Row key={b.item} label={`${b.item} (${b.percent}%)`} value={money(b.amount)} />
                ))}
              </div>
            </Card>

            <Card title="Material Breakdown / मटेरियल मात्रा">
              <div className="grid gap-3">
                {result.materials.map((m) => (
                  <div key={m.name} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="flex justify-between">
                      <h3 className="font-bold">{m.name}</h3>
                      <span className="text-orange-400 font-bold">{money(m.amount)}</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      {m.qty.toFixed(2)} {m.unit} × {money(m.rate)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <section className="space-y-6 xl:col-span-1">
            <Card title="Stage-wise BOQ / स्टेज BOQ">
              <div className="space-y-3">
                {Object.entries(result.boq).map(([stage, data]) => (
                  <div key={stage} className="rounded-2xl border border-white/10 overflow-hidden">
                    <button
                      onClick={() => setOpenBoq(openBoq === stage ? "" : stage)}
                      className="w-full flex justify-between p-4 bg-white/5 font-bold"
                    >
                      <span>{stage}</span>
                      <span className="text-orange-400">{openBoq === stage ? "−" : "+"}</span>
                    </button>

                    {openBoq === stage && (
                      <div className="p-4 space-y-2">
                        {Object.entries(data).map(([k, v]) => (
                          <Row
                            key={k}
                            label={k}
                            value={k === "cost" ? money(v) : Number(v).toFixed(2)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Saved Projects / सेव प्रोजेक्ट">
              <div className="space-y-3">
                {savedProjects.length === 0 && (
                  <p className="text-slate-400 text-sm">No saved projects yet.</p>
                )}

                {savedProjects.map((p) => (
                  <div key={p.id} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <h3 className="font-bold">{p.form.projectName || "Untitled Project"}</h3>
                    <p className="text-sm text-slate-400">{p.date}</p>
                    <p className="text-orange-400 font-bold mt-1">
                      {money(p.result.totalCost)}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <button onClick={() => reopenProject(p)} className="smallBtn">
                        Open
                      </button>
                      <button onClick={() => deleteProject(p.id)} className="smallBtn">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="SEO Guide">
              <h3 className="font-bold text-orange-400">What is House Construction Cost?</h3>
              <p className="text-sm text-slate-400 mt-1">
                House construction cost means total money required for building a house including foundation, RCC, brickwork, plaster, flooring, plumbing, electrical and finishing.
              </p>

              <h3 className="font-bold text-orange-400 mt-4">घर बनाने का खर्च क्या होता है?</h3>
              <p className="text-sm text-slate-400 mt-1">
                घर बनाने का खर्च material, labour, RCC, foundation, brickwork, plaster, flooring और finishing के total cost से बनता है.
              </p>
            </Card>
          </section>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#050B1F]/95 border-t border-orange-500/30 p-3">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-2">
          <button onClick={saveProject} className="bottomBtn">Save</button>
          <button onClick={downloadPDF} className="bottomBtn">PDF</button>
          <button onClick={() => setOpenBoq("Foundation")} className="bottomBtn">BOQ</button>
          <button onClick={shareEstimate} className="bottomBtn">Share</button>
        </div>
      </div>

      <style jsx>{`
        .bottomBtn {
          background: rgba(255, 122, 0, 0.15);
          border: 1px solid rgba(255, 122, 0, 0.35);
          border-radius: 14px;
          padding: 12px 6px;
          font-weight: 800;
          color: white;
          font-size: 13px;
        }

        .smallBtn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 8px 12px;
          font-size: 12px;
          color: white;
        }
      `}</style>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl">
      <h2 className="text-lg font-black text-orange-400 mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
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
        className="w-full rounded-2xl bg-[#0B1229] border border-white/10 px-4 py-3 text-white outline-none focus:border-orange-500"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/10 pb-2 text-sm">
      <span className="text-slate-400 capitalize">{label}</span>
      <span className="font-bold text-white text-right">{value}</span>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-2xl bg-black/20 border border-white/10 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-bold text-white mt-1">{value}</p>
    </div>
  );
}
