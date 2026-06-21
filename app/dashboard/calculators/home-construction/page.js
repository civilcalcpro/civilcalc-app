"use client";

import React, { useEffect, useMemo, useState } from "react";
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
    hindi: "इकॉनॉमी",
    desc: "Budget construction with basic finishing / कम बजट में बेसिक फिनिशिंग",
  },
  Standard: {
    rate: 1800,
    hindi: "स्टैंडर्ड",
    desc: "Good quality family home / अच्छी क्वालिटी का फैमिली घर",
  },
  Premium: {
    rate: 2400,
    hindi: "प्रीमियम",
    desc: "Premium materials and better finishing / प्रीमियम मटेरियल और फिनिशिंग",
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
  "#9a3412",
  "#7c2d12",
  "#fed7aa",
  "#c2410c",
];

export default function HomeConstructionCalculator() {
  const [screen, setScreen] = useState("home");
  const [calculated, setCalculated] = useState(false);
  const [savedProjects, setSavedProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [openBoq, setOpenBoq] = useState("Foundation");

  const [form, setForm] = useState({
    projectName: "",
    ownerName: "",
    plotLength: "",
    plotWidth: "",
    builtUpArea: "",
    unit: "sqft",
    floors: "Ground",
    customFloors: "",
    bedrooms: "2",
    kitchens: "1",
    bathrooms: "2",
    halls: "1",
    quality: "Standard",
    state: "",
    city: "",
  });

  const [rates, setRates] = useState(defaultRates);
  const [hiddenCosts, setHiddenCosts] = useState(hiddenDefaults);
  const [emi, setEmi] = useState({
    loanAmount: "",
    interestRate: "8.5",
    years: "20",
  });

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("homeConstructionProjects")) || [];
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

  const updateEmi = (field, value) => {
    setEmi((prev) => ({ ...prev, [field]: value }));
  };

  const getFloorCount = () => {
    if (form.floors === "Ground") return 1;
    if (form.floors === "G+1") return 2;
    if (form.floors === "G+2") return 3;
    return Number(form.customFloors) || 1;
  };

  const money = (num) =>
    `₹${Number(num || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;

  const pdfMoney = (num) =>
    `Rs. ${Number(num || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;

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
    const baseConstructionCost =
  constructionArea * costPerSqFt;

const bedroomCost =
  Number(form.bedrooms || 0) * 50000;

const kitchenCost =
  Number(form.kitchens || 0) * 80000;

const bathroomCost =
  Number(form.bathrooms || 0) * 60000;

const hallCost =
  Number(form.halls || 0) * 40000;

const roomAdditionalCost =
  bedroomCost +
  kitchenCost +
  bathroomCost +
  hallCost;

const constructionCost =
  baseConstructionCost +
  roomAdditionalCost;
    const gstAmount =
      constructionCost * ((Number(hiddenCosts.gstPercent) || 0) / 100);

    const additionalHiddenCost =
      Number(hiddenCosts.architect || 0) +
      Number(hiddenCosts.structural || 0) +
      Number(hiddenCosts.approval || 0) +
      Number(hiddenCosts.water || 0) +
      Number(hiddenCosts.electricity || 0) +
      Number(hiddenCosts.borewell || 0) +
      Number(hiddenCosts.boundaryWall || 0) +
      gstAmount;

    const grandTotal = constructionCost + additionalHiddenCost;

    const breakdown = Object.entries(costPercentages).map(([item, percent]) => ({
      item,
      percent,
      amount: (constructionCost * percent) / 100,
    }));

    const cementBags = constructionArea * 0.4;
    const steelKg = constructionArea * 4;
    const sandCft = constructionArea * 0.045;
    const aggregateCft = constructionArea * 0.09;
    const bricks = constructionArea * 8;

    const materials = [
      {
        name: "Cement / सीमेंट",
        pdfName: "Cement",
        qty: cementBags,
        unit: "Bags",
        rate: rates.cement,
        amount: cementBags * rates.cement,
      },
      {
        name: "Steel / स्टील",
        pdfName: "Steel",
        qty: steelKg,
        unit: "Kg",
        rate: rates.steel,
        amount: steelKg * rates.steel,
      },
      {
        name: "Sand / रेत",
        pdfName: "Sand",
        qty: sandCft,
        unit: "Cft",
        rate: rates.sand,
        amount: sandCft * rates.sand,
      },
      {
        name: "Aggregate / गिट्टी",
        pdfName: "Aggregate",
        qty: aggregateCft,
        unit: "Cft",
        rate: rates.aggregate,
        amount: aggregateCft * rates.aggregate,
      },
      {
        name: "Bricks / ईंट",
        pdfName: "Bricks",
        qty: bricks,
        unit: "Nos",
        rate: rates.brick,
        amount: bricks * rates.brick,
      },
    ];

    const boq = {
      Foundation: {
        "Concrete Volume": `${(constructionArea * 0.015).toFixed(2)} m3`,
        "Cement Bags": `${(cementBags * 0.18).toFixed(2)} bags`,
        "Sand Quantity": `${(sandCft * 0.2).toFixed(2)} cft`,
        "Aggregate Quantity": `${(aggregateCft * 0.25).toFixed(2)} cft`,
        "Steel Quantity": `${(steelKg * 0.18).toFixed(2)} kg`,
        Cost: money(constructionCost * 0.12),
      },
      RCC: {
        "Concrete Volume": `${(constructionArea * 0.04).toFixed(2)} m3`,
        Cement: `${(cementBags * 0.35).toFixed(2)} bags`,
        Steel: `${(steelKg * 0.45).toFixed(2)} kg`,
        Sand: `${(sandCft * 0.35).toFixed(2)} cft`,
        Aggregate: `${(aggregateCft * 0.45).toFixed(2)} cft`,
        Cost: money(constructionCost * 0.22),
      },
      Brickwork: {
        Bricks: `${(bricks * 0.75).toFixed(0)} nos`,
        Cement: `${(cementBags * 0.15).toFixed(2)} bags`,
        Sand: `${(sandCft * 0.25).toFixed(2)} cft`,
        Cost: money(constructionCost * 0.1),
      },
      Plaster: {
        Cement: `${(cementBags * 0.12).toFixed(2)} bags`,
        Sand: `${(sandCft * 0.2).toFixed(2)} cft`,
        Area: `${(constructionArea * 2.5).toFixed(0)} sq ft`,
        Cost: money(constructionCost * 0.08),
      },
      Flooring: {
        Area: `${constructionArea.toFixed(0)} sq ft`,
        "Tile Quantity": `${(constructionArea * 1.05).toFixed(0)} sq ft`,
        Adhesive: `${(constructionArea * 0.08).toFixed(2)} bags`,
        Cost: money(constructionCost * 0.1),
      },
      Finishing: {
        "Paint Quantity": `${(constructionArea * 0.18).toFixed(2)} litres`,
        Doors: `${Math.ceil(constructionArea / 350)} nos`,
        Windows: `${Math.ceil(constructionArea / 300)} nos`,
        Cost: money(constructionCost * 0.08),
      },
    };

    const hiddenList = [
      ["Architect Fees", hiddenCosts.architect],
      ["Structural Design", hiddenCosts.structural],
      ["Government Approval", hiddenCosts.approval],
      ["Water Connection", hiddenCosts.water],
      ["Electricity Connection", hiddenCosts.electricity],
      ["Borewell", hiddenCosts.borewell],
      ["Boundary Wall", hiddenCosts.boundaryWall],
      [`GST (${hiddenCosts.gstPercent || 0}%)`, gstAmount],
    ];

  const roomRecommendation = {
  type: `${form.bedrooms} BHK House`,
  rooms: [
    ...Array.from(
      { length: Number(form.bedrooms || 0) },
      (_, i) => ({
        name: `Bedroom ${i + 1}`,
        size: "12 x 12 ft",
      })
    ),

    ...Array.from(
      { length: Number(form.kitchens || 0) },
      (_, i) => ({
        name: `Kitchen ${i + 1}`,
        size: "10 x 10 ft",
      })
    ),

    ...Array.from(
      { length: Number(form.bathrooms || 0) },
      (_, i) => ({
        name: `Bathroom ${i + 1}`,
        size: "5 x 8 ft",
      })
    ),

    ...Array.from(
      { length: Number(form.halls || 0) },
      (_, i) => ({
        name: `Hall ${i + 1}`,
        size: "15 x 20 ft",
      })
    ),
  ],
};
    const timeline = getTimeline(constructionArea, floorCount);

    const loanAmount = Number(emi.loanAmount) || grandTotal;
    const monthlyRate = (Number(emi.interestRate) || 0) / 12 / 100;
    const months = (Number(emi.years) || 0) * 12;

    let monthlyEmi = 0;
    if (loanAmount > 0 && monthlyRate > 0 && months > 0) {
      monthlyEmi =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }

    const totalPayment = monthlyEmi * months;
    const totalInterest = totalPayment - loanAmount;

    return {
      floorCount,
      constructionArea,
      costPerSqFt,
      costPerSqM: costPerSqFt * 10.7639,
      constructionCost,
      additionalHiddenCost,
      grandTotal,
      gstAmount,
      breakdown,
      materials,
      boq,
      hiddenList,
      roomRecommendation,
      timeline,
      emiSummary: {
        loanAmount,
        monthlyEmi,
        totalInterest,
        totalPayment,
      },
    };
  }, [form, rates, hiddenCosts, emi]);

  const startNewEstimate = () => {
    setForm({
      projectName: "",
      ownerName: "",
      plotLength: "",
      plotWidth: "",
      builtUpArea: "",
      unit: "sqft",
      floors: "Ground",
      customFloors: "",
       bedrooms: "2",
  kitchens: "1",
  bathrooms: "2",
  halls: "1",

      quality: "Standard",
      state: "",
      city: "",
    });
    setRates(defaultRates);
    setHiddenCosts(hiddenDefaults);
    setEmi({ loanAmount: "", interestRate: "8.5", years: "20" });
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
    setTimeout(() => {
      const el = document.getElementById("results-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const saveProject = () => {
    if (!calculated) calculate();

    const projectData = {
      id: editingId || Date.now(),
      form,
      rates,
      hiddenCosts,
      emi,
      result,
      updatedAt: new Date().toISOString(),
    };

    let updatedProjects = [...savedProjects];

    if (editingId) {
      updatedProjects = updatedProjects.map((p) =>
        p.id === editingId ? projectData : p
      );
    } else {
      updatedProjects.unshift(projectData);
    }

    localStorage.setItem(
      "homeConstructionProjects",
      JSON.stringify(updatedProjects)
    );

    setSavedProjects(updatedProjects);
    setEditingId(projectData.id);
    alert("Project Saved Successfully");
  };

  const openProject = (project) => {
    setEditingId(project.id);
    setForm(project.form);
    setRates(project.rates || defaultRates);
    setHiddenCosts(project.hiddenCosts || hiddenDefaults);
    setEmi(project.emi || { loanAmount: "", interestRate: "8.5", years: "20" });
    setCalculated(true);
    setScreen("calculator");
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  const deleteProject = (id) => {
    const updated = savedProjects.filter((p) => p.id !== id);
    localStorage.setItem("homeConstructionProjects", JSON.stringify(updated));
    setSavedProjects(updated);
  };

  const duplicateProject = (project) => {
    const copy = {
      ...project,
      id: Date.now(),
      form: {
        ...project.form,
        projectName: `${project.form.projectName || "Untitled"} Copy`,
      },
      updatedAt: new Date().toISOString(),
    };
    const updated = [copy, ...savedProjects];
    localStorage.setItem("homeConstructionProjects", JSON.stringify(updated));
    setSavedProjects(updated);
  };

  const shareEstimate = async () => {
    const text = `CivilCalc Pro Home Construction Estimate
Project: ${form.projectName || "N/A"}
Construction Cost: ${money(result.constructionCost)}
Additional Hidden Cost: ${money(result.additionalHiddenCost)}
Grand Total: ${money(result.grandTotal)}
Construction Area: ${result.constructionArea.toFixed(0)} sq ft`;

    if (navigator.share) {
      await navigator.share({ title: "Home Construction Estimate", text });
    } else {
      await navigator.clipboard.writeText(text);
      alert("Estimate copied to clipboard");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(24);
    doc.setTextColor(255, 122, 0);
    doc.text("CivilCalc Pro", 14, 22);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text("Home Construction Estimate", 14, 38);

    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 14, 52);
    doc.text(`Project Name: ${form.projectName || "Not Provided"}`, 14, 62);
    doc.text(`Owner Name: ${form.ownerName || "Not Provided"}`, 14, 72);
    doc.text("Generated by CivilCalc Pro", 14, 88);

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
        ["Construction Area", `${result.constructionArea.toFixed(0)} sq ft`],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [255, 122, 0] },
    });

    doc.addPage();
    doc.setFontSize(16);
    doc.text("Cost Summary", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Item", "Amount"]],
      body: [
        ["Construction Cost", pdfMoney(result.constructionCost)],
        ["Additional Hidden Cost", pdfMoney(result.additionalHiddenCost)],
        ["Grand Total Project Budget", pdfMoney(result.grandTotal)],
        ["Cost Per Sq Ft", pdfMoney(result.costPerSqFt)],
        ["Cost Per Sq M", pdfMoney(result.costPerSqM)],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [255, 122, 0] },
    });

    doc.addPage();
    doc.setFontSize(16);
    doc.text("Material Breakdown", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Material", "Quantity", "Unit", "Rate", "Amount"]],
      body: result.materials.map((m) => [
        m.pdfName,
        m.qty.toFixed(2),
        m.unit,
        pdfMoney(m.rate),
        pdfMoney(m.amount),
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [255, 122, 0] },
    });

    doc.addPage();
    doc.setFontSize(16);
    doc.text("Stage-wise BOQ", 14, 20);

    let y = 30;
    Object.entries(result.boq).forEach(([stage, data]) => {
      doc.setFontSize(13);
      doc.text(stage, 14, y);
      y += 5;

      const pdfRows = Object.entries(data).map(([key, value]) => [
        key,
        String(value).replace("₹", "Rs. "),
      ]);

      autoTable(doc, {
        startY: y,
        head: [["Item", "Value"]],
        body: pdfRows,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [255, 122, 0] },
      });

      y = doc.lastAutoTable.finalY + 10;
      if (y > 240) {
        doc.addPage();
        y = 20;
      }
    });

    doc.addPage();
    doc.setFontSize(16);
    doc.text("Hidden Costs and EMI", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Hidden Cost Item", "Amount"]],
      body: result.hiddenList.map(([label, value]) => [
        label,
        pdfMoney(value),
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [255, 122, 0] },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 12,
      head: [["Loan Item", "Value"]],
      body: [
        ["Loan Amount", pdfMoney(result.emiSummary.loanAmount)],
        ["Monthly EMI", pdfMoney(result.emiSummary.monthlyEmi)],
        ["Total Interest", pdfMoney(result.emiSummary.totalInterest)],
        ["Total Payment", pdfMoney(result.emiSummary.totalPayment)],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [255, 122, 0] },
    });

    doc.save(`${form.projectName || "civilcalc-home-estimate"}.pdf`);
  };

  if (screen === "home") {
    return (
      <div className="min-h-screen bg-[#050B1F] text-white p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-white/5 p-6">
            <p className="text-orange-400 text-sm font-bold">
              CivilCalc Pro / सिविलकैल्क प्रो
            </p>
            <h1 className="text-3xl md:text-5xl font-black mt-2">
              Home Construction Assistant
            </h1>
            <p className="text-slate-300 mt-3 max-w-3xl">
              Complete house construction estimate with cost breakdown, material
              quantities, BOQ, hidden costs, EMI and PDF report.
              <br />
              घर बनाने का पूरा खर्च, मटेरियल, BOQ और PDF रिपोर्ट एक जगह.
            </p>

            <button
              onClick={startNewEstimate}
              className="mt-6 bg-orange-500 hover:bg-orange-600 px-6 py-4 rounded-2xl font-black w-full sm:w-auto"
            >
              + New Home Calculator / नया अनुमान बनाएं
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
            <h2 className="text-xl font-black mb-5">
              Saved Projects / सेव किए हुए प्रोजेक्ट
            </h2>

            {savedProjects.length === 0 && (
              <p className="text-slate-500">
                No saved projects available. अभी कोई saved project नहीं है.
              </p>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {savedProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-white/10 p-4 bg-black/20"
                >
                  <h3 className="font-bold">
                    {project.form.projectName || "Untitled Project"}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {new Date(project.updatedAt).toLocaleString("en-IN")}
                  </p>
                  <div className="text-orange-400 font-black text-xl mt-3">
                    {money(project.result?.grandTotal || 0)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Area: {project.result?.constructionArea?.toFixed(0) || 0} sq ft
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <button onClick={() => openProject(project)} className="smallBtn">
                      Open
                    </button>
                    <button onClick={() => duplicateProject(project)} className="smallBtn">
                      Copy
                    </button>
                    <button onClick={() => deleteProject(project.id)} className="smallBtn">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <StyleBlock />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B1F] text-white pb-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-white/5 p-5">
          <div>
            <button
              onClick={() => setScreen("home")}
              className="text-sm text-orange-400 font-bold mb-2"
            >
              ← Back to Saved Projects
            </button>
            <h1 className="text-2xl md:text-4xl font-black">
              Home Construction Cost Calculator
            </h1>
            <p className="text-slate-300 mt-2">
              Practical construction estimate software / उपयोग में आसान घर निर्माण अनुमान.
            </p>
          </div>

          <button
            onClick={calculate}
            className="bg-orange-500 hover:bg-orange-600 rounded-2xl px-6 py-4 font-black"
          >
            Calculate Construction Cost
          </button>
        </div>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1 space-y-6">
            <Panel title="Step 1 — Plot Details / प्लॉट डिटेल्स">
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
<div className="grid grid-cols-2 gap-3">
  <Input
    label="Bedrooms / बेडरूम"
    value={form.bedrooms}
    onChange={(v) => updateForm("bedrooms", v)}
  />

  <Input
    label="Kitchens / किचन"
    value={form.kitchens}
    onChange={(v) => updateForm("kitchens", v)}
  />

  <Input
    label="Bathrooms / टॉयलेट"
    value={form.bathrooms}
    onChange={(v) => updateForm("bathrooms", v)}
  />

  <Input
    label="Halls / हॉल"
    value={form.halls}
    onChange={(v) => updateForm("halls", v)}
  />
</div>
            </Panel>

            <Panel title="Step 2 — Construction Type / क्वालिटी">
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
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-black">{key} / {item.hindi}</h3>
                      <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                    </div>
                    <span className="text-orange-400 font-black whitespace-nowrap">
                      {money(item.rate)}/sq ft
                    </span>
                  </div>
                </button>
              ))}
            </Panel>

            <Panel title="Step 3 — Location / लोकेशन">
              <div className="grid grid-cols-2 gap-3">
                <Input label="State / राज्य" value={form.state} onChange={(v) => updateForm("state", v)} />
                <Input label="City / शहर" value={form.city} onChange={(v) => updateForm("city", v)} />
              </div>
              <p className="text-xs text-slate-500">
                Used for local rate reference. You can manually edit material rates.
              </p>
            </Panel>

            <Panel title="Step 4 — Material Rates / मटेरियल रेट">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Cement ₹/bag" value={rates.cement} onChange={(v) => updateRate("cement", v)} />
                <Input label="Sand ₹/cft" value={rates.sand} onChange={(v) => updateRate("sand", v)} />
                <Input label="Aggregate ₹/cft" value={rates.aggregate} onChange={(v) => updateRate("aggregate", v)} />
                <Input label="Steel ₹/kg" value={rates.steel} onChange={(v) => updateRate("steel", v)} />
                <Input label="Brick ₹/piece" value={rates.brick} onChange={(v) => updateRate("brick", v)} />
              </div>
              <button
                onClick={calculate}
                className="w-full mt-2 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black py-4"
              >
                Calculate Construction Cost
              </button>
            </Panel>
          </div>

          <div className="xl:col-span-2 space-y-6">
            {!calculated && (
              <Panel title="SEO Guide / जानकारी">
                <SeoContent />
              </Panel>
            )}

            {calculated && (
              <div id="results-section" className="space-y-6">
                <Panel title="1. Construction Summary / निर्माण सारांश">
                  <div className="rounded-3xl bg-gradient-to-br from-orange-500/25 to-black/30 border border-orange-500/40 p-5">
                    <p className="text-orange-300 font-bold">Grand Total Project Budget</p>
                    <h2 className="text-4xl md:text-5xl font-black text-orange-400 mt-2">
                      {money(result.grandTotal)}
                    </h2>
                    <p className="text-sm text-slate-400 mt-2">
                      Construction Cost + Additional Hidden Cost
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Mini label="Construction Cost" value={money(result.constructionCost)} />
              <Mini
  label="Bedroom Cost"
  value={money(
    Number(form.bedrooms || 0) * 50000
  )}
/>

<Mini
  label="Kitchen Cost"
  value={money(
    Number(form.kitchens || 0) * 80000
  )}
/>

<Mini
  label="Bathroom Cost"
  value={money(
    Number(form.bathrooms || 0) * 60000
  )}
/>
                    <Mini label="Hidden Cost" value={money(result.additionalHiddenCost)} />
                    <Mini label="Construction Area" value={`${result.constructionArea.toFixed(0)} sq ft`} />
                    <Mini label="Cost / Sq Ft" value={money(result.costPerSqFt)} />
                    <Mini label="Cost / Sq M" value={money(result.costPerSqM)} />
                    <Mini label="Floors" value={result.floorCount} />
              <Mini
  label="Configuration"
  value={`${form.bedrooms}BHK`}
/>
  <Mini
  label="Rooms"
  value={`${form.bedrooms} Bed | ${form.kitchens} Kitchen | ${form.bathrooms} Bath`}
/>
                    <Mini label="Quality" value={form.quality} />
                    <Mini label="Duration" value={result.timeline.total} />
                  </div>
  <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mt-4">
  <h3 className="font-black text-orange-400 mb-3">
    House Configuration / घर की संरचना
  </h3>

  <div className="space-y-2">
    <Row
      label="Bedrooms"
      value={form.bedrooms}
    />

    <Row
      label="Kitchens"
      value={form.kitchens}
    />

    <Row
      label="Bathrooms"
      value={form.bathrooms}
    />

    <Row
      label="Halls"
      value={form.halls}
    />
  </div>
</div>
                </Panel>

                <Panel title="2. Detailed Cost Breakdown / खर्च का विवरण">
                  <div className="grid lg:grid-cols-2 gap-5">
                    <div className="h-72 rounded-2xl bg-black/20 border border-white/10 p-3">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={result.breakdown} dataKey="amount" nameKey="item" outerRadius={95}>
                            {result.breakdown.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => money(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-2">
                      {result.breakdown.map((b) => (
                        <Row key={b.item} label={`${b.item} (${b.percent}%)`} value={money(b.amount)} />
                      ))}
                    </div>
                  </div>
                </Panel>

                <Panel title="3. Material Cost Breakdown / सामग्री विवरण">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {result.materials.map((m) => (
                      <div key={m.pdfName} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                        <div className="flex justify-between gap-3">
                          <h3 className="font-black">{m.name}</h3>
                          <span className="text-orange-400 font-black">{money(m.amount)}</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-2">
                          Quantity: {m.qty.toFixed(2)} {m.unit}
                        </p>
                        <p className="text-sm text-slate-400">
                          Rate: {money(m.rate)} / {m.unit}
                        </p>
                      </div>
                    ))}
                  </div>
                </Panel>

                <Panel title="4. Room Recommendation / रूम सुझाव">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {result.roomRecommendation.rooms.map((room) => (
                      <Mini key={room.name} label={room.name} value={room.size} />
                    ))}
                  </div>
                  <p className="text-slate-400 text-sm">
                    Suggested Type: {result.roomRecommendation.type}
                  </p>
                </Panel>

                <Panel title="5. Construction Timeline / निर्माण समय">
                  <div className="space-y-2">
                    {result.timeline.stages.map((stage) => (
                      <Row key={stage.name} label={stage.name} value={stage.duration} />
                    ))}
                    <Row label="Total Time" value={result.timeline.total} />
                  </div>
                </Panel>

                <Panel title="6. BOQ Generation / स्टेज-वाइज BOQ">
                  <div className="space-y-3">
                    {Object.entries(result.boq).map(([stage, data]) => (
                      <div key={stage} className="rounded-2xl border border-white/10 overflow-hidden bg-black/20">
                        <button
                          onClick={() => setOpenBoq(openBoq === stage ? "" : stage)}
                          className="w-full flex justify-between p-4 font-black bg-white/5"
                        >
                          <span>{stage}</span>
                          <span className="text-orange-400">{openBoq === stage ? "−" : "+"}</span>
                        </button>
                        {openBoq === stage && (
                          <div className="p-4 space-y-2">
                            {Object.entries(data).map(([key, value]) => (
                              <Row key={key} label={key} value={value} />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Panel>

                <Panel title="7. Hidden Costs / अतिरिक्त छिपी हुई लागत">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input label="Architect Fees" value={hiddenCosts.architect} onChange={(v) => updateHiddenCost("architect", v)} />
                    <Input label="Structural Design" value={hiddenCosts.structural} onChange={(v) => updateHiddenCost("structural", v)} />
                    <Input label="Government Approval" value={hiddenCosts.approval} onChange={(v) => updateHiddenCost("approval", v)} />
                    <Input label="Water Connection" value={hiddenCosts.water} onChange={(v) => updateHiddenCost("water", v)} />
                    <Input label="Electricity Connection" value={hiddenCosts.electricity} onChange={(v) => updateHiddenCost("electricity", v)} />
                    <Input label="Borewell" value={hiddenCosts.borewell} onChange={(v) => updateHiddenCost("borewell", v)} />
                    <Input label="Boundary Wall" value={hiddenCosts.boundaryWall} onChange={(v) => updateHiddenCost("boundaryWall", v)} />
                    <Input label="GST %" value={hiddenCosts.gstPercent} onChange={(v) => updateHiddenCost("gstPercent", v)} />
                  </div>
                  <div className="rounded-2xl bg-orange-500/10 border border-orange-500/30 p-4">
                    <Row label="Additional Hidden Cost" value={money(result.additionalHiddenCost)} />
                    <Row label="Final Grand Total" value={money(result.grandTotal)} />
                  </div>
                </Panel>

                <Panel title="8. EMI Calculator / लोन EMI">
                  <div className="grid sm:grid-cols-3 gap-3">
                    <Input label="Loan Amount" value={emi.loanAmount} onChange={(v) => updateEmi("loanAmount", v)} />
                    <Input label="Interest %" value={emi.interestRate} onChange={(v) => updateEmi("interestRate", v)} />
                    <Input label="Years" value={emi.years} onChange={(v) => updateEmi("years", v)} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Mini label="Monthly EMI" value={money(result.emiSummary.monthlyEmi)} />
                    <Mini label="Total Interest" value={money(result.emiSummary.totalInterest)} />
                    <Mini label="Total Payment" value={money(result.emiSummary.totalPayment)} />
                    <Mini label="Loan Amount" value={money(result.emiSummary.loanAmount)} />
                  </div>
                </Panel>

                <Panel title="9. Save and Export / सेव और एक्सपोर्ट">
                  <div className="grid sm:grid-cols-4 gap-3">
                    <button onClick={saveProject} className="actionBtn">Save</button>
                    <button onClick={downloadPDF} className="actionBtn">PDF</button>
                    <button onClick={() => setOpenBoq("Foundation")} className="actionBtn">BOQ</button>
                    <button onClick={shareEstimate} className="actionBtn">Share</button>
                  </div>
                </Panel>

                <Panel title="SEO Guide / जानकारी">
                  <SeoContent />
                </Panel>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#050B1F]/95 border-t border-orange-500/30 p-3">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-2">
          <button onClick={saveProject} className="bottomBtn">Save</button>
          <button onClick={downloadPDF} className="bottomBtn">PDF</button>
          <button onClick={() => { setOpenBoq("Foundation"); document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" }); }} className="bottomBtn">BOQ</button>
          <button onClick={shareEstimate} className="bottomBtn">Share</button>
        </div>
      </div>

      <StyleBlock />
    </div>
  );
}

function getRoomRecommendation(area) {
  if (area < 700) {
    return {
      type: "Compact 1 BHK / छोटा 1 BHK",
      rooms: [
        { name: "Bedroom", size: "10 x 12 ft" },
        { name: "Kitchen", size: "8 x 10 ft" },
        { name: "Hall", size: "12 x 14 ft" },
        { name: "Bathroom", size: "5 x 7 ft" },
      ],
    };
  }

  if (area < 1200) {
    return {
      type: "Comfortable 2 BHK / अच्छा 2 BHK",
      rooms: [
        { name: "Bedroom 1", size: "12 x 12 ft" },
        { name: "Bedroom 2", size: "11 x 12 ft" },
        { name: "Kitchen", size: "10 x 10 ft" },
        { name: "Hall", size: "15 x 20 ft" },
        { name: "Bathroom", size: "5 x 8 ft" },
      ],
    };
  }

  return {
    type: "Spacious 3 BHK / बड़ा 3 BHK",
    rooms: [
      { name: "Master Bedroom", size: "14 x 16 ft" },
      { name: "Bedroom 2", size: "12 x 12 ft" },
      { name: "Bedroom 3", size: "11 x 12 ft" },
      { name: "Kitchen", size: "10 x 12 ft" },
      { name: "Hall", size: "16 x 22 ft" },
      { name: "Bathroom", size: "5 x 8 ft" },
    ],
  };
}

function getTimeline(area, floors) {
  const factor = Math.max(1, Math.ceil(area / 1000)) + Math.max(0, floors - 1);

  return {
    total: factor <= 2 ? "6–8 Months" : "8–12 Months",
    stages: [
      { name: "Excavation", duration: `${5 + factor} Days` },
      { name: "Foundation", duration: `${10 + factor * 2} Days` },
      { name: "RCC Work", duration: `${20 + factor * 5} Days` },
      { name: "Brick Work", duration: `${25 + factor * 4} Days` },
      { name: "Plaster", duration: `${15 + factor * 3} Days` },
      { name: "Flooring", duration: `${15 + factor * 2} Days` },
      { name: "Finishing", duration: `${30 + factor * 5} Days` },
    ],
  };
}

function Panel({ title, children }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl">
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
    <div className="rounded-2xl bg-black/20 border border-white/10 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-black text-white mt-1">{value}</p>
    </div>
  );
}

function SeoContent() {
  return (
    <div className="space-y-4 text-sm text-slate-300">
      <div>
        <h3 className="font-black text-white">What is House Construction Cost?</h3>
        <p>
          House construction cost is the estimated amount required to build a home,
          including foundation, RCC, brickwork, plaster, flooring, electrical,
          plumbing, finishing, hidden charges and labour.
        </p>
      </div>
      <div>
        <h3 className="font-black text-white">घर बनाने का खर्च क्या होता है?</h3>
        <p>
          घर बनाने का खर्च foundation, RCC, brickwork, plaster, flooring,
          electrical, plumbing, finishing और hidden costs को मिलाकर बनता है.
        </p>
      </div>
      <div>
        <h3 className="font-black text-white">Construction Cost Formula</h3>
        <p>
          Total Budget = Construction Area × Cost per sq ft + Additional Hidden Costs.
        </p>
      </div>
      <div>
        <h3 className="font-black text-white">Target Keywords</h3>
        <p>
          House Construction Cost Calculator, Building Cost Calculator, Home
          Construction Cost Estimator, Cost Per Square Foot Calculator,
          Construction Estimation Tool.
        </p>
      </div>
    </div>
  );
}

function StyleBlock() {
  return (
    <style jsx global>{`
      .bottomBtn,
      .actionBtn {
        background: rgba(255, 122, 0, 0.15);
        border: 1px solid rgba(255, 122, 0, 0.35);
        border-radius: 14px;
        padding: 12px 8px;
        font-weight: 900;
        color: white;
        font-size: 13px;
      }

      .actionBtn {
        padding: 14px 12px;
      }

      .smallBtn {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 12px;
        padding: 8px 10px;
        font-size: 12px;
        color: white;
        font-weight: 700;
      }

      input::placeholder {
        color: rgba(255, 255, 255, 0.35);
      }
    `}</style>
  );
}
