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

const createDefaultForm = () => ({
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
  includeStaircase: false,
  staircaseAreaStatus: "Included in Built-up Area",
  staircaseCount: "1",
  staircaseType: "RCC Dog-Legged",
  staircaseAccess: "Up to Terrace / Roof",
  staircaseFinish: "Standard",
  carParking: "0",
  balcony: "0",
  terrace: "0",
  basement: "0",
  lift: "0",
  quality: "Standard",
  state: "",
  city: "",
});

const defaultWastage = {
  cement: 5,
  steel: 3,
  sand: 8,
  aggregate: 8,
  brick: 5,
};

const numberValue = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const getFloorCountFromValue = (floors, customFloors) => {
  if (floors === "Ground") return 1;
  if (floors === "G+1") return 2;
  if (floors === "G+2") return 3;
  if (floors === "Custom") return Math.max(1, numberValue(customFloors, 1));
  return 1;
};

export default function HomeConstructionCalculator() {
  const { authFetch } = useAuth();
  const [screen, setScreen] = useState("home");
  const [calculated, setCalculated] = useState(false);
  const [savedProjects, setSavedProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [openBoq, setOpenBoq] = useState("Foundation");

  const [form, setForm] = useState(createDefaultForm);
  const [rates, setRates] = useState(defaultRates);
  const [wastage, setWastage] = useState(defaultWastage);
  const [hiddenCosts, setHiddenCosts] = useState(hiddenDefaults);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("homeConstructionProjects")) || [];
    setSavedProjects(saved);
  }, []);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateWastage = (field, value) => {
    setWastage((prev) => ({ ...prev, [field]: numberValue(value, 0) }));
  };

  const updateRate = (field, value) => {
    setRates((prev) => ({ ...prev, [field]: numberValue(value, 0) }));
  };

  const updateHiddenCost = (field, value) => {
    setHiddenCosts((prev) => ({ ...prev, [field]: numberValue(value, 0) }));
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
    const floorCount = getFloorCountFromValue(form.floors, form.customFloors);

    let baseArea = numberValue(form.builtUpArea, 0);

    if (!baseArea) {
      const length = numberValue(form.plotLength, 0);
      const width = numberValue(form.plotWidth, 0);
      baseArea = length * width;
    }

    if (form.unit === "sqm") {
      baseArea = baseArea * 10.7639;
    }

    const constructionArea = baseArea * floorCount;
    const costPerSqFt = qualityOptions[form.quality]?.rate || qualityOptions.Standard.rate;
    const baseConstructionCost = constructionArea * costPerSqFt;

    const staircaseCount = Math.max(1, numberValue(form.staircaseCount, 1));
    const staircaseLevels = form.includeStaircase
      ? form.staircaseAccess === "Up to Terrace / Roof"
        ? floorCount
        : Math.max(floorCount - 1, 1)
      : 0;

    const staircaseTypeMultiplier = {
      "RCC Dog-Legged": 1,
      "Straight Staircase": 0.95,
      "Open Well Staircase": 1.15,
      "Spiral Staircase": 1.3,
    };

    const staircaseFinishMultiplier = {
      Basic: 0.9,
      Standard: 1,
      Premium: 1.25,
    };

    const typeMultiplier = staircaseTypeMultiplier[form.staircaseType] || 1;
    const finishMultiplier = staircaseFinishMultiplier[form.staircaseFinish] || 1;

    const staircaseConcrete = staircaseLevels * staircaseCount * 2.5 * typeMultiplier;
    const staircaseSteel = staircaseLevels * staircaseCount * 250 * typeMultiplier;
    const staircaseShuttering = staircaseLevels * staircaseCount * 180 * typeMultiplier;
    const staircaseFinishingArea = staircaseLevels * staircaseCount * 120;
    const staircaseRailing = staircaseLevels * staircaseCount * 20;

    const staircaseEstimatedCost = form.includeStaircase
      ? baseConstructionCost * 0.035 * staircaseLevels * staircaseCount * typeMultiplier * finishMultiplier
      : 0;

    const staircaseExtraCost =
      form.includeStaircase && form.staircaseAreaStatus === "Not Included / Separate"
        ? staircaseEstimatedCost
        : 0;

    const bedroomCost = numberValue(form.bedrooms, 0) * 50000;
    const kitchenCost = numberValue(form.kitchens, 0) * 80000;
    const bathroomCost = numberValue(form.bathrooms, 0) * 60000;
    const hallCost = numberValue(form.halls, 0) * 40000;

    const parkingCost = numberValue(form.carParking, 0) * 100000;
    const balconyCost = numberValue(form.balcony, 0) * 50000;
    const terraceCost = numberValue(form.terrace, 0) * 75000;
    const basementCost = numberValue(form.basement, 0) * 400000;
    const liftCost = numberValue(form.lift, 0) * 1000000;

    const roomAdditionalCost = bedroomCost + kitchenCost + bathroomCost + hallCost;
    const optionalFeatureCost = parkingCost + balconyCost + terraceCost + basementCost + liftCost;

    const normalConstructionCost = baseConstructionCost + roomAdditionalCost + optionalFeatureCost;
    const constructionCost = normalConstructionCost + staircaseExtraCost;

    const gstAmount = constructionCost * (numberValue(hiddenCosts.gstPercent, 0) / 100);

    const additionalHiddenCost =
      numberValue(hiddenCosts.architect, 0) +
      numberValue(hiddenCosts.structural, 0) +
      numberValue(hiddenCosts.approval, 0) +
      numberValue(hiddenCosts.water, 0) +
      numberValue(hiddenCosts.electricity, 0) +
      numberValue(hiddenCosts.borewell, 0) +
      numberValue(hiddenCosts.boundaryWall, 0) +
      gstAmount;

    const grandTotal = constructionCost + additionalHiddenCost;

    const breakdown = [
      ...Object.entries(costPercentages).map(([item, percent]) => ({
        item,
        percent,
        amount: (normalConstructionCost * percent) / 100,
      })),
      ...(form.includeStaircase
        ? [
            {
              item:
                form.staircaseAreaStatus === "Included in Built-up Area"
                  ? "Staircase / सीढ़ी Work (Included)"
                  : "Staircase / सीढ़ी Work (Extra)",
              percent: constructionCost
                ? Number(((staircaseEstimatedCost / constructionCost) * 100).toFixed(1))
                : 0,
              amount: staircaseEstimatedCost,
            },
          ]
        : []),
    ];

    const cementBase = constructionArea * 0.4;
    const steelBase = constructionArea * 4;
    const sandBase = constructionArea * 0.045;
    const aggregateBase = constructionArea * 0.09;
    const bricksBase = constructionArea * 8;

    const cementBags = cementBase + (cementBase * numberValue(wastage.cement, 0)) / 100;
    const steelKg = steelBase + (steelBase * numberValue(wastage.steel, 0)) / 100;
    const sandCft = sandBase + (sandBase * numberValue(wastage.sand, 0)) / 100;
    const aggregateCft = aggregateBase + (aggregateBase * numberValue(wastage.aggregate, 0)) / 100;
    const bricks = bricksBase + (bricksBase * numberValue(wastage.brick, 0)) / 100;

    const foundationShutteringArea = constructionArea * 0.15;
    const columnShutteringArea = constructionArea * 0.25;
    const beamShutteringArea = constructionArea * 0.35;
    const slabShutteringArea = constructionArea * 1.0;
    const staircaseShutteringArea = form.includeStaircase ? staircaseShuttering : 0;
    const totalShutteringArea =
      foundationShutteringArea +
      columnShutteringArea +
      beamShutteringArea +
      slabShutteringArea +
      staircaseShutteringArea;

    const plywoodSheetArea = 32;
    const plywoodReuseFactor = 4;
    const plywoodSheets = totalShutteringArea
      ? Math.ceil(totalShutteringArea / (plywoodSheetArea * plywoodReuseFactor))
      : 0;
    const timberCft = totalShutteringArea * 0.03;
    const nailsKg = totalShutteringArea * 0.015;
    const formOilLitre = totalShutteringArea * 0.015;
    const propsNos = slabShutteringArea ? Math.ceil(slabShutteringArea / 25) : 0;

    const materials = [
      {
        name: "Cement / सीमेंट",
        pdfName: "Cement",
        baseQty: cementBase,
        wastageQty: (cementBase * numberValue(wastage.cement, 0)) / 100,
        qty: cementBags,
        unit: "Bags",
        rate: rates.cement,
        amount: cementBags * rates.cement,
      },
      {
        name: "Steel / स्टील",
        pdfName: "Steel",
        baseQty: steelBase,
        wastageQty: (steelBase * numberValue(wastage.steel, 0)) / 100,
        qty: steelKg,
        unit: "Kg",
        rate: rates.steel,
        amount: steelKg * rates.steel,
      },
      {
        name: "Sand / रेत",
        pdfName: "Sand",
        baseQty: sandBase,
        wastageQty: (sandBase * numberValue(wastage.sand, 0)) / 100,
        qty: sandCft,
        unit: "Cft",
        rate: rates.sand,
        amount: sandCft * rates.sand,
      },
      {
        name: "Aggregate / गिट्टी",
        pdfName: "Aggregate",
        baseQty: aggregateBase,
        wastageQty: (aggregateBase * numberValue(wastage.aggregate, 0)) / 100,
        qty: aggregateCft,
        unit: "Cft",
        rate: rates.aggregate,
        amount: aggregateCft * rates.aggregate,
      },
      {
        name: "Bricks / ईंट",
        pdfName: "Bricks",
        baseQty: bricksBase,
        wastageQty: (bricksBase * numberValue(wastage.brick, 0)) / 100,
        qty: bricks,
        unit: "Nos",
        rate: rates.brick,
        amount: bricks * rates.brick,
      },
      {
        name: "Shuttering Area / शटरिंग एरिया",
        pdfName: "Shuttering Area",
        baseQty: totalShutteringArea,
        wastageQty: 0,
        qty: totalShutteringArea,
        unit: "sq ft",
        rate: 0,
        amount: 0,
        referenceOnly: true,
      },
      {
        name: "Plywood Sheets / प्लाईवुड शीट",
        pdfName: "Plywood Sheets 8x4",
        baseQty: plywoodSheets,
        wastageQty: 0,
        qty: plywoodSheets,
        unit: "Sheets",
        rate: 0,
        amount: 0,
        referenceOnly: true,
      },
      {
        name: "Timber / Wooden Batten / लकड़ी",
        pdfName: "Timber / Wooden Batten",
        baseQty: timberCft,
        wastageQty: 0,
        qty: timberCft,
        unit: "Cft",
        rate: 0,
        amount: 0,
        referenceOnly: true,
      },
      {
        name: "Nails / कील",
        pdfName: "Nails",
        baseQty: nailsKg,
        wastageQty: 0,
        qty: nailsKg,
        unit: "Kg",
        rate: 0,
        amount: 0,
        referenceOnly: true,
      },
      {
        name: "Form Oil / फॉर्म ऑयल",
        pdfName: "Form Oil",
        baseQty: formOilLitre,
        wastageQty: 0,
        qty: formOilLitre,
        unit: "Litre",
        rate: 0,
        amount: 0,
        referenceOnly: true,
      },
      {
        name: "Props / Supports / सपोर्ट",
        pdfName: "Props / Supports",
        baseQty: propsNos,
        wastageQty: 0,
        qty: propsNos,
        unit: "Nos",
        rate: 0,
        amount: 0,
        referenceOnly: true,
      },
    ];

    const shuttering = {
      foundation: foundationShutteringArea,
      column: columnShutteringArea,
      beam: beamShutteringArea,
      slab: slabShutteringArea,
      staircase: staircaseShutteringArea,
      totalArea: totalShutteringArea,
      plywoodSheets,
      timberCft,
      nailsKg,
      formOilLitre,
      propsNos,
      note: "Quantity reference only. Cost is assumed included in construction rate unless contractor quotes separately.",
    };

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
        Cost: money(constructionCost * 0.2),
      },
      ...(form.includeStaircase
        ? {
            Staircase: {
              "Staircase Type": form.staircaseType,
              "Access Type": form.staircaseAccess,
              "Area Status": form.staircaseAreaStatus,
              "No. of Staircases": `${staircaseCount} nos`,
              "Staircase Levels": `${staircaseLevels} level`,
              "Concrete Approx.": `${staircaseConcrete.toFixed(2)} m3`,
              "Steel Approx.": `${staircaseSteel.toFixed(2)} kg`,
              "Shuttering Approx.": `${staircaseShuttering.toFixed(2)} sq ft`,
              "Finishing Area": `${staircaseFinishingArea.toFixed(2)} sq ft`,
              "Railing Length": `${staircaseRailing.toFixed(2)} rft`,
              "Estimated Staircase Cost": money(staircaseEstimatedCost),
              "Extra Added in Total": money(staircaseExtraCost),
            },
          }
        : {}),
      "Shuttering / Formwork": {
        "Foundation Formwork": `${foundationShutteringArea.toFixed(0)} sq ft`,
        "Column Formwork": `${columnShutteringArea.toFixed(0)} sq ft`,
        "Beam Formwork": `${beamShutteringArea.toFixed(0)} sq ft`,
        "Slab Formwork": `${slabShutteringArea.toFixed(0)} sq ft`,
        "Staircase Formwork": `${staircaseShutteringArea.toFixed(0)} sq ft`,
        "Total Shuttering Area": `${totalShutteringArea.toFixed(0)} sq ft`,
        "Plywood Sheets 8x4": `${plywoodSheets} sheets`,
        "Timber / Wooden Batten": `${timberCft.toFixed(2)} cft`,
        Nails: `${nailsKg.toFixed(2)} kg`,
        "Form Oil": `${formOilLitre.toFixed(2)} litre`,
        "Props / Supports": `${propsNos} nos`,
        Note: "Shuttering material quantities are for reference. Cost is considered included in construction rate.",
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
        Cost: money(constructionCost * 0.08),
      },
      Finishing: {
        "Paint Quantity": `${(constructionArea * 0.18).toFixed(2)} litres`,
        Doors: `${Math.ceil(constructionArea / 350)} nos`,
        Windows: `${Math.ceil(constructionArea / 300)} nos`,
        Cost: money(constructionCost * 0.08),
      },
      "Optional Features": {
        Bedrooms: form.bedrooms || 0,
        Kitchens: form.kitchens || 0,
        Bathrooms: form.bathrooms || 0,
        Halls: form.halls || 0,
        Parking: form.carParking || 0,
        Balcony: form.balcony || 0,
        Terrace: form.terrace || 0,
        Basement: form.basement || 0,
        Lift: form.lift || 0,
        "Room Allowance": money(roomAdditionalCost),
        "Feature Cost": money(optionalFeatureCost),
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
        ...Array.from({ length: numberValue(form.bedrooms, 0) }, (_, i) => ({
          name: `Bedroom ${i + 1}`,
          size: "12 x 12 ft",
        })),
        ...Array.from({ length: numberValue(form.kitchens, 0) }, (_, i) => ({
          name: `Kitchen ${i + 1}`,
          size: "10 x 10 ft",
        })),
        ...Array.from({ length: numberValue(form.bathrooms, 0) }, (_, i) => ({
          name: `Bathroom ${i + 1}`,
          size: "5 x 8 ft",
        })),
        ...Array.from({ length: numberValue(form.halls, 0) }, (_, i) => ({
          name: `Hall ${i + 1}`,
          size: "15 x 20 ft",
        })),
      ],
    };

    const timeline = getTimeline(constructionArea, floorCount, form.includeStaircase);

    return {
      floorCount,
      constructionArea,
      costPerSqFt,
      costPerSqM: costPerSqFt * 10.7639,
      baseConstructionCost,
      roomAdditionalCost,
      optionalFeatureCost,
      constructionCost,
      additionalHiddenCost,
      grandTotal,
      gstAmount,
      breakdown,
      staircase: {
        included: form.includeStaircase,
        areaStatus: form.staircaseAreaStatus || "Included in Built-up Area",
        count: staircaseCount,
        type: form.staircaseType || "RCC Dog-Legged",
        access: form.staircaseAccess || "Up to Terrace / Roof",
        finish: form.staircaseFinish || "Standard",
        levels: staircaseLevels,
        cost: staircaseEstimatedCost,
        extraCost: staircaseExtraCost,
        concrete: staircaseConcrete,
        steel: staircaseSteel,
        shuttering: staircaseShuttering,
        finishingArea: staircaseFinishingArea,
        railing: staircaseRailing,
      },
      shuttering,
      materials,
      boq,
      hiddenList,
      roomRecommendation,
      timeline,
    };
  }, [form, rates, hiddenCosts, wastage]);

  const startNewEstimate = () => {
    setForm(createDefaultForm());
    setRates(defaultRates);
    setWastage(defaultWastage);
    setHiddenCosts(hiddenDefaults);
    setCalculated(false);
    setEditingId(null);
    setOpenBoq("Foundation");
    setScreen("calculator");
  };

  const calculate = () => {
    if (!form.builtUpArea && (!form.plotLength || !form.plotWidth)) {
      alert("Please enter Built-up Area or Plot Length + Plot Width.");
      return;
    }

    setCalculated(true);

    saveCalculationHistory(
      authFetch,
      "home-construction",
      {
        form,
        rates,
        wastage,
        hiddenCosts,
      },
      result
    ).catch(() => {});

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
      wastage,
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
    alert("Project Saved Successfully");
  };

  const openProject = (project) => {
    setEditingId(project.id);
    setForm({ ...createDefaultForm(), ...(project.form || {}) });
    setRates({ ...defaultRates, ...(project.rates || {}) });
    setWastage({ ...defaultWastage, ...(project.wastage || {}) });
    setHiddenCosts({ ...hiddenDefaults, ...(project.hiddenCosts || {}) });
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
        ...createDefaultForm(),
        ...(project.form || {}),
        projectName: `${project.form?.projectName || "Untitled"} Copy`,
      },
      updatedAt: new Date().toISOString(),
    };
    const updated = [copy, ...savedProjects];
    localStorage.setItem("homeConstructionProjects", JSON.stringify(updated));
    setSavedProjects(updated);
  };

  const shareEstimate = async () => {
    const text = `CivilCalc Pro Home Construction Estimate\nProject: ${
      form.projectName || "N/A"
    }\nConstruction Cost: ${money(result.constructionCost)}\nAdditional Hidden Cost: ${money(
      result.additionalHiddenCost
    )}\nGrand Total: ${money(result.grandTotal)}\nConstruction Area: ${result.constructionArea.toFixed(
      0
    )} sq ft`;

    if (navigator.share) {
      await navigator.share({ title: "Home Construction Estimate", text });
    } else {
      await navigator.clipboard.writeText(text);
      alert("Estimate copied to clipboard");
    }
  };

  const downloadPDF = () => {
    if (!calculated) {
      alert("Please calculate estimate first, then download PDF.");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const ORANGE = [255, 122, 0];
    const NAVY = [5, 11, 31];
    const DARK = [15, 23, 42];
    const LIGHT = [248, 250, 252];
    const GREY = [100, 116, 139];

    const margin = 14;
    const today = new Date().toLocaleDateString("en-IN");

    const safeText = (value) =>
      String(value ?? "-")
        .replace(/₹/g, "Rs.")
        .replace(/–/g, "-")
        .replace(/—/g, "-")
        .replace(/“|”/g, '"')
        .replace(/’/g, "'");

    const safeFileName = (form.projectName || "civilcalc-home-estimate")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const sectionTitle = (title, y) => {
      doc.setTextColor(...NAVY);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin, y);
      doc.setDrawColor(...ORANGE);
      doc.setLineWidth(0.7);
      doc.line(margin, y + 2.5, pageWidth - margin, y + 2.5);
    };

    const addHeader = (title) => {
      doc.setFillColor(...NAVY);
      doc.rect(0, 0, pageWidth, 24, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("CivilCalc Pro", margin, 10);
      doc.setTextColor(...ORANGE);
      doc.setFontSize(10);
      doc.text(title, margin, 17);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(today, pageWidth - margin, 10, { align: "right" });
    };

    const addFooterToAllPages = () => {
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);
        doc.setFontSize(8);
        doc.setTextColor(...GREY);
        doc.setFont("helvetica", "normal");
        doc.text("Generated by CivilCalc Pro - civilcalcpro.in", margin, pageHeight - 10);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, {
          align: "right",
        });
      }
    };

    const summaryCard = (x, y, w, h, label, value, highlight = false) => {
      doc.setFillColor(highlight ? 255 : 248, highlight ? 122 : 250, highlight ? 0 : 252);
      doc.roundedRect(x, y, w, h, 3, 3, "F");
      doc.setDrawColor(highlight ? 255 : 226, highlight ? 122 : 232, highlight ? 0 : 240);
      doc.roundedRect(x, y, w, h, 3, 3, "S");
      doc.setTextColor(highlight ? 255 : 100, highlight ? 255 : 116, highlight ? 255 : 139);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(label, x + 4, y + 7);
      doc.setTextColor(highlight ? 255 : 15, highlight ? 255 : 23, highlight ? 255 : 42);
      doc.setFontSize(highlight ? 14 : 12);
      doc.setFont("helvetica", "bold");
      doc.text(safeText(value), x + 4, y + 16);
    };

    const formattedRate = (m) => (m.referenceOnly ? "Included" : pdfMoney(m.rate));
    const formattedAmount = (m) => (m.referenceOnly ? "Included in rate" : pdfMoney(m.amount));

    doc.setProperties({
      title: "Home Construction Cost Estimate",
      subject: "CivilCalc Pro Home Construction Estimate Report",
      author: "CivilCalc Pro",
      creator: "CivilCalc Pro",
    });

    // PAGE 1 — COVER + SUMMARY
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, pageWidth, 78, "F");
    doc.setTextColor(...ORANGE);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("CivilCalc Pro", margin, 22);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("Home Construction Cost Estimate Report", margin, 36);
    doc.setTextColor(203, 213, 225);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Professional construction budget, material estimate, BOQ and timeline report", margin, 45);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(`Report Date: ${today}`, margin, 58);
    doc.text(`Project: ${safeText(form.projectName || "Not Provided")}`, margin, 65);
    doc.text(`Owner: ${safeText(form.ownerName || "Not Provided")}`, margin, 72);

    summaryCard(margin, 90, pageWidth - margin * 2, 28, "GRAND TOTAL PROJECT BUDGET", pdfMoney(result.grandTotal), true);

    const cardW = (pageWidth - margin * 2 - 9) / 4;
    summaryCard(margin, 126, cardW, 24, "Construction Cost", pdfMoney(result.constructionCost));
    summaryCard(margin + cardW + 3, 126, cardW, 24, "Hidden Cost", pdfMoney(result.additionalHiddenCost));
    summaryCard(margin + (cardW + 3) * 2, 126, cardW, 24, "Area", `${result.constructionArea.toFixed(0)} sq ft`);
    summaryCard(margin + (cardW + 3) * 3, 126, cardW, 24, "Rate / sq ft", pdfMoney(result.costPerSqFt));

    sectionTitle("Project Details", 165);

    autoTable(doc, {
      startY: 172,
      head: [["Field", "Value"]],
      body: [
        ["Project Name", safeText(form.projectName || "Not Provided")],
        ["Owner Name", safeText(form.ownerName || "Not Provided")],
        ["Plot Size", `${form.plotLength || "-"} x ${form.plotWidth || "-"} ft`],
        ["Built-up Area", `${form.builtUpArea || "-"} ${form.unit}`],
        ["Floors", form.floors === "Custom" ? `${form.customFloors || "-"} Floors` : form.floors],
        ["Location", `${form.city || "-"}, ${form.state || "-"}`],
        ["Construction Quality", form.quality],
        [
          "Staircase",
          result.staircase.included
            ? `${result.staircase.type} - ${
                result.staircase.access === "Up to Terrace / Roof" ? "Ground to Terrace" : "Up to Selected Floor"
              }`
            : "Not Included",
        ],
        ["Staircase Area Status", result.staircase.included ? result.staircase.areaStatus : "-"],
        ["Construction Area", `${result.constructionArea.toFixed(0)} sq ft`],
        ["Estimated Duration", result.timeline.total],
      ],
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
        textColor: DARK,
        lineColor: [226, 232, 240],
        lineWidth: 0.2,
      },
      headStyles: { fillColor: ORANGE, textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: LIGHT },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 55 }, 1: { cellWidth: 115 } },
    });

    // PAGE 2 — COST BREAKDOWN
    doc.addPage();
    addHeader("Cost Breakdown");
    sectionTitle("Cost Summary", 36);

    autoTable(doc, {
      startY: 43,
      head: [["Cost Head", "Amount"]],
      body: [
        ["Base Construction Cost", pdfMoney(result.baseConstructionCost)],
        ["Room Allowance", pdfMoney(result.roomAdditionalCost)],
        ["Optional Feature Cost", pdfMoney(result.optionalFeatureCost)],
        ["Staircase Estimate", result.staircase.included ? pdfMoney(result.staircase.cost) : "Not Included"],
        ["Staircase Extra Added", result.staircase.included ? pdfMoney(result.staircase.extraCost) : "Not Included"],
        ["Additional Hidden Cost", pdfMoney(result.additionalHiddenCost)],
        ["Grand Total Project Budget", pdfMoney(result.grandTotal)],
        ["Cost Per Sq Ft", pdfMoney(result.costPerSqFt)],
        ["Cost Per Sq M", pdfMoney(result.costPerSqM)],
      ],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3, lineColor: [226, 232, 240], textColor: DARK },
      headStyles: { fillColor: ORANGE, textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: { 0: { fontStyle: "bold" }, 1: { halign: "right", fontStyle: "bold" } },
    });

    sectionTitle("Detailed Work-wise Cost Breakdown", doc.lastAutoTable.finalY + 14);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 21,
      head: [["Work Category", "Percentage", "Amount"]],
      body: result.breakdown.map((b) => [safeText(b.item), `${b.percent}%`, pdfMoney(b.amount)]),
      theme: "striped",
      styles: { fontSize: 9, cellPadding: 3, textColor: DARK, lineColor: [226, 232, 240] },
      headStyles: { fillColor: ORANGE, textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: { 1: { halign: "center" }, 2: { halign: "right", fontStyle: "bold" } },
    });

    if (result.staircase.included) {
      sectionTitle("Staircase Details", doc.lastAutoTable.finalY + 14);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 21,
        head: [["Staircase Item", "Value"]],
        body: [
          ["Area Status", safeText(result.staircase.areaStatus)],
          ["Access", result.staircase.access === "Up to Terrace / Roof" ? "Ground to Terrace" : "Up to Selected Floor"],
          ["No. of Staircases", result.staircase.count],
          ["Staircase Levels", result.staircase.levels],
          ["Type", safeText(result.staircase.type)],
          ["Finish Quality", safeText(result.staircase.finish)],
          ["Estimated Staircase Cost", pdfMoney(result.staircase.cost)],
          ["Extra Added in Total", pdfMoney(result.staircase.extraCost)],
          ["Concrete Approx.", `${result.staircase.concrete.toFixed(2)} m3`],
          ["Steel Approx.", `${result.staircase.steel.toFixed(0)} kg`],
          ["Shuttering Approx.", `${result.staircase.shuttering.toFixed(0)} sq ft`],
          ["Railing Approx.", `${result.staircase.railing.toFixed(0)} rft`],
        ],
        theme: "grid",
        styles: { fontSize: 9, cellPadding: 3, textColor: DARK, lineColor: [226, 232, 240] },
        headStyles: { fillColor: ORANGE, textColor: [255, 255, 255], fontStyle: "bold" },
        columnStyles: { 0: { fontStyle: "bold" }, 1: { halign: "right", fontStyle: "bold" } },
      });
    }

    // PAGE 3 — MATERIAL SUMMARY
    doc.addPage();
    addHeader("Material Requirement");
    sectionTitle("Material Quantity and Cost", 36);

    autoTable(doc, {
      startY: 43,
      head: [["Material", "Base Qty", "Wastage Qty", "Final Qty", "Unit", "Rate", "Amount"]],
      body: result.materials.map((m) => [
        safeText(m.pdfName),
        Number(m.baseQty || 0).toFixed(2),
        Number(m.wastageQty || 0).toFixed(2),
        Number(m.qty || 0).toFixed(2),
        safeText(m.unit),
        formattedRate(m),
        formattedAmount(m),
      ]),
      theme: "grid",
      styles: { fontSize: 8.2, cellPadding: 2.4, textColor: DARK, lineColor: [226, 232, 240] },
      headStyles: { fillColor: ORANGE, textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: {
        0: { fontStyle: "bold" },
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right", fontStyle: "bold" },
        5: { halign: "right" },
        6: { halign: "right", fontStyle: "bold" },
      },
    });

    sectionTitle("Shuttering / Formwork Material", doc.lastAutoTable.finalY + 14);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 21,
      head: [["Item", "Quantity"]],
      body: [
        ["Foundation Formwork", `${result.shuttering.foundation.toFixed(0)} sq ft`],
        ["Column Formwork", `${result.shuttering.column.toFixed(0)} sq ft`],
        ["Beam Formwork", `${result.shuttering.beam.toFixed(0)} sq ft`],
        ["Slab Formwork", `${result.shuttering.slab.toFixed(0)} sq ft`],
        ["Staircase Formwork", `${result.shuttering.staircase.toFixed(0)} sq ft`],
        ["Total Shuttering Area", `${result.shuttering.totalArea.toFixed(0)} sq ft`],
        ["Plywood Sheets 8x4", `${result.shuttering.plywoodSheets} sheets`],
        ["Timber / Wooden Batten", `${result.shuttering.timberCft.toFixed(2)} cft`],
        ["Nails", `${result.shuttering.nailsKg.toFixed(2)} kg`],
        ["Form Oil", `${result.shuttering.formOilLitre.toFixed(2)} litre`],
        ["Props / Supports", `${result.shuttering.propsNos} nos`],
      ],
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 3, textColor: DARK, lineColor: [226, 232, 240] },
      headStyles: { fillColor: ORANGE, textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: { 0: { fontStyle: "bold" }, 1: { halign: "right", fontStyle: "bold" } },
    });

    // PAGE 4 — BOQ
    doc.addPage();
    addHeader("Stage-wise BOQ");
    sectionTitle("Stage-wise BOQ Estimate", 36);

    let y = 45;
    Object.entries(result.boq).forEach(([stage, data]) => {
      if (y > 245) {
        doc.addPage();
        addHeader("Stage-wise BOQ");
        y = 36;
      }

      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 9, 2, 2, "F");
      doc.setTextColor(...NAVY);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(safeText(stage), margin + 3, y + 6);

      autoTable(doc, {
        startY: y + 12,
        head: [["Item", "Value"]],
        body: Object.entries(data).map(([key, value]) => [safeText(key), safeText(value)]),
        theme: "grid",
        styles: { fontSize: 8.5, cellPadding: 2.5, textColor: DARK, lineColor: [226, 232, 240] },
        headStyles: { fillColor: ORANGE, textColor: [255, 255, 255], fontStyle: "bold" },
        columnStyles: { 0: { fontStyle: "bold", cellWidth: 70 }, 1: { halign: "right" } },
      });

      y = doc.lastAutoTable.finalY + 10;
    });

    // PAGE 5 — HIDDEN COSTS + TIMELINE
    doc.addPage();
    addHeader("Hidden Cost and Timeline");
    sectionTitle("Additional Hidden Costs", 36);

    autoTable(doc, {
      startY: 43,
      head: [["Hidden Cost Item", "Amount"]],
      body: result.hiddenList.map(([label, value]) => [safeText(label), pdfMoney(value)]),
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 3, textColor: DARK, lineColor: [226, 232, 240] },
      headStyles: { fillColor: ORANGE, textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: { 0: { fontStyle: "bold" }, 1: { halign: "right", fontStyle: "bold" } },
    });

    sectionTitle("Construction Timeline", doc.lastAutoTable.finalY + 14);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 21,
      head: [["Stage", "Duration"]],
      body: [
        ...result.timeline.stages.map((stage) => [safeText(stage.name), safeText(stage.duration)]),
        ["Total Estimated Time", safeText(result.timeline.total)],
      ],
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 3, textColor: DARK, lineColor: [226, 232, 240] },
      headStyles: { fillColor: ORANGE, textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: { 0: { fontStyle: "bold" }, 1: { halign: "right", fontStyle: "bold" } },
    });

    // PAGE 6 — ROOM RECOMMENDATION + DISCLAIMER
    doc.addPage();
    addHeader("Room Recommendation and Notes");
    sectionTitle("Room Recommendation", 36);

    autoTable(doc, {
      startY: 43,
      head: [["Room", "Recommended Size"]],
      body: result.roomRecommendation.rooms.map((room) => [safeText(room.name), safeText(room.size)]),
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 3, textColor: DARK, lineColor: [226, 232, 240] },
      headStyles: { fillColor: ORANGE, textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: { 0: { fontStyle: "bold" }, 1: { halign: "right" } },
    });

    sectionTitle("Important Notes and Disclaimer", doc.lastAutoTable.finalY + 18);

    const notes = [
      "This report is an approximate construction cost estimate generated using user inputs and standard construction assumptions.",
      "Actual cost may vary depending on site condition, structural design, material quality, market rates, labour charges and local authority requirements.",
      "If staircase area is included in built-up area, staircase cost is shown for reference and BOQ purpose only. It is not added again to the grand total.",
      "Shuttering/formwork quantities are approximate planning quantities. Cost is assumed included in construction rate unless quoted separately by contractor.",
      "Final BOQ and structural quantities should be verified by a qualified civil engineer or licensed professional before execution.",
      "Future contractor-connect feature can use project area/city to show nearby construction companies and enquiry leads.",
    ];

    let noteY = doc.lastAutoTable.finalY + 28;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...DARK);

    notes.forEach((note, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${note}`, pageWidth - margin * 2);
      doc.text(lines, margin, noteY);
      noteY += lines.length * 5 + 2;
    });

    doc.setFillColor(...NAVY);
    doc.roundedRect(margin, pageHeight - 55, pageWidth - margin * 2, 25, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("CivilCalc Pro", margin + 5, pageHeight - 43);
    doc.setTextColor(...ORANGE);
    doc.setFontSize(9);
    doc.text("Professional Civil Engineering Calculators and Estimation Tools", margin + 5, pageHeight - 35);

    addFooterToAllPages();
    doc.save(`${safeFileName || "civilcalc-home-estimate"}.pdf`);
  };

  if (screen === "home") {
    return (
      <div className="min-h-screen bg-[#050B1F] text-white p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-white/5 p-6">
            <p className="text-orange-400 text-sm font-bold">CivilCalc Pro / सिविलकैल्क प्रो</p>
            <h1 className="text-3xl md:text-5xl font-black mt-2">Home Construction Assistant</h1>
            <p className="text-slate-300 mt-3 max-w-3xl">
              Complete house construction estimate with cost breakdown, material quantities, BOQ,
              shuttering/formwork quantity, hidden costs and PDF report.
              <br />
              घर बनाने का पूरा खर्च, मटेरियल, BOQ, shuttering और PDF रिपोर्ट एक जगह.
            </p>

            <button
              onClick={startNewEstimate}
              className="mt-6 bg-orange-500 hover:bg-orange-600 px-6 py-4 rounded-2xl font-black w-full sm:w-auto"
            >
              + New Home Calculator / नया अनुमान बनाएं
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
            <h2 className="text-xl font-black mb-5">Saved Projects / सेव किए हुए प्रोजेक्ट</h2>

            {savedProjects.length === 0 && (
              <p className="text-slate-500">No saved projects available. अभी कोई saved project नहीं है.</p>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {savedProjects.map((project) => (
                <div key={project.id} className="rounded-2xl border border-white/10 p-4 bg-black/20">
                  <h3 className="font-bold">{project.form?.projectName || "Untitled Project"}</h3>
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
            <button onClick={() => setScreen("home")} className="text-sm text-orange-400 font-bold mb-2">
              ← Back to Saved Projects
            </button>
            <h1 className="text-2xl md:text-4xl font-black">Home Construction Cost Calculator</h1>
            <p className="text-slate-300 mt-2">
              Practical construction estimate software / उपयोग में आसान घर निर्माण अनुमान.
            </p>
          </div>

          <button onClick={calculate} className="bg-orange-500 hover:bg-orange-600 rounded-2xl px-6 py-4 font-black">
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
                <Select
                  label="Floors / मंजिल"
                  value={form.floors}
                  onChange={(v) => {
                    setForm((prev) => ({
                      ...prev,
                      floors: v,
                      includeStaircase: v === "Ground" ? false : true,
                      staircaseAccess: v === "Ground" ? prev.staircaseAccess : "Up to Terrace / Roof",
                      staircaseAreaStatus:
                        v === "Ground" ? prev.staircaseAreaStatus : "Included in Built-up Area",
                    }));
                  }}
                  options={["Ground", "G+1", "G+2", "Custom"]}
                />
              </div>

              {form.floors === "Custom" && (
                <Input label="Custom Floors / मंजिल संख्या" value={form.customFloors} onChange={(v) => updateForm("customFloors", v)} />
              )}

              <div className="grid grid-cols-2 gap-3">
                <Input label="Bedrooms / बेडरूम" value={form.bedrooms} onChange={(v) => updateForm("bedrooms", v)} />
                <Input label="Kitchens / किचन" value={form.kitchens} onChange={(v) => updateForm("kitchens", v)} />
                <Input label="Bathrooms / टॉयलेट" value={form.bathrooms} onChange={(v) => updateForm("bathrooms", v)} />
                <Input label="Halls / हॉल" value={form.halls} onChange={(v) => updateForm("halls", v)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input label="Car Parking / पार्किंग" value={form.carParking} onChange={(v) => updateForm("carParking", v)} />
                <Input label="Balcony / बालकनी" value={form.balcony} onChange={(v) => updateForm("balcony", v)} />
                <Input label="Terrace / टैरेस" value={form.terrace} onChange={(v) => updateForm("terrace", v)} />
                <Input label="Basement / बेसमेंट" value={form.basement} onChange={(v) => updateForm("basement", v)} />
                <Input label="Lift / लिफ्ट" value={form.lift} onChange={(v) => updateForm("lift", v)} />
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
                      <h3 className="font-black">
                        {key} / {item.hindi}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                    </div>
                    <span className="text-orange-400 font-black whitespace-nowrap">{money(item.rate)}/sq ft</span>
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
                Used for local rate reference. Future contractor-connect can use this city/area.
              </p>
            </Panel>

            <Panel title="Step 4 — Staircase Details / सीढ़ी विवरण">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                <div>
                  <p className="text-sm font-semibold text-white">Include Staircase / सीढ़ी जोड़ें</p>
                  <p className="text-xs text-slate-500">For G+1, G+2 or terrace access house estimate.</p>
                </div>

                <input
                  type="checkbox"
                  checked={form.includeStaircase}
                  onChange={(e) => updateForm("includeStaircase", e.target.checked)}
                  className="h-5 w-5 accent-orange-500"
                />
              </div>

              {form.includeStaircase && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Input label="No. of Staircases" value={form.staircaseCount} onChange={(v) => updateForm("staircaseCount", v)} />

                  <Select
                    label="Staircase Type"
                    value={form.staircaseType}
                    onChange={(v) => updateForm("staircaseType", v)}
                    options={["RCC Dog-Legged", "Straight Staircase", "Open Well Staircase", "Spiral Staircase"]}
                  />

                  <Select
                    label="Staircase Access"
                    value={form.staircaseAccess}
                    onChange={(v) => updateForm("staircaseAccess", v)}
                    options={["Up to Selected Floor Only", "Up to Terrace / Roof"]}
                  />

                  <Select
                    label="Area Status"
                    value={form.staircaseAreaStatus}
                    onChange={(v) => updateForm("staircaseAreaStatus", v)}
                    options={["Included in Built-up Area", "Not Included / Separate"]}
                  />

                  <Select
                    label="Finish Quality"
                    value={form.staircaseFinish}
                    onChange={(v) => updateForm("staircaseFinish", v)}
                    options={["Basic", "Standard", "Premium"]}
                  />
                </div>
              )}

              <p className="text-xs text-slate-500 mt-3">
                If staircase is already inside built-up area, extra cost will be ₹0. If staircase is separate,
                its extra cost will be added to total.
              </p>
            </Panel>

            <Panel title="Step 5 — Material Rates / मटेरियल रेट">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Cement ₹/bag" value={rates.cement} onChange={(v) => updateRate("cement", v)} />
                <Input label="Sand ₹/cft" value={rates.sand} onChange={(v) => updateRate("sand", v)} />
                <Input label="Aggregate ₹/cft" value={rates.aggregate} onChange={(v) => updateRate("aggregate", v)} />
                <Input label="Steel ₹/kg" value={rates.steel} onChange={(v) => updateRate("steel", v)} />
                <Input label="Brick ₹/piece" value={rates.brick} onChange={(v) => updateRate("brick", v)} />
              </div>

              <div className="mt-4">
                <h3 className="font-bold text-orange-400 mb-3">Material Wastage / सामग्री बर्बादी</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Cement Wastage %" value={wastage.cement} onChange={(v) => updateWastage("cement", v)} />
                  <Input label="Steel Wastage %" value={wastage.steel} onChange={(v) => updateWastage("steel", v)} />
                  <Input label="Sand Wastage %" value={wastage.sand} onChange={(v) => updateWastage("sand", v)} />
                  <Input label="Aggregate Wastage %" value={wastage.aggregate} onChange={(v) => updateWastage("aggregate", v)} />
                  <Input label="Brick Wastage %" value={wastage.brick} onChange={(v) => updateWastage("brick", v)} />
                </div>
              </div>

              <button onClick={calculate} className="w-full mt-2 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black py-4">
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
                    <h2 className="text-4xl md:text-5xl font-black text-orange-400 mt-2">{money(result.grandTotal)}</h2>
                    <p className="text-sm text-slate-400 mt-2">
                      Construction Cost + Additional Hidden Cost. Staircase extra is added only when selected as separate.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Mini label="Construction Cost" value={money(result.constructionCost)} />
                    <Mini label="Base Area Cost" value={money(result.baseConstructionCost)} />
                    <Mini label="Room Allowance" value={money(result.roomAdditionalCost)} />
                    <Mini label="Optional Features" value={money(result.optionalFeatureCost)} />
                    <Mini label="Staircase Extra" value={money(result.staircase.extraCost)} />
                    <Mini label="Hidden Cost" value={money(result.additionalHiddenCost)} />
                    <Mini label="Construction Area" value={`${result.constructionArea.toFixed(0)} sq ft`} />
                    <Mini label="Cost / Sq Ft" value={money(result.costPerSqFt)} />
                    <Mini label="Cost / Sq M" value={money(result.costPerSqM)} />
                    <Mini label="Floors" value={result.floorCount} />
                    <Mini label="Configuration" value={`${form.bedrooms}BHK`} />
                    <Mini label="Rooms" value={`${form.bedrooms} Bed | ${form.kitchens} Kitchen | ${form.bathrooms} Bath`} />
                    <Mini label="Quality" value={form.quality} />
                    <Mini label="Duration" value={result.timeline.total} />
                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mt-4">
                    <h3 className="font-black text-orange-400 mb-3">House Configuration / घर की संरचना</h3>
                    <div className="space-y-2">
                      <Row label="Bedrooms" value={form.bedrooms} />
                      <Row label="Kitchens" value={form.kitchens} />
                      <Row label="Bathrooms" value={form.bathrooms} />
                      <Row label="Halls" value={form.halls} />
                      <Row label="Car Parking" value={form.carParking} />
                      <Row label="Balcony" value={form.balcony} />
                      <Row label="Terrace" value={form.terrace} />
                      <Row label="Basement" value={form.basement} />
                      <Row label="Lift" value={form.lift} />
                      <Row label="Staircase" value={form.includeStaircase ? "Included" : "Not Included"} />
                      {form.includeStaircase && (
                        <>
                          <Row label="Staircase Area Status" value={form.staircaseAreaStatus} />
                          <Row
                            label="Staircase Access"
                            value={form.staircaseAccess === "Up to Terrace / Roof" ? "Ground to Terrace" : "Up to Selected Floor"}
                          />
                        </>
                      )}
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

                {result.staircase.included && (
                  <Panel title="3. Staircase Estimate / सीढ़ी Estimate">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <Mini label="Access" value={result.staircase.access === "Up to Terrace / Roof" ? "Ground to Terrace" : "Up to Selected Floor"} />
                      <Mini label="Area Status" value={result.staircase.areaStatus} />
                      <Mini label="Levels" value={result.staircase.levels} />
                      <Mini label="Type" value={result.staircase.type} />
                      <Mini label="Finish" value={result.staircase.finish} />
                      <Mini label="Estimated Cost" value={money(result.staircase.cost)} />
                      <Mini label="Extra Added" value={money(result.staircase.extraCost)} />
                      <Mini label="Concrete" value={`${result.staircase.concrete.toFixed(2)} m3`} />
                      <Mini label="Steel" value={`${result.staircase.steel.toFixed(0)} kg`} />
                      <Mini label="Shuttering" value={`${result.staircase.shuttering.toFixed(0)} sq ft`} />
                      <Mini label="Finishing Area" value={`${result.staircase.finishingArea.toFixed(0)} sq ft`} />
                      <Mini label="Railing" value={`${result.staircase.railing.toFixed(0)} rft`} />
                    </div>
                    <p className="text-xs text-slate-400 mt-3">
                      If staircase is included in built-up area, estimated cost is shown for reference but extra added is ₹0.
                    </p>
                  </Panel>
                )}

                <Panel title="4. Material Cost Breakdown / सामग्री विवरण">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {result.materials.map((m) => (
                      <div key={m.pdfName} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                        <div className="flex justify-between gap-3">
                          <h3 className="font-black">{m.name}</h3>
                          <span className="text-orange-400 font-black">
                            {m.referenceOnly ? "Reference" : money(m.amount)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-2">
                          Base Quantity: {Number(m.baseQty || 0).toFixed(2)} {m.unit}
                        </p>
                        {!m.referenceOnly && (
                          <p className="text-sm text-slate-400">
                            Wastage: {Number(m.wastageQty || 0).toFixed(2)} {m.unit}
                          </p>
                        )}
                        <p className="text-sm text-green-400 font-bold">
                          Final Quantity: {Number(m.qty || 0).toFixed(2)} {m.unit}
                        </p>
                        <p className="text-sm text-slate-400">
                          {m.referenceOnly ? "Cost included in construction rate" : `Rate: ${money(m.rate)} / ${m.unit}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </Panel>

                <Panel title="5. Shuttering / Formwork Material / शटरिंग मटेरियल">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <Mini label="Foundation Formwork" value={`${result.shuttering.foundation.toFixed(0)} sq ft`} />
                    <Mini label="Column Formwork" value={`${result.shuttering.column.toFixed(0)} sq ft`} />
                    <Mini label="Beam Formwork" value={`${result.shuttering.beam.toFixed(0)} sq ft`} />
                    <Mini label="Slab Formwork" value={`${result.shuttering.slab.toFixed(0)} sq ft`} />
                    <Mini label="Staircase Formwork" value={`${result.shuttering.staircase.toFixed(0)} sq ft`} />
                    <Mini label="Total Formwork" value={`${result.shuttering.totalArea.toFixed(0)} sq ft`} />
                    <Mini label="Plywood Sheets 8x4" value={`${result.shuttering.plywoodSheets} sheets`} />
                    <Mini label="Timber / Batten" value={`${result.shuttering.timberCft.toFixed(2)} cft`} />
                    <Mini label="Nails" value={`${result.shuttering.nailsKg.toFixed(2)} kg`} />
                    <Mini label="Form Oil" value={`${result.shuttering.formOilLitre.toFixed(2)} litre`} />
                    <Mini label="Props / Supports" value={`${result.shuttering.propsNos} nos`} />
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    Shuttering quantities are reference estimates for BOQ planning. Cost is considered included in construction rate.
                  </p>
                </Panel>

                <Panel title="6. Room Recommendation / रूम सुझाव">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {result.roomRecommendation.rooms.map((room) => (
                      <Mini key={room.name} label={room.name} value={room.size} />
                    ))}
                  </div>
                  <p className="text-slate-400 text-sm">Suggested Type: {result.roomRecommendation.type}</p>
                </Panel>

                <Panel title="7. Construction Timeline / निर्माण समय">
                  <div className="space-y-2">
                    {result.timeline.stages.map((stage) => (
                      <Row key={stage.name} label={stage.name} value={stage.duration} />
                    ))}
                    <Row label="Total Time" value={result.timeline.total} />
                  </div>
                </Panel>

                <Panel title="8. BOQ Generation / स्टेज-वाइज BOQ">
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

                <Panel title="9. Hidden Costs / अतिरिक्त छिपी हुई लागत">
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
                  <p className="text-xs text-slate-400 mt-2">
                    Optional features and staircase are handled separately based on selected area status.
                  </p>
                </Panel>

                <Panel title="10. Save and Export / सेव और एक्सपोर्ट">
                  <div className="grid sm:grid-cols-4 gap-3">
                    <button onClick={saveProject} className="actionBtn">
                      Save
                    </button>
                    <button onClick={downloadPDF} className="actionBtn">
                      PDF
                    </button>
                    <button onClick={() => setOpenBoq("Foundation")} className="actionBtn">
                      BOQ
                    </button>
                    <button onClick={shareEstimate} className="actionBtn">
                      Share
                    </button>
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
          <button onClick={saveProject} className="bottomBtn">
            Save
          </button>
          <button onClick={downloadPDF} className="bottomBtn">
            PDF
          </button>
          <button
            onClick={() => {
              setOpenBoq("Foundation");
              document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bottomBtn"
          >
            BOQ
          </button>
          <button onClick={shareEstimate} className="bottomBtn">
            Share
          </button>
        </div>
      </div>

      <StyleBlock />
    </div>
  );
}

function getTimeline(area, floors, includeStaircase) {
  const factor = Math.max(1, Math.ceil(area / 1000)) + Math.max(0, floors - 1);

  return {
    total: factor <= 2 ? "6–8 Months" : "8–12 Months",
    stages: [
      { name: "Excavation", duration: `${5 + factor} Days` },
      { name: "Foundation", duration: `${10 + factor * 2} Days` },
      { name: "RCC Work", duration: `${20 + factor * 5} Days` },
      ...(includeStaircase ? [{ name: "Staircase Work", duration: `${7 + factor * 2} Days` }] : []),
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
          <option key={o} value={o}>
            {o}
          </option>
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
          House construction cost is the estimated amount required to build a home, including foundation,
          RCC, brickwork, plaster, flooring, electrical, plumbing, finishing, hidden charges and labour.
        </p>
      </div>
      <div>
        <h3 className="font-black text-white">घर बनाने का खर्च क्या होता है?</h3>
        <p>
          घर बनाने का खर्च foundation, RCC, brickwork, plaster, flooring, electrical, plumbing,
          finishing और hidden costs को मिलाकर बनता है.
        </p>
      </div>
      <div>
        <h3 className="font-black text-white">Construction Cost Formula</h3>
        <p>Total Budget = Construction Area × Cost per sq ft + Extra selected items + Hidden Costs.</p>
      </div>
      <div>
        <h3 className="font-black text-white">Shuttering/Formwork Quantity</h3>
        <p>
          This calculator also estimates plywood sheets, timber/batten, nails, form oil and props for
          shuttering/formwork planning.
        </p>
      </div>
      <div>
        <h3 className="font-black text-white">Future Contractor Connect</h3>
        <p>
          Future upgrade idea: user enters city/area, calculator generates estimate, then CivilCalc Pro
          can show nearby construction companies or contractors for direct enquiry.
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
