'use client'

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SlabDesignPage() {
  const searchParams = useSearchParams();

  const type = searchParams.get("type");

  const isTwoWay = type === "two-way";

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-6">
          {isTwoWay
            ? "Two Way Slab Design Calculator"
            : "One Way Slab Design Calculator"}
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          {isTwoWay
            ? "Free online two way slab design calculator for civil engineers and students."
            : "Free online one way slab design calculator for civil engineers and students."}
        </p>

        <Link
          href={
            isTwoWay
              ? "/login?redirect=/dashboard/calculators/two-way-slab"
              : "/login?redirect=/dashboard/calculators/one-way-slab"
          }
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          {isTwoWay
            ? "Open Two Way Slab Calculator"
            : "Open One Way Slab Calculator"}
        </Link>

        <div className="grid md:grid-cols-2 gap-10">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Features
            </h2>

            <ul className="space-y-3 text-slate-300">
              <li>• Slab thickness calculation</li>
              <li>• Reinforcement steel estimation</li>
              <li>• Bending moment analysis</li>
              <li>• Load distribution calculation</li>
              <li>• IS 456 based slab design</li>
              <li>• Fast structural analysis</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Use CivilCalc Pro?
            </h2>

            <p className="text-slate-300 leading-8">
              CivilCalc Pro helps civil engineers perform slab design
              quickly using AI-powered engineering tools and
              structural calculations.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
