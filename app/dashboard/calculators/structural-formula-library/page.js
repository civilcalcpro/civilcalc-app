'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

const formulaSections = [
  {
    category: 'Beam Analysis',
    icon: '📊',
    href: '/dashboard/calculators/structural-analysis',
    color: 'orange',
    desc: 'Beam reactions, shear force, bending moment, point load, UDL, UVL and cantilever formulas.',
    formulas: [
      {
        name: 'Simply Supported Beam - Point Load',
        equation: 'RA = P(L - a) / L, RB = Pa / L',
        use: 'Use when a point load P is placed at distance a from left support.',
        units: 'P in kN, L and a in m, reactions in kN',
      },
      {
        name: 'Simply Supported Beam - Central Point Load',
        equation: 'RA = RB = P / 2, Mmax = PL / 4',
        use: 'Use when point load is exactly at midspan.',
        units: 'Moment in kN·m',
      },
      {
        name: 'Simply Supported Beam - Full UDL',
        equation: 'RA = RB = wL / 2, Mmax = wL² / 8',
        use: 'Use when UDL acts on the entire span.',
        units: 'w in kN/m, L in m',
      },
      {
        name: 'Cantilever Beam - End Point Load',
        equation: 'Vmax = P, Mmax = PL',
        use: 'Use when point load acts at free end of cantilever.',
        units: 'Shear in kN, moment in kN·m',
      },
      {
        name: 'Cantilever Beam - Full UDL',
        equation: 'Vmax = wL, Mmax = wL² / 2',
        use: 'Use when UDL acts on full cantilever span.',
        units: 'w in kN/m, L in m',
      },
      {
        name: 'Triangular Load / UVL Resultant',
        equation: 'W = wL / 2, acts at L/3 from heavier end',
        use: 'Use for uniformly varying load from zero to maximum intensity.',
        units: 'W in kN',
      },
    ],
  },
  {
    category: 'SFD / BMD',
    icon: '📈',
    href: '/dashboard/calculators/structural-analysis',
    color: 'blue',
    desc: 'Core relation between load, shear force and bending moment.',
    formulas: [
      {
        name: 'Load-Shear Relation',
        equation: 'dV/dx = -w',
        use: 'Use to understand how shear force changes with distributed load.',
        units: 'V in kN, w in kN/m',
      },
      {
        name: 'Shear-Moment Relation',
        equation: 'dM/dx = V',
        use: 'Use to find where maximum bending moment occurs. Maximum BM occurs where shear force is zero.',
        units: 'M in kN·m',
      },
      {
        name: 'Moment from Shear Area',
        equation: 'Change in BM = Area under SFD',
        use: 'Use for drawing BMD from SFD.',
        units: 'kN × m = kN·m',
      },
      {
        name: 'Shear from Load Area',
        equation: 'Change in SF = Area under load diagram',
        use: 'Use for drawing SFD from loading diagram.',
        units: 'kN/m × m = kN',
      },
    ],
  },
  {
    category: 'Slope & Deflection',
    icon: '📉',
    href: '/dashboard/calculators/slope-deflection',
    color: 'cyan',
    desc: 'Important deflection formulas for beams and elastic curve analysis.',
    formulas: [
      {
        name: 'Curvature Equation',
        equation: 'EI d²y/dx² = M',
        use: 'Basic differential equation for beam deflection.',
        units: 'EI in kN·m², M in kN·m',
      },
      {
        name: 'Simply Supported Beam - Central Point Load Deflection',
        equation: 'δmax = PL³ / 48EI',
        use: 'Use for central point load on simply supported beam.',
        units: 'Deflection in m or mm',
      },
      {
        name: 'Simply Supported Beam - Full UDL Deflection',
        equation: 'δmax = 5wL⁴ / 384EI',
        use: 'Use for UDL over full simply supported span.',
        units: 'Deflection in m or mm',
      },
      {
        name: 'Cantilever - End Point Load Deflection',
        equation: 'δmax = PL³ / 3EI, θ = PL² / 2EI',
        use: 'Use for point load at free end of cantilever.',
        units: 'θ in radians',
      },
      {
        name: 'Cantilever - Full UDL Deflection',
        equation: 'δmax = wL⁴ / 8EI, θ = wL³ / 6EI',
        use: 'Use for UDL on full cantilever.',
        units: 'Deflection in m or mm',
      },
      {
        name: 'Moment Area Theorem 1',
        equation: 'Change in slope = Area of M/EI diagram',
        use: 'Use in moment area method.',
        units: 'Radians',
      },
      {
        name: 'Moment Area Theorem 2',
        equation: 'Tangential deviation = Moment of area of M/EI diagram',
        use: 'Use to calculate deflection between two points.',
        units: 'm or mm',
      },
    ],
  },
  {
    category: 'Truss Analysis',
    icon: '🔺',
    href: '/dashboard/calculators/truss-analysis',
    color: 'green',
    desc: 'Method of joints, method of sections and zero-force member rules.',
    formulas: [
      {
        name: 'Joint Equilibrium',
        equation: 'ΣFx = 0, ΣFy = 0',
        use: 'Use at every joint in method of joints.',
        units: 'Forces in kN',
      },
      {
        name: 'Section Equilibrium',
        equation: 'ΣFx = 0, ΣFy = 0, ΣM = 0',
        use: 'Use in method of sections to find selected member forces quickly.',
        units: 'Forces in kN, moments in kN·m',
      },
      {
        name: 'Zero Force Member Rule 1',
        equation: 'If two non-collinear members meet at unloaded joint, both are zero-force members.',
        use: 'Use to simplify truss before calculation.',
        units: '-',
      },
      {
        name: 'Zero Force Member Rule 2',
        equation: 'If three members meet at unloaded joint and two are collinear, third member is zero-force member.',
        use: 'Use to identify zero-force member.',
        units: '-',
      },
      {
        name: 'Tension / Compression Sign',
        equation: '+ve = Tension, -ve = Compression',
        use: 'Use for final member force interpretation.',
        units: 'kN',
      },
    ],
  },
  {
    category: 'Energy Method',
    icon: '⚡',
    href: '/dashboard/calculators/energy-method',
    color: 'yellow',
    desc: 'Unit load method, virtual work, strain energy and Castigliano formulas.',
    formulas: [
      {
        name: 'Strain Energy in Bending',
        equation: 'U = ∫ M² / 2EI dx',
        use: 'Use for beam bending strain energy.',
        units: 'kN·m',
      },
      {
        name: 'Strain Energy in Axial Member',
        equation: 'U = P²L / 2AE',
        use: 'Use for axial bar/member strain energy.',
        units: 'kN·m',
      },
      {
        name: 'Unit Load Method for Beam Deflection',
        equation: 'δ = ∫ Mm / EI dx',
        use: 'Use to find deflection at a point in desired direction.',
        units: 'm or mm',
      },
      {
        name: 'Unit Load Method for Truss',
        equation: 'δ = Σ(F f L / AE)',
        use: 'Use to find joint displacement in truss.',
        units: 'm or mm',
      },
      {
        name: 'Castigliano Theorem',
        equation: 'δ = ∂U / ∂P',
        use: 'Use to find deflection corresponding to load P.',
        units: 'm or mm',
      },
      {
        name: 'Rotation by Castigliano',
        equation: 'θ = ∂U / ∂M',
        use: 'Use to find rotation corresponding to applied moment.',
        units: 'Radians',
      },
    ],
  },
  {
    category: 'Indeterminate Beam',
    icon: '🏗️',
    href: '/dashboard/calculators/indeterminate-beam',
    color: 'orange',
    desc: 'Fixed beam, propped cantilever, continuous beam and stiffness method formulas.',
    formulas: [
      {
        name: 'Static Indeterminacy',
        equation: 'Ds = Number of reaction components - Number of equilibrium equations',
        use: 'Use to identify whether structure is determinate or indeterminate.',
        units: '-',
      },
      {
        name: 'Fixed Beam with Full UDL - Fixed End Moment',
        equation: 'FEMAB = -wL²/12, FEMBA = +wL²/12',
        use: 'Use for fixed beam / moment distribution / stiffness method.',
        units: 'kN·m',
      },
      {
        name: 'Fixed Beam with Central Point Load - Fixed End Moment',
        equation: 'FEMAB = -PL/8, FEMBA = +PL/8',
        use: 'Use for central point load on fixed beam.',
        units: 'kN·m',
      },
      {
        name: 'Beam Element Stiffness Concept',
        equation: '[K]{D} = {F}',
        use: 'Use in stiffness method for indeterminate beam.',
        units: '-',
      },
      {
        name: 'Reaction Recovery',
        equation: '{R} = [K]{D} - {F}',
        use: 'Use after solving unknown displacements.',
        units: 'kN, kN·m',
      },
    ],
  },
  {
    category: 'Moment Distribution',
    icon: '🔁',
    href: '/dashboard/calculators/moment-distribution',
    color: 'purple',
    desc: 'Hardy Cross moment distribution method formulas.',
    formulas: [
      {
        name: 'Member Stiffness - Far End Fixed',
        equation: 'K = 4EI / L',
        use: 'Use for distribution factor when far end is fixed.',
        units: 'EI/L',
      },
      {
        name: 'Member Stiffness - Far End Hinged',
        equation: 'K = 3EI / L',
        use: 'Use when far end is hinged.',
        units: 'EI/L',
      },
      {
        name: 'Distribution Factor',
        equation: 'DF = Member stiffness / Sum of stiffness at joint',
        use: 'Use to distribute unbalanced moment at joint.',
        units: '-',
      },
      {
        name: 'Carry Over Factor',
        equation: 'COF = 1/2',
        use: 'Use for prismatic member with far end fixed.',
        units: '-',
      },
      {
        name: 'Distributed Moment',
        equation: 'Distributed moment = -Unbalanced moment × DF',
        use: 'Use at each joint during moment distribution.',
        units: 'kN·m',
      },
      {
        name: 'Final End Moment',
        equation: 'Final moment = FEM + distributed moments + carry-over moments',
        use: 'Use at the end of moment distribution table.',
        units: 'kN·m',
      },
    ],
  },
  {
    category: 'Three Moment Theorem',
    icon: '📐',
    href: '/dashboard/calculators/three-moment-theorem',
    color: 'green',
    desc: 'Clapeyron three moment theorem formulas for continuous beams.',
    formulas: [
      {
        name: 'Clapeyron Three Moment Theorem',
        equation: 'M1L1 + 2M2(L1 + L2) + M3L2 = -6(A1x1/L1 + A2x2/L2)',
        use: 'Use for continuous beams with constant EI and no support settlement.',
        units: 'kN·m²',
      },
      {
        name: 'Three Moment Theorem with EI',
        equation: 'M1L1/EI1 + 2M2(L1/EI1 + L2/EI2) + M3L2/EI2 = RHS',
        use: 'Use when EI differs in adjacent spans.',
        units: '-',
      },
      {
        name: 'Area Term for UDL',
        equation: 'A = wL³/12, centroid at L/2',
        use: 'Use for load-area term in three moment theorem.',
        units: 'kN·m²',
      },
      {
        name: 'End Condition',
        equation: 'For simply supported end: M = 0',
        use: 'Use as boundary condition in three moment theorem.',
        units: 'kN·m',
      },
    ],
  },
  {
    category: 'Arches & Cables',
    icon: '🌉',
    href: '/dashboard/calculators/arches-cables',
    color: 'sky',
    desc: 'Three-hinged arch, two-hinged arch, cable sag and tension formulas.',
    formulas: [
      {
        name: 'Three-Hinged Arch Horizontal Thrust',
        equation: 'H = M0c / yc',
        use: 'Use for three-hinged arch where crown hinge moment is zero.',
        units: 'kN',
      },
      {
        name: 'Parabolic Arch Ordinate',
        equation: 'y = 4hx(L - x) / L²',
        use: 'Use for parabolic arch ordinate at distance x.',
        units: 'm',
      },
      {
        name: 'Arch Bending Moment',
        equation: 'Mx = M0x - Hy',
        use: 'Use to find bending moment at any section of arch.',
        units: 'kN·m',
      },
      {
        name: 'Normal Thrust',
        equation: 'N = H cosθ + V sinθ',
        use: 'Use to find normal force along arch rib.',
        units: 'kN',
      },
      {
        name: 'Radial Shear',
        equation: 'Q = V cosθ - H sinθ',
        use: 'Use to find radial shear in arch.',
        units: 'kN',
      },
      {
        name: 'Two-Hinged Arch Horizontal Thrust',
        equation: 'H = ∫M0y/EI ds ÷ ∫y²/EI ds',
        use: 'Use for two-hinged arch by elastic method.',
        units: 'kN',
      },
      {
        name: 'Cable under UDL',
        equation: 'H = wL² / 8f',
        use: 'Use for cable carrying UDL over horizontal span.',
        units: 'kN',
      },
      {
        name: 'Cable Shape under UDL',
        equation: 'y = 4fx(L - x) / L²',
        use: 'Use for parabolic cable profile.',
        units: 'm',
      },
      {
        name: 'Cable under Point Loads',
        equation: 'y = M0 / H',
        use: 'Use for cable profile under point loads.',
        units: 'm',
      },
      {
        name: 'Cable Tension',
        equation: 'T = √(H² + V²)',
        use: 'Use to find cable tension at any section.',
        units: 'kN',
      },
    ],
  },
  {
    category: 'Influence Line & Moving Loads',
    icon: '🚚',
    href: '/dashboard/calculators/influence-line',
    color: 'red',
    desc: 'Influence line ordinates and moving load formulas.',
    formulas: [
      {
        name: 'ILD for Reaction A',
        equation: 'RA ordinate = (L - z) / L',
        use: 'Use for unit load at distance z from A on simply supported beam.',
        units: '-',
      },
      {
        name: 'ILD for Reaction B',
        equation: 'RB ordinate = z / L',
        use: 'Use for unit load at distance z from A.',
        units: '-',
      },
      {
        name: 'ILD for BM at Section',
        equation: 'BM effect = P × ILD ordinate',
        use: 'Use for moving point load or wheel load.',
        units: 'kN·m',
      },
      {
        name: 'ILD for SF at Section',
        equation: 'SF effect = P × ILD ordinate',
        use: 'Use for shear force due to moving load.',
        units: 'kN',
      },
      {
        name: 'Wheel Load Train Effect',
        equation: 'Effect = Σ(Pi × yi)',
        use: 'Use for multiple wheel loads on ILD.',
        units: 'kN or kN·m',
      },
      {
        name: 'Critical Position Concept',
        equation: 'Maximum effect occurs when heavy loads occupy high ILD ordinates.',
        use: 'Use for moving load maximum reaction, SF or BM.',
        units: '-',
      },
    ],
  },
  {
    category: 'Frame Analysis',
    icon: '🏢',
    href: '/dashboard/calculators/frame-analysis',
    color: 'orange',
    desc: '2D frame stiffness method formulas for portal frames and building frames.',
    formulas: [
      {
        name: 'Frame Joint DOF',
        equation: 'Each joint has u, v and θ',
        use: 'Use in 2D frame stiffness method.',
        units: '-',
      },
      {
        name: 'Global Stiffness Equation',
        equation: '[K]{D} = {F}',
        use: 'Main stiffness equation for frame analysis.',
        units: '-',
      },
      {
        name: 'Axial Stiffness',
        equation: 'k = EA / L',
        use: 'Use for axial deformation component in frame member.',
        units: 'kN/m',
      },
      {
        name: 'Flexural Stiffness Terms',
        equation: '12EI/L³, 6EI/L², 4EI/L, 2EI/L',
        use: 'Use in 2D beam-column element stiffness matrix.',
        units: '-',
      },
      {
        name: 'Local to Global Transformation',
        equation: '[k]global = [T]ᵀ [k]local [T]',
        use: 'Use for inclined or oriented frame members.',
        units: '-',
      },
      {
        name: 'Member End Force',
        equation: '{q} = [k]{d} - {f}',
        use: 'Use to calculate axial force, shear force and end moment.',
        units: 'kN, kN·m',
      },
      {
        name: 'Support Reactions',
        equation: '{R} = [K]{D} - {F}',
        use: 'Use after solving joint displacement vector.',
        units: 'kN, kN·m',
      },
    ],
  },
  {
    category: 'Column Buckling',
    icon: '🧱',
    href: '/dashboard/calculators/column-buckling',
    color: 'blue',
    desc: 'Euler and Rankine column buckling formulas for compression members.',
    formulas: [
      {
        name: 'Euler Critical Load',
        equation: 'Pcr = π²EI / Le²',
        use: 'Use for long slender columns.',
        units: 'kN',
      },
      {
        name: 'Effective Length',
        equation: 'Le = K × L',
        use: 'Use based on end condition of column.',
        units: 'm',
      },
      {
        name: 'Slenderness Ratio',
        equation: 'λ = Le / r',
        use: 'Use to check column slenderness.',
        units: '-',
      },
      {
        name: 'Radius of Gyration',
        equation: 'r = √(I/A)',
        use: 'Use for column buckling calculation.',
        units: 'mm or m',
      },
      {
        name: 'Rankine Formula',
        equation: 'P = σc A / (1 + α(Le/r)²)',
        use: 'Use for intermediate columns.',
        units: 'kN',
      },
    ],
  },
]

