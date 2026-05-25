import Link from "next/link";

export const metadata = {
  title: "One Way Slab Design Calculator | CivilCalc Pro",
  description:
    "Free online one way slab design calculator for civil engineers and students.",
};

export default function OneWaySlabPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-6">
          One Way Slab Design Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Calculate one way slab thickness, reinforcement steel,
          bending moments, and structural design as per IS 456.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/slab"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open One Way Slab Calculator
        </Link>

      </div>
    </main>
  );
}
