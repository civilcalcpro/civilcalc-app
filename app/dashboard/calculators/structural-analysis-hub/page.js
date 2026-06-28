'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

const structuralTools = [
  {
    name: 'Structural Analysis',
    icon: '📊',
    href: '/dashboard/calculators/structural-analysis',
    desc: 'Simply supported / cantilever beam, reactions, SFD, BMD, point load, UDL, UVL and moment load.',
    bestFor: ['SFD', 'BMD', 'Beam reactions', 'Point load', 'UDL', 'UVL', 'Moment load'],
    level: 'Basic to Advanced',
    color: 'orange',
  },
  {
    name: 'Truss Analysis',
    icon: '🔺',
    href: '/dashboard/calculators/truss-analysis',
    desc: '2D truss member forces, support reactions, tension, compression and zero-force members.',
    bestFor: ['Truss', 'Method of joints', 'Method of sections', 'Member force', 'Tension', 'Compression'],
    level: 'Basic to Advanced',
    color: 'blue',
  },
  {
    name: 'Slope & Deflection',
    icon: '📉',
    href: '/dashboard/calculators/slope-deflection',
    desc: 'Beam slope, deflection, elastic curve, M/EI diagram, SFD and BMD.',
    bestFor: ['Slope', 'Deflection', 'Elastic curve', 'M/EI', 'Beam displacement'],
    level: 'Intermediate',
    color: 'cyan',
  },
  {
    name: 'Energy Method',
    icon: '⚡',
    href: '/dashboard/calculators/energy-method',
    desc: 'Unit load method, virtual work, strain energy and Castigliano theorem.',
    bestFor: ['Unit load method', 'Virtual work', 'Castigliano', 'Strain energy', 'Deflection'],
    level: 'Intermediate to Advanced',
    color: 'yellow',
  },
  {
    name: 'Indeterminate Beam',
    icon: '🏗️',
    href: '/dashboard/calculators/indeterminate-beam',
    desc: 'Fixed beam, propped cantilever and continuous beam using stiffness method.',
    bestFor: ['Fixed beam', 'Propped cantilever', 'Continuous beam', 'Support settlement', 'Indeterminate beam'],
    level: 'Advanced',
    color: 'orange',
  },
  {
    name: 'Moment Distribution',
    icon: '🔁',
    href: '/dashboard/calculators/moment-distribution',
    desc: 'Hardy Cross moment distribution method with FEM, DF, carry-over and final moments.',
    bestFor: ['Moment distribution', 'Fixed end moment', 'Distribution factor', 'Carry over', 'Continuous beam'],
    level: 'Advanced',
    color: 'purple',
  },
  {
    name: 'Three Moment Theorem',
    icon: '📐',
    href: '/dashboard/calculators/three-moment-theorem',
    desc: 'Clapeyron three moment theorem for continuous beam support moments and reactions.',
    bestFor: ['Three moment theorem', 'Clapeyron theorem', 'Continuous beam', 'Support moments'],
    level: 'Advanced',
    color: 'green',
  },
  {
    name: 'Arches & Cables',
    icon: '🌉',
    href: '/dashboard/calculators/arches-cables',
    desc: 'Three-hinged arch, two-hinged arch, cable sag, horizontal thrust and tension.',
    bestFor: ['Arch', 'Cable', 'Horizontal thrust', 'Normal thrust', 'Radial shear', 'Sag', 'Tension'],
    level: 'Intermediate to Advanced',
    color: 'sky',
  },
  {
    name: 'Influence Line',
    icon: '🚚',
    href: '/dashboard/calculators/influence-line',
    desc: 'Influence line diagram, moving loads, maximum reaction, maximum SF and BM.',
    bestFor: ['ILD', 'Influence line', 'Moving load', 'Wheel load', 'Bridge load', 'Maximum BM'],
    level: 'Intermediate',
    color: 'red',
  },
  {
    name: 'Frame Analysis',
    icon: '🏢',
    href: '/dashboard/calculators/frame-analysis',
    desc: 'Portal frame, support reactions, member end forces, joint displacement and deflected shape.',
    bestFor: ['Portal frame', 'Frame stiffness', 'Member end moment', 'Joint displacement', 'Sway frame'],
    level: 'Advanced',
    color: 'orange',
  },
]