const quickGuide = [
  {
    q: 'Beam reactions, SFD, BMD?',
    tool: 'Structural Analysis',
    href: '/dashboard/calculators/structural-analysis',
  },
  {
    q: 'Truss member force?',
    tool: 'Truss Analysis',
    href: '/dashboard/calculators/truss-analysis',
  },
  {
    q: 'Slope or deflection?',
    tool: 'Slope & Deflection',
    href: '/dashboard/calculators/slope-deflection',
  },
  {
    q: 'Unit load / Castigliano?',
    tool: 'Energy Method',
    href: '/dashboard/calculators/energy-method',
  },
  {
    q: 'Continuous beam?',
    tool: 'Moment Distribution / Three Moment',
    href: '/dashboard/calculators/moment-distribution',
  },
  {
    q: 'Arch or cable?',
    tool: 'Arches & Cables',
    href: '/dashboard/calculators/arches-cables',
  },
  {
    q: 'Moving load / ILD?',
    tool: 'Influence Line',
    href: '/dashboard/calculators/influence-line',
  },
  {
    q: 'Portal frame?',
    tool: 'Frame Analysis',
    href: '/dashboard/calculators/frame-analysis',
  },
]

function colorClass(color) {
  const map = {
    orange: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
    blue: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
    cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    green: 'border-green-500/30 bg-green-500/10 text-green-300',
    yellow: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
    purple: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
    sky: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
    red: 'border-red-500/30 bg-red-500/10 text-red-300',
  }

  return map[color] || map.orange
}

