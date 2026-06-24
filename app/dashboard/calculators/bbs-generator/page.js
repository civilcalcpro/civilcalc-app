'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  FolderOpen,
  Plus,
  Printer,
  RotateCcw,
  Save,
  Trash2,
  Pencil,
} from 'lucide-react'

const PROJECTS_KEY = 'civilcalcpro_bbs_saved_projects_v2'

const today = new Date().toISOString().slice(0, 10)

const defaultProject = {
  id: '',
  projectName: '',
  clientName: '',
  location: '',
  preparedBy: '',
  date: today,
  structureType: 'Residential Building',
  revisionNo: 'R0',
  steelRate: '65',
  wastagePercent: '3',
  unitSystem: 'metric',
  items: [],
}

const defaultForm = {
  barMark: 'B1',
  member: 'Beam',
  barType: 'Main Bar',
  shape: 'Straight Bar',
  diameter: '12',
  length: '4',
  width: '0.23',
  depth: '0.45',
  clearCover: '25',
  spacing: '',
  noOfBars: '4',
  hookCount: '0',
  bendCount: '0',
  hookFactor: '9',
  manualCuttingLength: '',
  remarks: '',
}

const memberOptions = ['Beam', 'Column', 'Slab', 'Footing', 'Staircase', 'Retaining Wall']
const barTypeOptions = ['Main Bar', 'Distribution Bar', 'Stirrups / Rings', 'Extra Bar', 'Bent-up Bar', 'Manual Bar']
const shapeOptions = ['Straight Bar', 'Stirrup / Ring', 'L Bar', 'U Bar', 'Manual Cutting Length']
const diameterOptions = [6, 8, 10, 12, 16, 20, 25, 28, 32, 36, 40]

