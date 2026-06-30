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
  PlusCircle,
  Trash2,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

const MM_PER_INCH = 25.4;
const FT_TO_M = 0.3048;

const metricDiameters = [6, 8, 10, 12, 16, 20, 25, 32, 40];
const imperialDiameters = [0.25, 0.315, 0.375, 0.5, 0.625, 0.75, 1];

const defaultItems = [
  {
    id: 1,
    barMark: "B1",
    memberName: "Beam Main Bar",
    dia: "12",
    length: "3",
    quantity: "10",
    rate: "60",
  },
];

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function round(value, digits = 2) {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: digits,
  });
}

function currency(value) {
  return `₹${round(value, 2)}`;
}

function getDiaMm(dia, unitSystem) {
  const value = toNumber(dia);
  return unitSystem === "metric" ? value : value * MM_PER_INCH;
}

function getLengthM(length, unitSystem) {
  const value = toNumber(length);
  return unitSystem === "metric" ? value : value * FT_TO_M;
}

function formatLengthM(m, unitSystem) {
  if (unitSystem === "imperial") {
    return `${round(m / FT_TO_M, 3)} ft`;
  }

  return `${round(m, 3)} m`;
}

function SteelSummaryVisual({ result }) {
  if (!result) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-6 text-center">
        <div>
          <BarChart3 className="mx-auto mb-3 text-orange-400" size={46} />
          <p className="text-lg font-bold text-white">Summary will appear here</p>
          <p className="mt-2 text-sm text-slate-400">
            Steel items भरो और Calculate button दबाओ
          </p>
        </div>
      </div>
    );
  }

  const maxWeight = Math.max(
    ...result.diameterSummary.map((item) => item.weightKg),
    1
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <h3 className="text-lg font-black text-white">
        Diameter-wise Steel Weight
      </h3>

      <div className="mt-5 space-y-4">
        {result.diameterSummary.map((item) => {
          const widthPercent = Math.max((item.weightKg / maxWeight) * 100, 6);

          return (
            <div key={item.diaMm}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-bold text-slate-200">
                  D{round(item.diaMm, 1)} mm
                </span>
                <span className="text-orange-300">
                  {round(item.weightKg, 3)} kg
                </span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-orange-500"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>

              <div className="mt-1 text-xs text-slate-500">
                Length: {round(item.totalLengthM, 3)} m | Cost:{" "}
                {currency(item.cost)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SteelCostSummaryPage() {
  const [unitSystem, setUnitSystem] = useState("metric");
  const [projectName, setProjectName] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [siteLocation, setSiteLocation] = useState("");

  const [items, setItems] = useState(defaultItems);

  const [wastagePercent, setWastagePercent] = useState("3");
  const [bendingRate, setBendingRate] = useState("0");
  const [transportRate, setTransportRate] = useState("0");
  const [bindingWirePercent, setBindingWirePercent] = useState("1");
  const [bindingWireRate, setBindingWireRate] = useState("70");
  const [gstPercent, setGstPercent] = useState("18");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const quickDiameters = useMemo(() => {
    return unitSystem === "metric" ? metricDiameters : imperialDiameters;
  }, [unitSystem]);

  function clearResult() {
    setResult(null);
    setError("");
    setCopied(false);
  }

  function handleUnitChange(unit) {
    setUnitSystem(unit);

    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        dia: unit === "metric" ? "12" : "0.5",
        length: unit === "metric" ? "3" : "10",
      }))
    );

    clearResult();
  }

  function updateItem(id, field, value) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );

    clearResult();
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        barMark: `B${prev.length + 1}`,
        memberName: "",
        dia: unitSystem === "metric" ? "12" : "0.5",
        length: unitSystem === "metric" ? "3" : "10",
        quantity: "1",
        rate: "60",
      },
    ]);

    clearResult();
  }

  function deleteItem(id) {
    setItems((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((item) => item.id !== id);
    });

    clearResult();
  }

  function duplicateItem(item) {
    setItems((prev) => [
      ...prev,
      {
        ...item,
        id: Date.now(),
        barMark: `${item.barMark || "B"} Copy`,
      },
    ]);

    clearResult();
  }

  function calculateSteelCost() {
    setError("");
    setCopied(false);

    if (!items.length) {
      setError("Please add at least one steel item.");
      setResult(null);
      return;
    }

    const calculatedItems = [];

    for (const item of items) {
      const diaMm = getDiaMm(item.dia, unitSystem);
      const lengthM = getLengthM(item.length, unitSystem);
      const quantity = Math.max(toNumber(item.quantity), 0);
      const rate = Math.max(toNumber(item.rate), 0);

      if (diaMm <= 0) {
        setError("Please enter valid bar diameter in all rows.");
        setResult(null);
        return;
      }

      if (lengthM <= 0) {
        setError("Please enter valid length per bar in all rows.");
        setResult(null);
        return;
      }

      if (quantity <= 0) {
        setError("Please enter valid quantity in all rows.");
        setResult(null);
        return;
      }

      if (rate < 0) {
        setError("Please enter valid steel rate in all rows.");
        setResult(null);
        return;
      }

      const unitWeightKgPerM = (diaMm * diaMm) / 162;
      const totalLengthM = lengthM * quantity;
      const weightKg = totalLengthM * unitWeightKgPerM;
      const cost = weightKg * rate;

      calculatedItems.push({
        ...item,
        diaMm,
        lengthM,
        quantity,
        rate,
        unitWeightKgPerM,
        totalLengthM,
        weightKg,
        cost,
      });
    }

    const rawWeightKg = calculatedItems.reduce(
      (sum, item) => sum + item.weightKg,
      0
    );

    const rawMaterialCost = calculatedItems.reduce(
      (sum, item) => sum + item.cost,
      0
    );

    const totalLengthM = calculatedItems.reduce(
      (sum, item) => sum + item.totalLengthM,
      0
    );

    const averageRate = rawWeightKg > 0 ? rawMaterialCost / rawWeightKg : 0;

    const wastagePct = Math.max(toNumber(wastagePercent), 0);
    const bendingRateValue = Math.max(toNumber(bendingRate), 0);
    const transportRateValue = Math.max(toNumber(transportRate), 0);
    const bindingWirePct = Math.max(toNumber(bindingWirePercent), 0);
    const bindingWireRateValue = Math.max(toNumber(bindingWireRate), 0);
    const gstPct = Math.max(toNumber(gstPercent), 0);

    const wastageWeightKg = (rawWeightKg * wastagePct) / 100;
    const grossSteelWeightKg = rawWeightKg + wastageWeightKg;

    const wastageCost = wastageWeightKg * averageRate;
    const materialCostWithWastage = rawMaterialCost + wastageCost;

    const bendingCharges = grossSteelWeightKg * bendingRateValue;
    const transportCharges = grossSteelWeightKg * transportRateValue;

    const bindingWireWeightKg = (grossSteelWeightKg * bindingWirePct) / 100;
    const bindingWireCost = bindingWireWeightKg * bindingWireRateValue;

    const subTotal =
      materialCostWithWastage +
      bendingCharges +
      transportCharges +
      bindingWireCost;

    const gstAmount = (subTotal * gstPct) / 100;
    const grandTotal = subTotal + gstAmount;

    const costPerKg =
      grossSteelWeightKg > 0 ? grandTotal / grossSteelWeightKg : 0;

    const diaMap = {};

    calculatedItems.forEach((item) => {
      const key = round(item.diaMm, 2);

      if (!diaMap[key]) {
        diaMap[key] = {
          diaMm: item.diaMm,
          totalLengthM: 0,
          weightKg: 0,
          cost: 0,
        };
      }

      diaMap[key].totalLengthM += item.totalLengthM;
      diaMap[key].weightKg += item.weightKg;
      diaMap[key].cost += item.cost;
    });

    const diameterSummary = Object.values(diaMap).sort(
      (a, b) => a.diaMm - b.diaMm
    );

    setResult({
      projectName,
      preparedBy,
      siteLocation,
      unitSystem,
      items: calculatedItems,
      diameterSummary,

      rawWeightKg,
      wastagePercent: wastagePct,
      wastageWeightKg,
      grossSteelWeightKg,

      totalLengthM,
      rawMaterialCost,
      wastageCost,
      materialCostWithWastage,

      bendingRate: bendingRateValue,
      bendingCharges,
      transportRate: transportRateValue,
      transportCharges,

      bindingWirePercent: bindingWirePct,
      bindingWireWeightKg,
      bindingWireRate: bindingWireRateValue,
      bindingWireCost,

      gstPercent: gstPct,
      gstAmount,
      subTotal,
      grandTotal,
      averageRate,
      costPerKg,
    });
  }

  function resetCalculator() {
    setUnitSystem("metric");
    setProjectName("");
    setPreparedBy("");
    setSiteLocation("");
    setItems(defaultItems);
    setWastagePercent("3");
    setBendingRate("0");
    setTransportRate("0");
    setBindingWirePercent("1");
    setBindingWireRate("70");
    setGstPercent("18");
    setResult(null);
    setError("");
    setCopied(false);
  }

  async function copyResult() {
    if (!result) return;

    const itemLines = result.items
      .map(
        (item, index) =>
          `${index + 1}. ${item.barMark || "-"} | ${item.memberName || "-"} | D${round(
            item.diaMm,
            1
          )} mm | Length ${round(item.totalLengthM, 3)} m | Weight ${round(
            item.weightKg,
            3
          )} kg | Cost ${currency(item.cost)}`
      )
      .join("\n");

    const text = `CivilCalc Pro - Steel Cost Summary

Project: ${result.projectName || "-"}
Prepared By: ${result.preparedBy || "-"}
Location: ${result.siteLocation || "-"}

Item-wise Summary:
${itemLines}

Raw Steel Weight: ${round(result.rawWeightKg, 3)} kg
Wastage (${result.wastagePercent}%): ${round(result.wastageWeightKg, 3)} kg
Gross Steel Weight: ${round(result.grossSteelWeightKg, 3)} kg
Total Length: ${round(result.totalLengthM, 3)} m

Material Cost: ${currency(result.materialCostWithWastage)}
Bending Charges: ${currency(result.bendingCharges)}
Transport Charges: ${currency(result.transportCharges)}
Binding Wire Cost: ${currency(result.bindingWireCost)}
Subtotal: ${currency(result.subTotal)}
GST (${result.gstPercent}%): ${currency(result.gstAmount)}
Grand Total: ${currency(result.grandTotal)}
Cost per kg: ${currency(result.costPerKg)}`;

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
                Steel Cost Summary
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                Prepare complete steel quantity and cost summary with multiple
                bar diameters, lengths, rates, wastage, bending charges,
                transport, binding wire and GST.
              </p>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                Steel item rows add करो, length, dia, quantity और rate डालो,
                फिर Calculate button दबाओ। Output में total weight, cost और
                diameter-wise summary मिलेगा।
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-orange-400" size={34} />
                <div>
                  <h2 className="text-xl font-bold">Professional Output</h2>
                  <p className="text-sm text-slate-400">
                    Item-wise + diameter-wise + cost summary
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-900 p-4">
                  <p className="text-slate-400">Weight</p>
                  <p className="mt-1 text-2xl font-black text-orange-400">
                    D²/162
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900 p-4">
                  <p className="text-slate-400">Cost</p>
                  <p className="mt-1 text-2xl font-black text-orange-400">
                    kg × rate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 md:p-6">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">Input Details</h2>
                <p className="text-sm text-slate-400">
                  Steel items add करो और calculate करो
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
                    <p className="text-xs text-slate-400">Dia mm, length m</p>
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
                    <p className="text-xs text-slate-400">Dia inch, length ft</p>
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => {
                      setProjectName(e.target.value);
                      clearResult();
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    placeholder="Example: Residential Building"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Prepared By
                  </label>
                  <input
                    type="text"
                    value={preparedBy}
                    onChange={(e) => {
                      setPreparedBy(e.target.value);
                      clearResult();
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    placeholder="Engineer name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Site Location
                  </label>
                  <input
                    type="text"
                    value={siteLocation}
                    onChange={(e) => {
                      setSiteLocation(e.target.value);
                      clearResult();
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-orange-400"
                    placeholder="Location"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black">Steel Items</h3>
                    <p className="text-xs text-slate-400">
                      Multiple diameter and member-wise steel add karo
                    </p>
                  </div>

                  <button
                    onClick={addItem}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600"
                  >
                    <PlusCircle size={16} />
                    Add Item
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="font-bold text-orange-300">
                          Item {index + 1}
                        </p>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => duplicateItem(item)}
                            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-orange-400 hover:text-orange-300"
                          >
                            Duplicate
                          </button>

                          <button
                            onClick={() => deleteItem(item.id)}
                            className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-xs font-semibold text-slate-400">
                            Bar Mark
                          </label>
                          <input
                            type="text"
                            value={item.barMark}
                            onChange={(e) =>
                              updateItem(item.id, "barMark", e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-orange-400"
                            placeholder="B1, S1, C1"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-semibold text-slate-400">
                            Member Name
                          </label>
                          <input
                            type="text"
                            value={item.memberName}
                            onChange={(e) =>
                              updateItem(item.id, "memberName", e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-orange-400"
                            placeholder="Beam, Slab, Column"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-semibold text-slate-400">
                            Bar Diameter{" "}
                            {unitSystem === "metric" ? "(mm)" : "(inch)"}
                          </label>
                          <input
                            type="number"
                            step={unitSystem === "metric" ? "1" : "0.001"}
                            value={item.dia}
                            onChange={(e) =>
                              updateItem(item.id, "dia", e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-orange-400"
                          />

                          <div className="mt-2 flex flex-wrap gap-2">
                            {quickDiameters.map((dia) => (
                              <button
                                key={dia}
                                onClick={() =>
                                  updateItem(item.id, "dia", String(dia))
                                }
                                className="rounded-full border border-slate-700 px-2.5 py-1 text-[11px] text-slate-300 hover:border-orange-400 hover:text-orange-300"
                              >
                                {unitSystem === "metric"
                                  ? `${dia} mm`
                                  : `${dia} in`}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-semibold text-slate-400">
                            Length per Bar{" "}
                            {unitSystem === "metric" ? "(m)" : "(ft)"}
                          </label>
                          <input
                            type="number"
                            value={item.length}
                            onChange={(e) =>
                              updateItem(item.id, "length", e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-orange-400"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-semibold text-slate-400">
                            Number of Bars
                          </label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(item.id, "quantity", e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-orange-400"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-semibold text-slate-400">
                            Steel Rate ₹/kg
                          </label>
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) =>
                              updateItem(item.id, "rate", e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-orange-400"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <h3 className="mb-4 text-lg font-black">Cost Settings</h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-400">
                      Steel Wastage %
                    </label>
                    <input
                      type="number"
                      value={wastagePercent}
                      onChange={(e) => {
                        setWastagePercent(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-400">
                      Bending / Cutting Charges ₹/kg
                    </label>
                    <input
                      type="number"
                      value={bendingRate}
                      onChange={(e) => {
                        setBendingRate(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-400">
                      Transport Charges ₹/kg
                    </label>
                    <input
                      type="number"
                      value={transportRate}
                      onChange={(e) => {
                        setTransportRate(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-400">
                      GST %
                    </label>
                    <input
                      type="number"
                      value={gstPercent}
                      onChange={(e) => {
                        setGstPercent(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-400">
                      Binding Wire %
                    </label>
                    <input
                      type="number"
                      value={bindingWirePercent}
                      onChange={(e) => {
                        setBindingWirePercent(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-400">
                      Binding Wire Rate ₹/kg
                    </label>
                    <input
                      type="number"
                      value={bindingWireRate}
                      onChange={(e) => {
                        setBindingWireRate(e.target.value);
                        clearResult();
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-orange-400"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-semibold text-red-200">
                  {error}
                </div>
              )}

              <button
                onClick={calculateSteelCost}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 px-5 py-4 text-lg font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              >
                <Calculator size={22} />
                Calculate Steel Cost Summary
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">Steel Summary Visual</h2>
                  <p className="text-sm text-slate-400">
                    Diameter-wise weight breakdown calculate ke baad show hoga
                  </p>
                </div>

                <BarChart3 className="text-orange-400" size={28} />
              </div>

              <SteelSummaryVisual result={result} />
            </div>

            {result && (
              <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/15 to-slate-900 p-5 md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <CheckCircle className="text-orange-300" size={28} />
                  <div>
                    <h2 className="text-2xl font-black">Calculation Result</h2>
                    <p className="text-sm text-slate-400">
                      Complete steel cost summary
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Raw Steel Weight</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      {round(result.rawWeightKg, 3)} kg
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Before wastage
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Gross Steel Weight</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      {round(result.grossSteelWeightKg, 3)} kg
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Including {result.wastagePercent}% wastage
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Total Steel Length</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      {round(result.totalLengthM, 3)} m
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      All bars combined
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Cost per kg</p>
                    <p className="mt-2 text-3xl font-black text-orange-300">
                      {currency(result.costPerKg)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Final cost average
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5 sm:col-span-2">
                    <p className="text-sm text-slate-400">Grand Total</p>
                    <p className="mt-2 text-4xl font-black text-orange-300">
                      {currency(result.grandTotal)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Including material, wastage, binding wire, charges and GST
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                  <h3 className="mb-4 text-lg font-black">Cost Breakdown</h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">Raw Material Cost</span>
                      <span className="font-bold text-white">
                        {currency(result.rawMaterialCost)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">
                        Wastage Cost ({result.wastagePercent}%)
                      </span>
                      <span className="font-bold text-white">
                        {currency(result.wastageCost)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">Bending Charges</span>
                      <span className="font-bold text-white">
                        {currency(result.bendingCharges)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">Transport Charges</span>
                      <span className="font-bold text-white">
                        {currency(result.transportCharges)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">
                        Binding Wire ({round(result.bindingWireWeightKg, 3)} kg)
                      </span>
                      <span className="font-bold text-white">
                        {currency(result.bindingWireCost)}
                      </span>
                    </div>

                    <div className="border-t border-slate-800 pt-3">
                      <div className="flex justify-between gap-3">
                        <span className="text-slate-400">Subtotal</span>
                        <span className="font-bold text-white">
                          {currency(result.subTotal)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">
                        GST ({result.gstPercent}%)
                      </span>
                      <span className="font-bold text-white">
                        {currency(result.gstAmount)}
                      </span>
                    </div>

                    <div className="border-t border-orange-500/30 pt-3">
                      <div className="flex justify-between gap-3 text-lg">
                        <span className="font-black text-orange-200">
                          Grand Total
                        </span>
                        <span className="font-black text-orange-300">
                          {currency(result.grandTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/70">
                  <div className="border-b border-slate-800 p-5">
                    <h3 className="text-lg font-black">Item-wise Summary</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Har bar item ka weight aur cost
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[820px] text-sm">
                      <thead className="bg-slate-900 text-left text-slate-300">
                        <tr>
                          <th className="p-3">S.No</th>
                          <th className="p-3">Bar Mark</th>
                          <th className="p-3">Member</th>
                          <th className="p-3">Dia</th>
                          <th className="p-3">Length</th>
                          <th className="p-3">Qty</th>
                          <th className="p-3">Weight</th>
                          <th className="p-3">Rate</th>
                          <th className="p-3">Cost</th>
                        </tr>
                      </thead>

                      <tbody>
                        {result.items.map((item, index) => (
                          <tr
                            key={item.id}
                            className="border-t border-slate-800 text-slate-300"
                          >
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3">{item.barMark || "-"}</td>
                            <td className="p-3">{item.memberName || "-"}</td>
                            <td className="p-3">D{round(item.diaMm, 1)} mm</td>
                            <td className="p-3">
                              {round(item.totalLengthM, 3)} m
                            </td>
                            <td className="p-3">{round(item.quantity, 0)}</td>
                            <td className="p-3">
                              {round(item.weightKg, 3)} kg
                            </td>
                            <td className="p-3">₹{round(item.rate, 2)}/kg</td>
                            <td className="p-3 font-bold text-orange-300">
                              {currency(item.cost)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
                  <h3 className="text-lg font-black text-orange-200">
                    Formula Used
                  </h3>

                  <div className="mt-3 space-y-2 text-sm leading-7 text-orange-50">
                    <p>Unit Weight = D² / 162 kg/m</p>
                    <p>Total Length = Length per Bar × Number of Bars</p>
                    <p>Steel Weight = Unit Weight × Total Length</p>
                    <p>Steel Cost = Steel Weight × Rate per kg</p>
                    <p>
                      Grand Total = Material Cost + Wastage + Bending + Transport
                      + Binding Wire + GST
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
              Steel cost summary is used in BBS billing, site estimation,
              contractor quotation, reinforcement purchase planning and project
              cost control.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-3 flex items-center gap-2 text-orange-300">
              <Info size={20} />
              <h3 className="font-bold">Hindi Explanation</h3>
            </div>

            <p className="text-sm leading-7 text-slate-300">
              Steel cost summary में हर diameter और member का total weight,
              length, rate और final cost calculate होता है। इससे site पर steel
              purchase और billing easy हो जाती है।
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-3 flex items-center gap-2 text-orange-300">
              <Info size={20} />
              <h3 className="font-bold">Engineering Note</h3>
            </div>

            <p className="text-sm leading-7 text-slate-300">
              Final steel quantity and cost should be checked with approved BBS,
              structural drawings, supplier rate, local taxes and site wastage
              conditions.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
