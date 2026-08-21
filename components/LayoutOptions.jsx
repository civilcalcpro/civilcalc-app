"use client";

import React, { useState } from "react";

const layoutOptions = [
  {
    id: 1,
    name: "L-Shaped Layout",
    description: "Master room on corner, living room open to courtyard",
    features: ["2 BHK", "Good ventilation", "Natural light"],
    image: "L",
  },
  {
    id: 2,
    name: "Linear Layout",
    description: "Sequential rooms along main corridor",
    features: ["2-3 BHK", "Easy construction", "Cost-effective"],
    image: "I",
  },
  {
    id: 3,
    name: "Courtyard Layout",
    description: "Rooms around central courtyard (Vastu-compliant)",
    features: ["Vastu", "Central courtyard", "Better airflow"],
    image: "C",
  },
  {
    id: 4,
    name: "Staggered Layout",
    description: "Offset rooms for privacy and light",
    features: ["Modern", "Flexible", "Good aesthetics"],
    image: "S",
  },
];

export default function LayoutOptions({ onSelect }) {
  const [selected, setSelected] = useState(1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {layoutOptions.map((layout) => (
          <div
            key={layout.id}
            onClick={() => {
              setSelected(layout.id);
              onSelect(layout);
            }}
            className={`rounded-2xl border-2 p-4 cursor-pointer transition ${
              selected === layout.id
                ? "border-orange-500 bg-orange-500/10"
                : "border-white/10 bg-white/5 hover:border-orange-500/40"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-orange-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-black text-orange-400">
                  {layout.image}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-white">{layout.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{layout.description}</p>

                <div className="flex gap-2 mt-2 flex-wrap">
                  {layout.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