const guideRows = [
  {
    question: 'Beam ka reaction, SFD ya BMD nikalna hai',
    use: 'Structural Analysis',
    href: '/dashboard/calculators/structural-analysis',
  },
  {
    question: 'Truss me member tension/compression force nikalna hai',
    use: 'Truss Analysis',
    href: '/dashboard/calculators/truss-analysis',
  },
  {
    question: 'Beam ka slope ya deflection nikalna hai',
    use: 'Slope & Deflection',
    href: '/dashboard/calculators/slope-deflection',
  },
  {
    question: 'Unit load, virtual work ya Castigliano method ka question hai',
    use: 'Energy Method',
    href: '/dashboard/calculators/energy-method',
  },
  {
    question: 'Fixed beam, propped cantilever ya continuous beam hai',
    use: 'Indeterminate Beam',
    href: '/dashboard/calculators/indeterminate-beam',
  },
  {
    question: 'Distribution factor, FEM, carry over ka question hai',
    use: 'Moment Distribution',
    href: '/dashboard/calculators/moment-distribution',
  },
  {
    question: 'Clapeyron / Three Moment Theorem ka continuous beam hai',
    use: 'Three Moment Theorem',
    href: '/dashboard/calculators/three-moment-theorem',
  },
  {
    question: 'Arch ya cable structure ka question hai',
    use: 'Arches & Cables',
    href: '/dashboard/calculators/arches-cables',
  },
  {
    question: 'Moving load, wheel load ya ILD ka question hai',
    use: 'Influence Line',
    href: '/dashboard/calculators/influence-line',
  },
  {
    question: 'Portal frame ya building frame ka question hai',
    use: 'Frame Analysis',
    href: '/dashboard/calculators/frame-analysis',
  },
]

const topicSections = [
  {
    title: 'Beam Analysis',
    items: ['Support reactions', 'SFD', 'BMD', 'Combined loads', 'Deflection', 'Fixed beam', 'Continuous beam'],
  },
  {
    title: 'Truss & Frame Analysis',
    items: ['Truss member forces', 'Portal frame', 'Joint displacement', 'Member end moments', 'Axial force', 'Shear force'],
  },
  {
    title: 'Advanced Methods',
    items: ['Stiffness method', 'Moment distribution', 'Three moment theorem', 'Energy method', 'Virtual work'],
  },
  {
    title: 'Special Structures',
    items: ['Three-hinged arch', 'Two-hinged arch', 'Cable under UDL', 'Cable under point loads', 'Influence line'],
  },
]

function colorClass(color) {
  const map = {
    orange: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
    blue: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
    cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    yellow: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
    purple: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
    green: 'border-green-500/30 bg-green-500/10 text-green-300',
    sky: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
    red: 'border-red-500/30 bg-red-500/10 text-red-300',
  }

  return map[color] || map.orange
}