function copyFormula(formula) {
  const text = `${formula.name}\nFormula: ${formula.equation}\nUse: ${formula.use}\nUnits: ${formula.units}`

  if (typeof window === 'undefined') return

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
    alert('Formula copied.')
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  alert('Formula copied.')
}

export default function StructuralFormulaLibraryPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...formulaSections.map((section) => section.category)]

  const filteredSections = useMemo(() => {
    const q = search.trim().toLowerCase()

    return formulaSections
      .filter((section) => activeCategory === 'All' || section.category === activeCategory)
      .map((section) => {
        if (!q) return section

        const formulas = section.formulas.filter((formula) => {
          const text = `${section.category} ${section.desc} ${formula.name} ${formula.equation} ${formula.use} ${formula.units}`.toLowerCase()
          return text.includes(q)
        })

        const sectionMatch = `${section.category} ${section.desc}`.toLowerCase().includes(q)

        return {
          ...section,
          formulas: sectionMatch ? section.formulas : formulas,
        }
      })
      .filter((section) => section.formulas.length > 0)
  }, [search, activeCategory])

  const totalFormulas = formulaSections.reduce((sum, section) => sum + section.formulas.length, 0)

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-8 text-white md:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-orange-400">
            CivilCalc Pro Formula Reference
          </p>

          <div className="mt-4 grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <div>
              <h1 className="text-3xl font-black leading-tight md:text-5xl">
                Structural Formula Library
              </h1>

              <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300 md:text-lg">
                Beam analysis, SFD, BMD, truss, deflection, energy method, moment distribution,
                three moment theorem, arches, cables, influence lines, frame analysis and buckling formulas
                in one organized page.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
              <p className="text-sm font-bold text-orange-200">Total Formula Cards</p>
              <p className="mt-2 text-5xl font-black text-orange-400">{totalFormulas}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                With use case, units and calculator links.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 md:p-6">
            <h2 className="text-2xl font-black text-white">Search Formula</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Search by topic: SFD, BMD, deflection, truss, FEM, cable, arch, ILD, frame or buckling.
            </p>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search formula..."
              className="mt-5 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-400"
            />

            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-4 py-2 text-xs font-black transition ${
                    activeCategory === category
                      ? 'border-orange-400 bg-orange-500 text-white'
                      : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-orange-400 hover:text-orange-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 md:p-6">
            <h2 className="text-2xl font-black text-white">Quick Guide</h2>

            <div className="mt-5 space-y-3">
              {quickGuide.slice(0, 5).map((item) => (
                <Link
                  key={item.q}
                  href={item.href}
                  className="block rounded-2xl border border-slate-800 bg-slate-950 p-4 transition hover:border-orange-500/50"
                >
                  <p className="text-sm font-bold text-slate-300">{item.q}</p>
                  <p className="mt-1 text-sm font-black text-orange-300">{item.tool} →</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {filteredSections.map((section) => (
            <div key={section.category} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-4">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-2xl ${colorClass(section.color)}`}>
                    {section.icon}
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-white">{section.category}</h2>
                    <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">{section.desc}</p>
                  </div>
                </div>

                <Link
                  href={section.href}
                  className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-5 py-3 text-center text-sm font-black text-orange-200 hover:bg-orange-500/20"
                >
                  Open Calculator
                </Link>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {section.formulas.map((formula) => (
                  <div
                    key={`${section.category}-${formula.name}`}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-black text-white">{formula.name}</h3>

                      <button
                        type="button"
                        onClick={() => copyFormula(formula)}
                        className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 hover:border-orange-400 hover:text-orange-300"
                      >
                        Copy
                      </button>
                    </div>

                    <div className="mt-4 rounded-xl border border-orange-500/20 bg-orange-500/10 p-4">
                      <p className="text-sm font-black text-orange-200">Formula</p>
                      <p className="mt-2 break-words text-lg font-black leading-8 text-orange-300">
                        {formula.equation}
                      </p>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                        <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                          Where to use
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{formula.use}</p>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                        <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                          Units
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{formula.units}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredSections.length === 0 && (
          <div className="mt-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
            <h2 className="text-2xl font-black text-red-200">No formula found</h2>
            <p className="mt-2 text-sm text-red-100">
              Try searching: beam, truss, deflection, moment, arch, cable, ILD, frame, buckling.
            </p>
          </div>
        )}

        <div className="mt-10 rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-slate-900 to-slate-950 p-6 md:p-8">
          <h2 className="text-3xl font-black text-white">
            Formula + Calculator Workflow
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300 md:text-base">
            Formula Library ka purpose ye hai ki user formula samjhe, uska use case dekhe,
            units samjhe aur direct related calculator open karke full calculation solve kar sake.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/calculators/structural-analysis-hub"
              className="rounded-xl bg-orange-500 px-6 py-3 text-center font-black text-white hover:bg-orange-600"
            >
              Open Structural Hub
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
