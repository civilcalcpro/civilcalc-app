import Link from "next/link";

export const metadata = {
  title: 'RCC Beam Design Calculator as per IS 456:2000 | CivilCalc Pro',
  description:
    'Free online RCC beam design calculator for civil engineers and students. Calculate bending moment, shear force, effective depth, reinforcement steel and RCC beam design as per IS 456:2000.',
  alternates: {
    canonical: 'https://civilcalcpro.in/beam-design',
  },
  openGraph: {
    title: 'RCC Beam Design Calculator as per IS 456:2000 | CivilCalc Pro',
    description:
      'Free online RCC beam design calculator for civil engineers and students. Calculate bending moment, shear force, effective depth, reinforcement steel and RCC beam design as per IS 456:2000.',
    url: 'https://civilcalcpro.in/beam-design',
    siteName: 'CivilCalc Pro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RCC Beam Design Calculator as per IS 456:2000 | CivilCalc Pro',
    description:
      'Free online RCC beam design calculator for civil engineers and students. Calculate bending moment, shear force, effective depth, reinforcement steel and RCC beam design as per IS 456:2000.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
}

export default function BeamDesignPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <p className="text-orange-400 font-semibold mb-3">
          RCC STRUCTURAL DESIGN TOOL
        </p>

        <h1 className="text-5xl font-bold mb-6">
          RCC Beam Design Calculator
        </h1>

        <p className="text-slate-300 text-lg mb-10">
          Free online RCC beam design calculator for civil engineers and students.
          Calculate bending moment, shear force, effective depth, reinforcement
          steel, and RCC beam design as per IS 456:2000.
        </p>

        <Link
          href="/login?redirect=/dashboard/calculators/beam"
          className="inline-block bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold mb-16"
        >
          Open Beam Design Calculator
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Features</h2>

            <ul className="space-y-3 text-slate-300">
              <li>• RCC beam design calculation</li>
              <li>• Bending moment calculation</li>
              <li>• Shear force calculation</li>
              <li>• Effective depth estimation</li>
              <li>• Steel reinforcement calculation</li>
              <li>• IS 456:2000 based beam design</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Use CivilCalc Pro?
            </h2>

            <p className="text-slate-300 leading-8">
              CivilCalc Pro helps civil engineers design RCC beams quickly using
              professional structural calculation tools. Useful for students,
              site engineers, structural consultants, and construction professionals.
            </p>
          </div>
        </div>

        <section className="mt-16 space-y-8">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              RCC Beam Design Formula
            </h2>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-orange-400 font-mono text-lg">
              Mu = wuL² / 8
            </div>

            <p className="text-slate-300 mt-4 leading-7">
              For a simply supported beam with uniformly distributed load,
              maximum bending moment is calculated using wuL² / 8.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is RCC Beam Design?
            </h2>

            <p className="text-slate-300 leading-7 mb-4">
              RCC beam design is the process of designing a reinforced concrete
              beam to safely resist bending moment, shear force, dead load, live
              load and other structural loads. Concrete carries compression and
              steel reinforcement carries tension.
            </p>

            <p className="text-slate-300 leading-7">
              RCC beams are used in residential buildings, commercial buildings,
              structural frames, lintels, roof beams and floor beam systems.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Steps in RCC Beam Design
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Determine beam span and support condition</li>
              <li>Calculate dead load and live load</li>
              <li>Calculate factored load</li>
              <li>Calculate bending moment</li>
              <li>Calculate shear force</li>
              <li>Determine effective depth</li>
              <li>Design main reinforcement steel</li>
              <li>Design shear reinforcement or stirrups</li>
              <li>Check deflection, spacing and development length</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Beam Design Example
            </h2>

            <p className="text-slate-300 leading-7">
              Consider a simply supported RCC beam with span 4 m and factored load
              25 kN/m.
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Maximum Bending Moment = wuL² / 8
              <br />
              Mu = 25 × 4² / 8
              <br />
              Mu = 50 kNm
            </p>

            <p className="text-slate-300 leading-7 mt-4">
              Shear Force = wuL / 2
              <br />
              Vu = 25 × 4 / 2
              <br />
              Vu = 50 kN
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Important Checks in Beam Design
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li>Bending moment capacity check</li>
              <li>Shear force check</li>
              <li>Minimum reinforcement check</li>
              <li>Maximum reinforcement limit</li>
              <li>Deflection check</li>
              <li>Development length check</li>
              <li>Clear cover and spacing check</li>
            </ul>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Related Calculators
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-slate-300">
              <li><a href="/column-design">Column Design Calculator</a></li>
              <li><a href="/footing-design">Footing Design Calculator</a></li>
              <li><a href="/one-way-slab-calculator">One Way Slab Calculator</a></li>
              <li><a href="/two-way-slab-calculator">Two Way Slab Calculator</a></li>
              <li><a href="/steel-weight-calculator">Steel Weight Calculator</a></li>
            </ul>
          </div>
                <div className="mt-10 text-center">
  <Link
    href="/civil-engineering-calculators"
    className="inline-block border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white transition px-6 py-3 rounded-xl font-semibold"
  >
    View All Civil Engineering Calculators
  </Link>
</div>
        </section>
      </div>
    </main>
  );
}