function n(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function round(value, decimals = 2) {
  const factor = 10 ** decimals
  return Math.round((n(value) + Number.EPSILON) * factor) / factor
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function currency(value) {
  return `₹${new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(n(value))}`
}

function getLengthUnit(project) {
  return project.unitSystem === 'imperial' ? 'ft' : 'm'
}

function getCoverUnit(project) {
  return project.unitSystem === 'imperial' ? 'in' : 'mm'
}

function lengthToMeter(value, project) {
  const valueNumber = n(value)
  return project.unitSystem === 'imperial' ? valueNumber * 0.3048 : valueNumber
}

function meterToDisplay(value, project) {
  if (project.unitSystem === 'imperial') {
    return `${round(value / 0.3048, 2)} ft`
  }

  return `${round(value, 3)} m`
}

function coverToMm(value, project) {
  const valueNumber = n(value)
  return project.unitSystem === 'imperial' ? valueNumber * 25.4 : valueNumber
}

function spacingToMm(value, project) {
  const valueNumber = n(value)
  return project.unitSystem === 'imperial' ? valueNumber * 25.4 : valueNumber
}

function calculateBBSItem(form, project) {
  const diameter = n(form.diameter)
  const lengthM = lengthToMeter(form.length, project)
  const widthM = lengthToMeter(form.width, project)
  const depthM = lengthToMeter(form.depth, project)
  const clearCoverMm = coverToMm(form.clearCover, project)
  const spacingMm = spacingToMm(form.spacing, project)

  const coverM = clearCoverMm / 1000
  const hookLengthM = (n(form.hookFactor, 9) * diameter) / 1000
  const bendDeductionM = (2 * diameter) / 1000

  let cuttingLengthM = 0

  if (form.shape === 'Manual Cutting Length') {
    cuttingLengthM = lengthToMeter(form.manualCuttingLength, project)
  } else if (form.shape === 'Stirrup / Ring') {
    const insideWidth = Math.max(widthM - 2 * coverM, 0)
    const insideDepth = Math.max(depthM - 2 * coverM, 0)

    cuttingLengthM =
      2 * (insideWidth + insideDepth) +
      n(form.hookCount) * hookLengthM -
      n(form.bendCount) * bendDeductionM
  } else if (form.shape === 'L Bar') {
    cuttingLengthM =
      lengthM +
      depthM +
      n(form.hookCount) * hookLengthM -
      n(form.bendCount) * bendDeductionM
  } else if (form.shape === 'U Bar') {
    cuttingLengthM =
      widthM +
      2 * depthM +
      n(form.hookCount) * hookLengthM -
      n(form.bendCount) * bendDeductionM
  } else {
    cuttingLengthM =
      lengthM +
      n(form.hookCount) * hookLengthM -
      n(form.bendCount) * bendDeductionM
  }

  cuttingLengthM = Math.max(cuttingLengthM, 0)

  const noOfBars =
    spacingMm > 0 && lengthM > 0
      ? Math.floor((lengthM * 1000) / spacingMm) + 1
      : n(form.noOfBars)

  const unitWeightKgM = diameter > 0 ? (diameter * diameter) / 162 : 0
  const totalLengthM = cuttingLengthM * noOfBars
  const totalWeightKg = totalLengthM * unitWeightKgM
  const amount = totalWeightKg * n(project.steelRate)

  return {
    cuttingLengthM: round(cuttingLengthM, 4),
    noOfBars: round(noOfBars, 0),
    unitWeightKgM: round(unitWeightKgM, 3),
    totalLengthM: round(totalLengthM, 3),
    totalWeightKg: round(totalWeightKg, 2),
    amount: round(amount, 0),
  }
}

function calculateSummary(items, project) {
  const calculated = items.map((item) => ({
    ...item,
    result: calculateBBSItem(item, project),
  }))

  const totalLengthM = calculated.reduce((sum, item) => sum + item.result.totalLengthM, 0)
  const totalWeightKg = calculated.reduce((sum, item) => sum + item.result.totalWeightKg, 0)
  const subtotal = calculated.reduce((sum, item) => sum + item.result.amount, 0)

  const wastageWeightKg = (totalWeightKg * n(project.wastagePercent)) / 100
  const finalWeightKg = totalWeightKg + wastageWeightKg
  const wastageCost = (subtotal * n(project.wastagePercent)) / 100
  const grandTotal = subtotal + wastageCost

  const diameterMap = {}

  calculated.forEach((item) => {
    const key = `${item.diameter} mm`

    if (!diameterMap[key]) {
      diameterMap[key] = {
        diameter: key,
        totalLengthM: 0,
        totalWeightKg: 0,
        amount: 0,
      }
    }

    diameterMap[key].totalLengthM += item.result.totalLengthM
    diameterMap[key].totalWeightKg += item.result.totalWeightKg
    diameterMap[key].amount += item.result.amount
  })

  return {
    calculated,
    totalLengthM: round(totalLengthM, 3),
    totalWeightKg: round(totalWeightKg, 2),
    wastageWeightKg: round(wastageWeightKg, 2),
    finalWeightKg: round(finalWeightKg, 2),
    subtotal: round(subtotal, 0),
    wastageCost: round(wastageCost, 0),
    grandTotal: round(grandTotal, 0),
    diameterSummary: Object.values(diameterMap).map((row) => ({
      ...row,
      totalLengthM: round(row.totalLengthM, 3),
      totalWeightKg: round(row.totalWeightKg, 2),
      amount: round(row.amount, 0),
    })),
  }
}

function Field({ label, hint, value, onChange, type = 'text', placeholder = '', suffix = '' }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-200">{label}</span>
      {hint ? <span className="mb-2 block text-xs text-slate-500">{hint}</span> : null}

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
        />

        {suffix ? (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
            {suffix}
          </span>
        ) : null}
      </div>
    </label>
  )
}

function SelectField({ label, hint, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-200">{label}</span>
      {hint ? <span className="mb-2 block text-xs text-slate-500">{hint}</span> : null}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-950 text-white">
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function BarDiagram({ shape, print = false }) {
  const stroke = print ? '#111827' : '#fb923c'
  const muted = print ? '#6b7280' : '#94a3b8'

  if (shape === 'Stirrup / Ring') {
    return (
      <svg viewBox="0 0 120 70" className="h-14 w-24">
        <rect x="22" y="12" width="76" height="46" rx="4" fill="none" stroke={stroke} strokeWidth="5" />
        <path d="M88 12 L102 4" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
        <path d="M98 58 L108 66" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
      </svg>
    )
  }

  if (shape === 'L Bar') {
    return (
      <svg viewBox="0 0 120 70" className="h-14 w-24">
        <path d="M18 18 H88 Q100 18 100 30 V56" fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
        <circle cx="18" cy="18" r="3" fill={muted} />
      </svg>
    )
  }

  if (shape === 'U Bar') {
    return (
      <svg viewBox="0 0 120 70" className="h-14 w-24">
        <path d="M28 16 V52 Q28 60 36 60 H84 Q92 60 92 52 V16" fill="none" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
      </svg>
    )
  }

  if (shape === 'Manual Cutting Length') {
    return (
      <svg viewBox="0 0 120 70" className="h-14 w-24">
        <path d="M18 35 H102" stroke={stroke} strokeWidth="6" strokeLinecap="round" strokeDasharray="10 7" />
        <text x="60" y="58" textAnchor="middle" fontSize="10" fill={muted}>
          Manual
        </text>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 120 70" className="h-14 w-24">
      <path d="M18 35 H102" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
      <circle cx="18" cy="35" r="3" fill={muted} />
      <circle cx="102" cy="35" r="3" fill={muted} />
    </svg>
  )
}

export default function BBSGeneratorPage() {
  const [screen, setScreen] = useState('home')
  const [savedProjects, setSavedProjects] = useState([])
  const [project, setProject] = useState(defaultProject)
  const [form, setForm] = useState(defaultForm)
  const [preview, setPreview] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROJECTS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setSavedProjects(parsed)
      }
    } catch (error) {
      console.error('Failed to load saved BBS projects', error)
    }
  }, [])

  const summary = useMemo(() => {
    return calculateSummary(project.items || [], project)
  }, [project])

  const lengthUnit = getLengthUnit(project)
  const coverUnit = getCoverUnit(project)

  function updateProject(key, value) {
    setProject((prev) => ({ ...prev, [key]: value }))
  }

  function updateForm(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setPreview(null)
  }

  function saveProjectsToStorage(projects) {
    setSavedProjects(projects)
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
  }

  function persistProject(nextProject = project) {
    const projectToSave = {
      ...nextProject,
      id: nextProject.id || makeId(),
      updatedAt: new Date().toISOString(),
    }

    const exists = savedProjects.some((item) => item.id === projectToSave.id)
    const nextProjects = exists
      ? savedProjects.map((item) => (item.id === projectToSave.id ? projectToSave : item))
      : [projectToSave, ...savedProjects]

    saveProjectsToStorage(nextProjects)
    setProject(projectToSave)
    setMessage('BBS project saved successfully.')
    return projectToSave
  }

  function startNewProject() {
    setProject({
      ...defaultProject,
      id: makeId(),
      date: today,
      items: [],
    })
    setForm(defaultForm)
    setPreview(null)
    setEditingIndex(null)
    setMessage('')
    setScreen('project-details')
  }

  function openProject(projectToOpen) {
    setProject(projectToOpen)
    setForm(defaultForm)
    setPreview(null)
    setEditingIndex(null)
    setMessage('')
    setScreen('work')
  }

  function deleteProject(projectId) {
    const ok = confirm('Delete this saved BBS project?')
    if (!ok) return

    const nextProjects = savedProjects.filter((item) => item.id !== projectId)
    saveProjectsToStorage(nextProjects)
  }

  function startCalculation() {
    if (!project.projectName.trim()) {
      alert('Please enter project name.')
      return
    }

    const savedProject = persistProject(project)
    setProject(savedProject)
    setScreen('work')
  }

  function applyShapeDefaults(shape) {
    setForm((prev) => {
      const next = { ...prev, shape }

      if (shape === 'Stirrup / Ring') {
        next.barType = 'Stirrups / Rings'
        next.diameter = '8'
        next.spacing = project.unitSystem === 'imperial' ? '6' : '150'
        next.hookCount = '2'
        next.bendCount = '4'
        next.hookFactor = '10'
        next.noOfBars = ''
      }

      if (shape === 'Straight Bar') {
        next.hookCount = '0'
        next.bendCount = '0'
      }

      if (shape === 'L Bar') {
        next.hookCount = '1'
        next.bendCount = '1'
      }

      if (shape === 'U Bar') {
        next.hookCount = '2'
        next.bendCount = '2'
      }

      if (shape === 'Manual Cutting Length') {
        next.manualCuttingLength = project.unitSystem === 'imperial' ? '3' : '1'
      }

      return next
    })

    setPreview(null)
  }

  function calculatePreview() {
    const diameter = n(form.diameter)

    if (diameter <= 0) {
      alert('Please enter valid bar diameter.')
      return
    }

    if (form.shape === 'Manual Cutting Length') {
      if (n(form.manualCuttingLength) <= 0) {
        alert('Please enter manual cutting length.')
        return
      }
    } else if (n(form.length) <= 0) {
      alert('Please enter valid length.')
      return
    }

    if (n(form.spacing) <= 0 && n(form.noOfBars) <= 0) {
      alert('Please enter spacing or number of bars.')
      return
    }

    const result = calculateBBSItem(form, project)
    setPreview(result)
    setMessage('Calculation ready. Check output and save to BBS table.')
  }

  function saveToTable() {
    if (!preview) {
      alert('Please calculate first.')
      return
    }

    const itemToSave = {
      ...form,
      id: editingIndex !== null && project.items[editingIndex]?.id ? project.items[editingIndex].id : makeId(),
    }

    const nextItems =
      editingIndex !== null
        ? project.items.map((item, index) => (index === editingIndex ? itemToSave : item))
        : [...project.items, itemToSave]

    const nextProject = {
      ...project,
      items: nextItems,
    }

    setProject(nextProject)
    persistProject(nextProject)

    setForm({
      ...defaultForm,
      barMark: `B${nextItems.length + 1}`,
      length: project.unitSystem === 'imperial' ? '12' : '4',
      width: project.unitSystem === 'imperial' ? '0.75' : '0.23',
      depth: project.unitSystem === 'imperial' ? '1.5' : '0.45',
      clearCover: project.unitSystem === 'imperial' ? '1' : '25',
    })

    setPreview(null)
    setEditingIndex(null)
    setMessage('Item saved to BBS table.')
  }

  function editItem(index) {
    setForm(project.items[index])
    setPreview(calculateBBSItem(project.items[index], project))
    setEditingIndex(index)
    setMessage('Edit mode active. Update calculation and save again.')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function duplicateItem(index) {
    const source = project.items[index]
    const copy = {
      ...source,
      id: makeId(),
      barMark: `${source.barMark}-Copy`,
    }

    const nextProject = {
      ...project,
      items: [...project.items, copy],
    }

    setProject(nextProject)
    persistProject(nextProject)
  }

  function deleteItem(index) {
    const ok = confirm('Delete this BBS item?')
    if (!ok) return

    const nextProject = {
      ...project,
      items: project.items.filter((_, itemIndex) => itemIndex !== index),
    }

    setProject(nextProject)
    persistProject(nextProject)
  }

  function resetForm() {
    setForm(defaultForm)
    setPreview(null)
    setEditingIndex(null)
  }

  function generatePDF() {
    if (!project.items.length) {
      alert('Please save at least one BBS item before generating PDF.')
      return
    }

    persistProject(project)

    setTimeout(() => {
      window.print()
    }, 100)
  }

  function changeUnitSystem(value) {
    setProject((prev) => ({
      ...prev,
      unitSystem: value,
    }))

    setForm((prev) => ({
      ...prev,
      length: value === 'imperial' ? '12' : '4',
      width: value === 'imperial' ? '0.75' : '0.23',
      depth: value === 'imperial' ? '1.5' : '0.45',
      clearCover: value === 'imperial' ? '1' : '25',
      spacing: prev.spacing ? (value === 'imperial' ? '6' : '150') : '',
    }))

    setPreview(null)
  }

  return (
    <main className="min-h-screen bg-[#050B1F] px-4 py-6 text-white sm:px-6 lg:px-8">
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          body * {
            visibility: hidden !important;
          }

          #bbs-print-report,
          #bbs-print-report * {
            visibility: visible !important;
          }

          #bbs-print-report {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            display: block !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
            padding: 18px !important;
            font-family: Arial, sans-serif !important;
          }

          .no-print {
            display: none !important;
          }

          .pdf-page-break {
            page-break-before: always;
          }

          .pdf-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
          }

          .pdf-table th,
          .pdf-table td {
            border: 1px solid #d1d5db;
            padding: 6px;
            vertical-align: middle;
          }

          .pdf-table th {
            background: #f3f4f6;
            color: #111827;
            font-weight: 700;
          }

          .pdf-card {
            border: 1px solid #d1d5db;
            border-radius: 10px;
            padding: 10px;
            margin-bottom: 10px;
          }

          .pdf-title {
            font-size: 22px;
            font-weight: 800;
            color: #111827;
            margin-bottom: 4px;
          }

          .pdf-subtitle {
            font-size: 12px;
            color: #4b5563;
            margin-bottom: 16px;
          }
        }

        @media screen {
          #bbs-print-report {
            display: none;
          }
        }
      `}</style>

      <section className="mx-auto max-w-7xl no-print">
        {screen === 'home' && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-slate-950 via-[#07122f] to-slate-950 p-6 shadow-2xl shadow-orange-500/5">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-300">
                <Calculator size={14} />
                CivilCalc Pro BBS Tool
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Professional Bar Bending Schedule Generator
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                Project-wise BBS banao, steel cutting length calculate karo, item ko BBS table me save karo,
                aur final professional PDF generate karo.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <button
                onClick={startNewProject}
                className="group rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/20 to-slate-950 p-6 text-left transition hover:border-orange-400 hover:shadow-xl hover:shadow-orange-500/10"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white">
                  <Plus size={28} />
                </div>

                <h2 className="text-2xl font-bold text-white">New BBS Project</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Naya project start karo, project details add karo, phir multiple bars calculate karke table me save karo.
                </p>

                <span className="mt-5 inline-flex rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white">
                  Start New BBS
                </span>
              </button>

              <button
                onClick={() => setScreen('saved')}
                className="group rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-left transition hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-orange-300">
                  <FolderOpen size={28} />
                </div>

                <h2 className="text-2xl font-bold text-white">Saved BBS Projects</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Pehle save kiye hue BBS projects open, edit, delete ya PDF generate karo.
                </p>

                <span className="mt-5 inline-flex rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold text-white">
                  View Saved Projects
                </span>
              </button>
            </div>
          </div>
        )}

        {screen === 'saved' && (
          <div className="space-y-6">
            <button
              onClick={() => setScreen('home')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <h1 className="text-3xl font-black">Saved BBS Projects</h1>
              <p className="mt-2 text-sm text-slate-400">
                Yaha tumhare locally saved BBS projects show honge.
              </p>

              <div className="mt-6 space-y-4">
                {savedProjects.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center">
                    <FolderOpen className="mx-auto mb-3 text-slate-500" size={34} />
                    <p className="font-semibold text-white">No saved BBS project found</p>
                    <p className="mt-1 text-sm text-slate-400">
                      New BBS Project create karo aur save karo.
                    </p>
                  </div>
                ) : (
                  savedProjects.map((saved) => {
                    const savedSummary = calculateSummary(saved.items || [], saved)

                    return (
                      <div
                        key={saved.id}
                        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
                      >
                        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                          <div>
                            <h2 className="text-xl font-bold text-white">
                              {saved.projectName || 'Untitled BBS Project'}
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                              {saved.clientName || 'No client'} • {saved.location || 'No location'} • {saved.date}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2 text-xs">
                              <span className="rounded-full bg-slate-950 px-3 py-1 text-slate-300">
                                Items: {(saved.items || []).length}
                              </span>
                              <span className="rounded-full bg-slate-950 px-3 py-1 text-slate-300">
                                Steel: {savedSummary.finalWeightKg} kg
                              </span>
                              <span className="rounded-full bg-orange-500/10 px-3 py-1 font-semibold text-orange-300">
                                Cost: {currency(savedSummary.grandTotal)}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => openProject(saved)}
                              className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white"
                            >
                              Open
                            </button>

                            <button
                              onClick={() => deleteProject(saved.id)}
                              className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {screen === 'project-details' && (
          <div className="space-y-6">
            <button
              onClick={() => setScreen('home')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <h1 className="text-3xl font-black">Project Details</h1>
              <p className="mt-2 text-sm text-slate-400">
                Ye details final BBS PDF ke first page par show hongi.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Project Name"
                  hint="Project ka naam"
                  value={project.projectName}
                  onChange={(value) => updateProject('projectName', value)}
                  placeholder="Residential Building"
                />

                <Field
                  label="Client Name"
                  hint="Client / owner name"
                  value={project.clientName}
                  onChange={(value) => updateProject('clientName', value)}
                  placeholder="Mr. Sharma"
                />

                <Field
                  label="Project Location"
                  hint="Site location"
                  value={project.location}
                  onChange={(value) => updateProject('location', value)}
                  placeholder="Ahmedabad"
                />

                <Field
                  label="Prepared By"
                  hint="Engineer / company name"
                  value={project.preparedBy}
                  onChange={(value) => updateProject('preparedBy', value)}
                  placeholder="Civil Engineer"
                />

                <Field
                  label="Date"
                  value={project.date}
                  onChange={(value) => updateProject('date', value)}
                  type="date"
                />

                <SelectField
                  label="Structure Type"
                  value={project.structureType}
                  onChange={(value) => updateProject('structureType', value)}
                  options={[
                    'Residential Building',
                    'Commercial Building',
                    'Industrial Building',
                    'Infrastructure Project',
                    'Other',
                  ]}
                />

                <Field
                  label="Revision No."
                  value={project.revisionNo}
                  onChange={(value) => updateProject('revisionNo', value)}
                  placeholder="R0"
                />

                <SelectField
                  label="Unit System"
                  hint="Metric ya Imperial select karo"
                  value={project.unitSystem}
                  onChange={changeUnitSystem}
                  options={['metric', 'imperial']}
                />

                <Field
                  label="Steel Rate"
                  hint="Steel ka rate"
                  value={project.steelRate}
                  onChange={(value) => updateProject('steelRate', value)}
                  type="number"
                  suffix="₹/kg"
                />

                <Field
                  label="Wastage"
                  hint="Usually 2% to 5%"
                  value={project.wastagePercent}
                  onChange={(value) => updateProject('wastagePercent', value)}
                  type="number"
                  suffix="%"
                />
              </div>

              <button
                onClick={startCalculation}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              >
                <Calculator size={18} />
                Start BBS Calculation
              </button>
            </div>
          </div>
        )}

        {screen === 'work' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => setScreen('home')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => persistProject(project)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold text-white"
                >
                  <Save size={16} />
                  Save Project
                </button>

                <button
                  onClick={generatePDF}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white"
                >
                  <Printer size={16} />
                  Generate PDF
                </button>
              </div>
            </div>

            {message ? (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                <CheckCircle2 size={16} />
                {message}
              </div>
            ) : null}

            <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-slate-950 via-[#07122f] to-slate-950 p-6">
              <h1 className="text-3xl font-black">
                {project.projectName || 'BBS Project'}
              </h1>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-slate-950 px-3 py-1 text-slate-300">
                  Client: {project.clientName || '-'}
                </span>
                <span className="rounded-full bg-slate-950 px-3 py-1 text-slate-300">
                  Location: {project.location || '-'}
                </span>
                <span className="rounded-full bg-slate-950 px-3 py-1 text-slate-300">
                  Unit: {project.unitSystem === 'imperial' ? 'Imperial' : 'Metric'}
                </span>
                <span className="rounded-full bg-orange-500/10 px-3 py-1 font-semibold text-orange-300">
                  Total Steel: {summary.finalWeightKg} kg
                </span>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black">
                      {editingIndex !== null ? 'Edit BBS Item' : 'New BBS Item'}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Input dalo, calculate karo, phir output sahi lage toh BBS table me save karo.
                    </p>
                  </div>

                  <button
                    onClick={resetForm}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-white"
                  >
                    <RotateCcw size={15} />
                    Reset
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Bar Mark"
                    hint="Example: B1, S1, C1"
                    value={form.barMark}
                    onChange={(value) => updateForm('barMark', value)}
                  />

                  <SelectField
                    label="Member Type"
                    hint="Beam / Column / Slab"
                    value={form.member}
                    onChange={(value) => updateForm('member', value)}
                    options={memberOptions}
                  />

                  <SelectField
                    label="Bar Type"
                    value={form.barType}
                    onChange={(value) => updateForm('barType', value)}
                    options={barTypeOptions}
                  />

                  <SelectField
                    label="Shape / Diagram"
                    value={form.shape}
                    onChange={applyShapeDefaults}
                    options={shapeOptions}
                  />

                  <SelectField
                    label="Bar Diameter"
                    value={form.diameter}
                    onChange={(value) => updateForm('diameter', value)}
                    options={diameterOptions.map(String)}
                  />

                  <Field
                    label="Length"
                    hint={`Member length in ${lengthUnit}`}
                    value={form.length}
                    onChange={(value) => updateForm('length', value)}
                    type="number"
                    suffix={lengthUnit}
                  />

                  <Field
                    label="Width"
                    hint={`Member width in ${lengthUnit}`}
                    value={form.width}
                    onChange={(value) => updateForm('width', value)}
                    type="number"
                    suffix={lengthUnit}
                  />

                  <Field
                    label="Depth / Height"
                    hint={`Member depth/height in ${lengthUnit}`}
                    value={form.depth}
                    onChange={(value) => updateForm('depth', value)}
                    type="number"
                    suffix={lengthUnit}
                  />

                  <Field
                    label="Clear Cover"
                    hint={`Cover in ${coverUnit}`}
                    value={form.clearCover}
                    onChange={(value) => updateForm('clearCover', value)}
                    type="number"
                    suffix={coverUnit}
                  />

                  <Field
                    label="Spacing"
                    hint={`Optional. Use if bars are based on spacing.`}
                    value={form.spacing}
                    onChange={(value) => updateForm('spacing', value)}
                    type="number"
                    suffix={coverUnit}
                  />

                  <Field
                    label="No. of Bars"
                    hint="Use if spacing is not given"
                    value={form.noOfBars}
                    onChange={(value) => updateForm('noOfBars', value)}
                    type="number"
                    suffix="nos"
                  />

                  <Field
                    label="Hook Count"
                    value={form.hookCount}
                    onChange={(value) => updateForm('hookCount', value)}
                    type="number"
                    suffix="nos"
                  />

                  <Field
                    label="Bend Count"
                    value={form.bendCount}
                    onChange={(value) => updateForm('bendCount', value)}
                    type="number"
                    suffix="nos"
                  />

                  <Field
                    label="Hook Length Factor"
                    hint="Example: 9D or 10D"
                    value={form.hookFactor}
                    onChange={(value) => updateForm('hookFactor', value)}
                    type="number"
                    suffix="D"
                  />

                  <Field
                    label="Manual Cutting Length"
                    hint={`Only for manual shape. Unit: ${lengthUnit}`}
                    value={form.manualCuttingLength}
                    onChange={(value) => updateForm('manualCuttingLength', value)}
                    type="number"
                    suffix={lengthUnit}
                  />

                  <Field
                    label="Remarks"
                    hint="Example: Top bar, bottom bar, stirrup"
                    value={form.remarks}
                    onChange={(value) => updateForm('remarks', value)}
                  />
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={calculatePreview}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 text-sm font-black text-white"
                  >
                    <Calculator size={18} />
                    Calculate Bar
                  </button>

                  <button
                    onClick={saveToTable}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-orange-500/40 bg-orange-500/10 px-5 py-4 text-sm font-black text-orange-300"
                  >
                    <Save size={18} />
                    Save to BBS Table
                  </button>
                </div>
              </section>

              <aside className="space-y-6">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                  <h2 className="text-xl font-black">Shape Diagram</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Ye diagram PDF me bhi print hoga.
                  </p>

                  <div className="mt-5 flex items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
                    <BarDiagram shape={form.shape} />
                  </div>
                </div>

                <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/20 to-slate-950 p-5">
                  <h2 className="text-xl font-black">Output Preview</h2>
                  <p className="mt-1 text-sm text-slate-300">
                    Pehle calculate karo, phir save to BBS table.
                  </p>

                  {!preview ? (
                    <div className="mt-5 rounded-2xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">
                      No calculation yet.
                    </div>
                  ) : (
                    <div className="mt-5 space-y-3">
                      <SummaryRow label="Cutting Length" value={meterToDisplay(preview.cuttingLengthM, project)} />
                      <SummaryRow label="No. of Bars" value={`${preview.noOfBars} nos`} />
                      <SummaryRow label="Total Length" value={meterToDisplay(preview.totalLengthM, project)} />
                      <SummaryRow label="Unit Weight" value={`${preview.unitWeightKgM} kg/m`} />
                      <SummaryRow label="Steel Weight" value={`${preview.totalWeightKg} kg`} highlight />
                      <SummaryRow label="Amount" value={currency(preview.amount)} highlight />
                    </div>
                  )}
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
                  <h2 className="text-xl font-black">Final Summary</h2>

                  <div className="mt-5 space-y-3">
                    <SummaryRow label="Total Length" value={meterToDisplay(summary.totalLengthM, project)} />
                    <SummaryRow label="Steel Weight" value={`${summary.totalWeightKg} kg`} />
                    <SummaryRow label="Wastage Weight" value={`${summary.wastageWeightKg} kg`} />
                    <SummaryRow label="Final Steel" value={`${summary.finalWeightKg} kg`} highlight />
                    <SummaryRow label="Grand Total" value={currency(summary.grandTotal)} highlight />
                  </div>
                </div>
              </aside>
            </div>

            <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black">BBS Table</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Saved items yaha add hote rahenge.
                  </p>
                </div>

                <span className="rounded-full bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-300">
                  {summary.calculated.length} Items
                </span>
              </div>

              {summary.calculated.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center">
                  <Calculator className="mx-auto mb-3 text-slate-500" size={34} />
                  <p className="font-semibold text-white">No item saved yet</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Calculate karke Save to BBS Table button click karo.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1150px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-400">
                        <th className="px-3 py-3">S.No</th>
                        <th className="px-3 py-3">Diagram</th>
                        <th className="px-3 py-3">Bar Mark</th>
                        <th className="px-3 py-3">Member</th>
                        <th className="px-3 py-3">Bar Type</th>
                        <th className="px-3 py-3">Dia</th>
                        <th className="px-3 py-3">Cutting Length</th>
                        <th className="px-3 py-3">Nos</th>
                        <th className="px-3 py-3">Total Length</th>
                        <th className="px-3 py-3">Weight</th>
                        <th className="px-3 py-3">Amount</th>
                        <th className="px-3 py-3">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {summary.calculated.map((item, index) => (
                        <tr key={item.id} className="border-b border-slate-800 text-slate-200">
                          <td className="px-3 py-4">{index + 1}</td>
                          <td className="px-3 py-4">
                            <BarDiagram shape={item.shape} />
                          </td>
                          <td className="px-3 py-4 font-bold text-white">{item.barMark}</td>
                          <td className="px-3 py-4">{item.member}</td>
                          <td className="px-3 py-4">{item.barType}</td>
                          <td className="px-3 py-4">{item.diameter} mm</td>
                          <td className="px-3 py-4">{meterToDisplay(item.result.cuttingLengthM, project)}</td>
                          <td className="px-3 py-4">{item.result.noOfBars} nos</td>
                          <td className="px-3 py-4">{meterToDisplay(item.result.totalLengthM, project)}</td>
                          <td className="px-3 py-4 font-bold text-orange-300">{item.result.totalWeightKg} kg</td>
                          <td className="px-3 py-4 font-bold text-white">{currency(item.result.amount)}</td>
                          <td className="px-3 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => editItem(index)}
                                className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                                title="Edit"
                              >
                                <Pencil size={15} />
                              </button>

                              <button
                                onClick={() => duplicateItem(index)}
                                className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                                title="Duplicate"
                              >
                                <Copy size={15} />
                              </button>

                              <button
                                onClick={() => deleteItem(index)}
                                className="rounded-lg border border-red-500/40 bg-red-500/10 p-2 text-red-300"
                                title="Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}
      </section>

      <PrintReport project={project} summary={summary} />
    </main>
  )
}

function SummaryRow({ label, value, highlight = false }) {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl p-4 ${
        highlight
          ? 'border border-orange-400 bg-orange-500/20'
          : 'border border-slate-800 bg-slate-950/70'
      }`}
    >
      <span className="text-sm text-slate-300">{label}</span>
      <strong className={highlight ? 'text-orange-200' : 'text-white'}>{value}</strong>
    </div>
  )
}