export default function StructuralAnalysisHubPage() {
  const [search, setSearch] = useState('')

  const filteredTools = useMemo(() => {
    const q = search.trim().toLowerCase()

    if (!q) return structuralTools

    return structuralTools.filter((tool) => {
      const text = [
        tool.name,
        tool.desc,
        tool.level,
        ...tool.bestFor,
      ]
        .join(' ')
        .toLowerCase()

      return text.includes(q)
    })
  }, [search])

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-8 text-white md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-orange-400">
            CivilCalc Pro Structural Toolkit
          </p>

          <div className="mt-4 grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <div>
              <h1 className="text-3xl font-black leading-tight md:text-5xl">
                Structural Analysis Hub
              </h1>

              <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300 md:text-lg">
                One place for beam analysis, truss analysis, slope and deflection, energy method,
                indeterminate beams, moment distribution, three moment theorem, arches, cables,
                influence lines and frame analysis.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
              <p className="text-sm font-bold text-orange-200">Total Structural Tools</p>
              <p className="mt-2 text-5xl font-black text-orange-400">{structuralTools.length}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Student-friendly + engineering calculation workflow.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {topicSections.map((section) => (
            <div key={section.title} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="text-lg font-black text-white">{section.title}</h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {section.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-bold text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_280px] md:items-center">
            <div>
              <h2 className="text-2xl font-black text-white">Find the Right Solver</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Type your topic like SFD, truss, deflection, moment distribution, arch, cable, ILD or frame.
              </p>
            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search structural tool..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-400"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-5 transition hover:-translate-y-1 hover:border-orange-500/50 hover:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl ${colorClass(tool.color)}`}>
                  {tool.icon}
                </div>

                <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-bold text-slate-300">
                  {tool.level}
                </span>
              </div>

              <h3 className="mt-5 text-2xl font-black text-white group-hover:text-orange-300">
                {tool.name}
              </h3>

              <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-400">
                {tool.desc}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {tool.bestFor.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
                <span className="text-sm font-black text-orange-300">Open Calculator</span>
                <span className="text-xl text-orange-300 transition group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="mt-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <h2 className="text-2xl font-black text-red-200">No tool found</h2>
            <p className="mt-2 text-sm text-red-100">
              Try searching: beam, truss, SFD, BMD, deflection, frame, arch, cable or ILD.
            </p>
          </div>
        )}

        <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-2xl font-black text-white">
            Which Calculator Should I Use?
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Agar user ko question dekhkar confusion ho, ye guide direct correct solver open karne me help karega.
          </p>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead className="bg-slate-950">
                <tr>
                  <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">
                    Question Type
                  </th>
                  <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">
                    Recommended Tool
                  </th>
                  <th className="border-b border-slate-800 px-4 py-3 text-sm text-white">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {guideRows.map((row) => (
                  <tr key={row.question} className="bg-slate-900/50">
                    <td className="border-b border-slate-800 px-4 py-4 text-sm leading-6 text-slate-300">
                      {row.question}
                    </td>

                    <td className="border-b border-slate-800 px-4 py-4 text-sm font-black text-orange-300">
                      {row.use}
                    </td>

                    <td className="border-b border-slate-800 px-4 py-4">
                      <Link
                        href={row.href}
                        className="inline-flex rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-black text-orange-200 hover:bg-orange-500/20"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-2xl font-black text-white">For Students</h2>

            <div className="mt-5 space-y-4">
              {[
                'Exam question ke type ke hisaab se calculator choose karo.',
                'Inputs enter karo aur result ke saath formula + step-by-step answer lo.',
                'Copy answer ya Print / Save PDF use karke assignment/report me use karo.',
                'SFD, BMD, deflection, truss, continuous beam, arch, cable aur frame sab ek jagah.',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-slate-300">
                  ✅ {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-2xl font-black text-white">For Engineers</h2>

            <div className="mt-5 space-y-4">
              {[
                'Preliminary structural calculation ke liye fast solver.',
                'Member force, reaction, moment aur displacement output quickly check karo.',
                'Site ya office me quick verification ke liye mobile-friendly workflow.',
                'PDF report export se calculation sharing easy hoti hai.',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-slate-300">
                  ✅ {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-slate-900 to-slate-950 p-6 md:p-8">
          <h2 className="text-3xl font-black text-white">
            Structural Analysis Complete Toolkit
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300 md:text-base">
            CivilCalc Pro ka Structural Analysis Hub beam, truss, frame, arch, cable aur moving load
            problems ko ek organized workflow me convert karta hai. User ko bas question type identify karna hai,
            correct solver open karna hai, inputs dalne hain aur step-by-step result mil jayega.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/calculators/structural-analysis"
              className="rounded-xl bg-orange-500 px-6 py-3 text-center font-black text-white hover:bg-orange-600"
            >
              Start Beam Analysis
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-700 px-6 py-3 text-center font-black text-slate-200 hover:border-orange-400 hover:text-orange-300"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