function PrintReport({ project, summary }) {
  return (
    <section id="bbs-print-report">
      <div>
        <div className="pdf-title">CivilCalc Pro - Bar Bending Schedule Report</div>
        <div className="pdf-subtitle">
          Professional BBS report generated for steel quantity, cutting length, wastage and cost estimation.
        </div>

        <div className="pdf-card">
          <h2 style={{ margin: '0 0 10px', fontSize: 16 }}>Project Details</h2>

          <table className="pdf-table">
            <tbody>
              <tr>
                <th>Project Name</th>
                <td>{project.projectName || '-'}</td>
                <th>Client Name</th>
                <td>{project.clientName || '-'}</td>
              </tr>
              <tr>
                <th>Location</th>
                <td>{project.location || '-'}</td>
                <th>Prepared By</th>
                <td>{project.preparedBy || '-'}</td>
              </tr>
              <tr>
                <th>Date</th>
                <td>{project.date || '-'}</td>
                <th>Structure Type</th>
                <td>{project.structureType || '-'}</td>
              </tr>
              <tr>
                <th>Revision No.</th>
                <td>{project.revisionNo || '-'}</td>
                <th>Unit System</th>
                <td>{project.unitSystem === 'imperial' ? 'Imperial' : 'Metric'}</td>
              </tr>
              <tr>
                <th>Steel Rate</th>
                <td>{currency(project.steelRate)} / kg</td>
                <th>Wastage</th>
                <td>{project.wastagePercent || 0}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pdf-card">
          <h2 style={{ margin: '0 0 10px', fontSize: 16 }}>Total Summary</h2>

          <table className="pdf-table">
            <tbody>
              <tr>
                <th>Total Steel Length</th>
                <td>{meterToDisplay(summary.totalLengthM, project)}</td>
                <th>Total Steel Weight</th>
                <td>{summary.totalWeightKg} kg</td>
              </tr>
              <tr>
                <th>Wastage Weight</th>
                <td>{summary.wastageWeightKg} kg</td>
                <th>Final Steel Weight</th>
                <td>{summary.finalWeightKg} kg</td>
              </tr>
              <tr>
                <th>Subtotal</th>
                <td>{currency(summary.subtotal)}</td>
                <th>Grand Total</th>
                <td>{currency(summary.grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pdf-card">
          <h2 style={{ margin: '0 0 10px', fontSize: 16 }}>Diameter-wise Summary</h2>

          <table className="pdf-table">
            <thead>
              <tr>
                <th>Diameter</th>
                <th>Total Length</th>
                <th>Total Weight</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {summary.diameterSummary.length === 0 ? (
                <tr>
                  <td colSpan="4">No data available</td>
                </tr>
              ) : (
                summary.diameterSummary.map((row) => (
                  <tr key={row.diameter}>
                    <td>{row.diameter}</td>
                    <td>{meterToDisplay(row.totalLengthM, project)}</td>
                    <td>{row.totalWeightKg} kg</td>
                    <td>{currency(row.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pdf-page-break" />

        <div className="pdf-title">BBS Table</div>
        <div className="pdf-subtitle">
          All dimensions, quantities, weights and amounts include their respective units.
        </div>

        <table className="pdf-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Diagram</th>
              <th>Bar Mark</th>
              <th>Member</th>
              <th>Bar Type</th>
              <th>Shape</th>
              <th>Dia</th>
              <th>Cutting Length</th>
              <th>Nos</th>
              <th>Total Length</th>
              <th>Unit Weight</th>
              <th>Total Weight</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {summary.calculated.length === 0 ? (
              <tr>
                <td colSpan="13">No BBS item saved</td>
              </tr>
            ) : (
              summary.calculated.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    <BarDiagram shape={item.shape} print />
                  </td>
                  <td>{item.barMark}</td>
                  <td>{item.member}</td>
                  <td>{item.barType}</td>
                  <td>{item.shape}</td>
                  <td>{item.diameter} mm</td>
                  <td>{meterToDisplay(item.result.cuttingLengthM, project)}</td>
                  <td>{item.result.noOfBars} nos</td>
                  <td>{meterToDisplay(item.result.totalLengthM, project)}</td>
                  <td>{item.result.unitWeightKgM} kg/m</td>
                  <td>{item.result.totalWeightKg} kg</td>
                  <td>{currency(item.result.amount)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div style={{ marginTop: 18, fontSize: 10, color: '#4b5563' }}>
          Note: This report is generated for estimation and site planning purpose. Final structural detailing should be verified by a qualified structural engineer.
        </div>
      </div>
    </section>
  )
}
